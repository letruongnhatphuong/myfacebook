import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CartContext from './context/CartContext.js';
import { formatMoney } from './utils/salesUtils.js';
import { getStock } from './utils/stock.js';

function lineTotal(item) {
  return Number(item.price) * (item.quantity || 1);
}

function Cart() {
  const { cartItems } = useContext(CartContext);

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>Your cart</Typography>
      {cartItems.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 48 }}>🛒</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Your cart is empty. Items you add from the marketplace will show up here.
          </Typography>
          <Button component={Link} to="/marketplace" variant="contained">Browse marketplace</Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.map((item) => (
            <Card component="article" key={item.id}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {item.image ? (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Box sx={{ fontSize: 40 }}>{item.emoji || '📦'}</Box>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography component="h2" variant="subtitle1">{item.name}</Typography>
                  {item.condition && <Chip size="small" label={item.condition} sx={{ mt: 0.5 }} />}
                  <Typography variant="body2" color="text.secondary">
                    {formatMoney(Number(item.price))} each · Qty: {item.quantity || 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getStock(item)} available
                  </Typography>
                </Box>
                <Typography fontWeight="bold">{formatMoney(lineTotal(item))}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Cart;
