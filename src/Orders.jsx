import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getBuyerOrders } from './services/profileService.js';

const STATUS_COLORS = { completed: 'success', shipped: 'info', pending: 'warning' };

function Orders({ user, authReady }) {
  let buyerId = null;
  if (user) {
    buyerId = user.uid;
  }

  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!buyerId) return;

    async function loadOrders() {
      try {
        setOrders(await getBuyerOrders(buyerId));
      } catch {
        setError('Unable to load your orders. Please try again.');
      }
      setLoaded(true);
    }

    loadOrders();
  }, [buyerId]);

  function renderContent() {
    if (!authReady) {
      return <CircularProgress aria-label="Checking your login" />;
    }
    if (!buyerId) {
      return (
        <Alert severity="info" action={<Button component={Link} to="/" color="inherit">Log in</Button>}>
          Log in to see your orders.
        </Alert>
      );
    }
    if (!loaded) {
      return <CircularProgress aria-label="Loading your orders" />;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (orders.length === 0) {
      return <Typography color="text.secondary">You haven&apos;t ordered anything yet.</Typography>;
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders.map((order) => (
          <Card component="article" key={order.id}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {order.image ? (
                <Box
                  component="img"
                  src={order.image}
                  alt={order.productName}
                  sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }}
                />
              ) : (
                <Box sx={{ fontSize: 40 }}>📦</Box>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography component="h2" variant="subtitle1">{order.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sold by <Link to={`/user/profile/${order.sellerId}`}>{order.sellerName}</Link>
                  {' · '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography fontWeight="bold">${order.price}</Typography>
              <Chip size="small" label={order.status} color={STATUS_COLORS[order.status] || 'default'} />
              <Button component={Link} to={`/user/profile/${order.sellerId}`} variant="outlined" size="small">
                View seller
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>Your orders</Typography>
      {renderContent()}
    </Box>
  );
}

export default Orders;
