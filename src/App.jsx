import { Route, Routes, useLocation } from 'react-router-dom';
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
import Sell from './Sell.jsx';
import SellButton from './components/SellButton.jsx';
import Orders from './Orders.jsx';
import UserProfile from './UserProfile.jsx';

function App() {
  const { pathname } = useLocation();
  const page = pathname.replace(/\/+$/, '') || '/';
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({ item: '', category: '', minPrice: '', maxPrice: '', condition: '' });
  function handleAddToCart(item) {
    setCartItems((items) => [...items, item]);
  }
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!auth);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    }, () => {
      setAuthError('Unable to check your login status. Please refresh and try again.');
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError('');
    try {
      await signOut(auth);
      window.location.assign('/');
    } catch {
      setAuthError('Unable to log out. Please try again.');
      setLoggingOut(false);
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, handleAddToCart }}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {page !== '/' && <Navbar user={user} authReady={authReady} loggingOut={loggingOut} onLogout={handleLogout} />}

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {page === '/marketplace' && <Sidebar onApply={setFilters} />}

          <Container component="main" sx={{ py: 4, minWidth: 0 }}>
            {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
            {page === '/marketplace' && <SellButton />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/marketplace" element={<Marketplace filters={filters} />} />
              <Route path="/sell" element={<Sell user={user} authReady={authReady} />} />
              <Route path="/orders" element={<Orders user={user} authReady={authReady} />} />
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
