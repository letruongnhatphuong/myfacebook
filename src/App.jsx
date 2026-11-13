import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CartContext from './context/CartContext.js';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import {
  Alert,
  Box,
  Container,
  Typography,
} from '@mui/material';
import Login from './Login.jsx';
import Marketplace from './Marketplace.jsx';
import Cart from './Cart.jsx';
import Sell from './Sell.jsx';
import SellButton from './components/SellButton.jsx';
import Orders from './Orders.jsx';
import UserProfile from './UserProfile.jsx';
import Revenue from './Revenue.jsx';
import Sold from './Sold.jsx';
import { ensureUserProfile } from './services/profileService.js';
import { addCartItem, loadCarts, mergeGuestCart, reconcileCartStock, saveCarts } from './utils/cartStorage.js';
import { getStock } from './utils/stock.js';
import { subscribeToProducts } from './services/productService.js';
import { SAMPLE_PRODUCTS } from './data/sampleData.js';

const EMPTY_FILTERS = { item: '', category: '', minPrice: '', maxPrice: '', condition: '' };

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = pathname.replace(/\/+$/, '') || '/';
  const [carts, setCarts] = useState(() => loadCarts());
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [productsError, setProductsError] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);

  function handleHome() {
    setFilters(EMPTY_FILTERS);
    setDraftFilters(EMPTY_FILTERS);
  }
  function handleAddToCart(item) {
    if (!authReady) return;
    const owner = user ? user.uid : 'guest';
    setCarts((current) => ({
      ...current,
      [owner]: addCartItem(current[owner] || [], item),
    }));
  }
  function handleClearCart() {
    const owner = user ? user.uid : 'guest';
    setCarts((current) => ({ ...current, [owner]: [] }));
  }
  function handleUpdateQuantity(itemId, quantity) {
    const owner = user ? user.uid : 'guest';
    setCarts((current) => ({
      ...current,
      [owner]: (current[owner] || []).map((entry) => {
        if (entry.id !== itemId) return entry;
        const stock = getStock(entry);
        return { ...entry, quantity: Math.max(1, Math.min(quantity, stock)) };
      }),
    }));
  }
  function handleRemoveFromCart(itemId) {
    const owner = user ? user.uid : 'guest';
    setCarts((current) => ({
      ...current,
      [owner]: (current[owner] || []).filter((entry) => entry.id !== itemId),
    }));
  }
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!auth);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState('');
  const cartItems = authReady ? carts[user ? user.uid : 'guest'] || [] : [];

  useEffect(() => {
    return subscribeToProducts((listedProducts, fromCache) => {
      const availableProducts = [...listedProducts, ...SAMPLE_PRODUCTS];
      setProducts(availableProducts);
      setProductsError('');
      if (!fromCache) setCarts((current) => reconcileCartStock(current, availableProducts));
    }, () => {
      setProductsError('Unable to load items listed by users. Showing featured items only.');
    });
  }, []);

  useEffect(() => {
    saveCarts(carts);
  }, [carts]);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthError('');
      if (currentUser) {
        setCarts((current) => mergeGuestCart(current, currentUser.uid));
        ensureUserProfile(currentUser).catch((error) => {
          if (auth.currentUser?.uid === currentUser.uid) {
            const reason = error.code === 'permission-denied'
              ? 'The database denied access to save your public profile. Please contact the project owner.'
              : 'Your public profile could not be saved. Check your connection and refresh to retry.';
            setAuthError(`You are logged in. ${reason}`);
          }
        });
      }
      setAuthReady(true);
    }, () => {
      setUser(null);
      setAuthReady(true);
      setAuthError('Unable to check your login status. Please refresh and try again.');
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError('');
    try {
      await signOut(auth);
      setLoggingOut(false);
      navigate('/');
    } catch {
      setAuthError('Unable to log out. Please try again.');
      setLoggingOut(false);
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, handleAddToCart, handleClearCart, handleUpdateQuantity, handleRemoveFromCart, cartReady: authReady }}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {page !== '/' && (
          <Navbar
            user={user}
            authReady={authReady}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onHome={handleHome}
          />
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {page === '/marketplace' && <Sidebar filters={draftFilters} onChange={setDraftFilters} onApply={setFilters} />}

          <Container component="main" sx={{ py: 4, minWidth: 0 }}>
            {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
            {page === '/marketplace' && <SellButton />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/marketplace" element={<Marketplace filters={filters} products={products} loadError={productsError} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/sell" element={<Sell user={user} authReady={authReady} />} />
              <Route path="/orders" element={<Orders user={user} authReady={authReady} />} />
              <Route path="/revenue" element={<Revenue user={user} authReady={authReady} />} />
              <Route path="/sold" element={<Sold user={user} authReady={authReady} />} />
              <Route path="/user/profile" element={<UserProfile user={user} authReady={authReady} />} />
              <Route path="/user/profile/:userId" element={<UserProfile user={user} authReady={authReady} />} />
              <Route path="*" element={<Typography component="h1" variant="h5">Page not found</Typography>} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </CartContext.Provider>
  );
}

export default App;
