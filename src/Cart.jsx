import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import CartContext from './context/CartContext.js';
import { formatMoney } from './utils/salesUtils.js';
import { getStock } from './utils/stock.js';
import CartCheckout from './components/CartCheckout.jsx';

function lineTotal(item) {
  return Number(item.price) * (item.quantity || 1);
}

function Cart() {
  const { cartItems, handleUpdateQuantity, handleRemoveFromCart } = useContext(CartContext);

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
          {cartItems.map((item) => {
            const quantity = item.quantity || 1;
            const stock = getStock(item);

            return (
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
                      {formatMoney(Number(item.price))} each
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stock} available
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={quantity <= 1}
                      onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{quantity}</Typography>
                    <IconButton
                      size="small"
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={quantity >= stock}
                      onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography fontWeight="bold" sx={{ minWidth: 80, textAlign: 'right' }}>
                    {formatMoney(lineTotal(item))}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
      {cartItems.length > 0 && <CartCheckout />}
    </Box>
  );
}

export default Cart;
