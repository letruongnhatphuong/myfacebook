import { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CartContext from '../context/CartContext.js';
import { formatMoney } from '../utils/salesUtils.js';

function CartCheckout() {
  const { cartItems, handleClearCart } = useContext(CartContext);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [placedOpen, setPlacedOpen] = useState(false);

  const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );

  function placeOrder() {
    handleClearCart();
    setConfirmOpen(false);
    setPlacedOpen(true);
  }

  return (
    <Card sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom>Order summary</Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">
              {itemCount === 1 ? '1 item' : `${itemCount} items`}
            </Typography>
            <Typography>{formatMoney(total)}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">{formatMoney(total)}</Typography>
          </Box>
        </Stack>
        <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={() => setConfirmOpen(true)}
        >
          Place order
        </Button>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Place your order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are ordering {itemCount === 1 ? '1 item' : `${itemCount} items`} for {formatMoney(total)}.
            This demo does not take payment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={placeOrder}>Place order</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={placedOpen} onClose={() => setPlacedOpen(false)}>
        <DialogTitle>Order placed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thanks! Your cart has been cleared. This demo does not record orders in the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setPlacedOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default CartCheckout;
