import { Route, Routes, useLocation } from 'react-router-dom';
import CartContext from './context/CartContext.js';
import Navbar from './components/Navbar.jsx';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import {
  Alert,
  Container,
  Typography,
} from '@mui/material';
import Login from './Login.jsx';
import Marketplace from './Marketplace.jsx';
import SellProduct from './SellProduct.jsx';

function App() {
  const { pathname } = useLocation();
  const page = pathname.replace(/\/+$/, '') || '/';
  const [cartItems, setCartItems] = useState([]);
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
      {page !== '/' && <Navbar user={user} authReady={authReady} loggingOut={loggingOut} onLogout={handleLogout} />}

      <Container component="main" sx={{ py: 4 }}>
        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/sell" element={<SellProduct user={user} authReady={authReady} />} />
          <Route path="*" element={<Typography component="h1" variant="h5">Page not found</Typography>} />
        </Routes>
      </Container>
    </CartContext.Provider>
  );
}

export default App;
