import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from './firebase.js';
import { addProduct, deleteProduct, getUserProducts } from './services/productService.js';
import { markAsSold } from './services/salesService.js';
import ProductForm from './components/ProductForm.jsx';
import MyProductList from './components/MyProductList.jsx';

function Sell({ user, authReady }) {
  // "ownerId" remembers whose products are loaded, so switching accounts never shows the wrong list.
  const [userProducts, setUserProducts] = useState({ ownerId: null, items: [], error: '' });

  useEffect(() => {
    if (!user || !db) return;
    let ignore = false; // skip stale results if the user changes before loading finishes

    getUserProducts(user.uid)
      .then((items) => {
        if (!ignore) setUserProducts({ ownerId: user.uid, items, error: '' });
      })
      .catch(() => {
        if (!ignore) setUserProducts({ ownerId: user.uid, items: [], error: 'Unable to load your items. Please refresh and try again.' });
      });

    return () => { ignore = true; };
  }, [user]);

  async function handleCreate(product) {
    try {
      const savedProduct = await addProduct(user.uid, product);
      setUserProducts((current) => ({ ...current, items: [savedProduct, ...current.items] }));
    } catch {
      throw new Error('Unable to list your item. Please try again.');
    }
  }

  async function handleDelete(product) {
    await deleteProduct(product.id);
    setUserProducts((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== product.id),
    }));
  }

  // Records the sale (Revenue + Sold history) and removes the item from the listings.
  async function handleMarkSold(product) {
    await markAsSold(product.id);
    setUserProducts((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== product.id),
    }));
  }

  const loading = Boolean(user && db) && userProducts.ownerId !== user.uid;

  function renderContent() {
    if (!authReady) {
      return <CircularProgress aria-label="Checking your login" />;
    }
    if (!user) {
      return (
        <Alert severity="info" action={<Button component={Link} to="/" color="inherit">Log in</Button>}>
          Log in to list items for sale.
        </Alert>
      );
    }
    if (!db) {
      return <Alert severity="warning">The product database is not configured yet. Please try again later.</Alert>;
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <ProductForm onCreate={handleCreate} />

        <Box component="section" aria-labelledby="my-listings-heading">
          <Typography id="my-listings-heading" component="h2" variant="h6" gutterBottom>
            Your listings{!loading && ` (${userProducts.items.length})`}
          </Typography>
          {userProducts.error && <Alert severity="error" sx={{ mb: 2 }}>{userProducts.error}</Alert>}
          {loading
            ? <CircularProgress aria-label="Loading your items" />
            : <MyProductList products={userProducts.items} onDelete={handleDelete} onMarkSold={handleMarkSold} />}
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        Sell on Not Marketplace
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        List your item for sale and manage your listings.
      </Typography>

      {renderContent()}
    </Box>
  );
}

export default Sell;
