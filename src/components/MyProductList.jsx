import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SellIcon from '@mui/icons-material/Sell';

function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// The two actions a seller confirms in the dialog.
const ACTIONS = {
  sold: {
    title: 'Mark this item as sold?',
    message: (product) => `"${product.name}" will move to your Sold history and ${formatPrice(product.price)} will be added to your revenue. This can't be undone.`,
    confirm: 'Mark as sold',
    working: 'Saving…',
    color: 'primary',
    error: 'Unable to mark this item as sold. Please try again.',
  },
  delete: {
    title: 'Delete this item?',
    message: (product) => `"${product.name}" will be removed from your listings. This can't be undone.`,
    confirm: 'Delete',
    working: 'Deleting…',
    color: 'error',
    error: 'Unable to delete this item. Please try again.',
  },
};

function MyProductList({ products, onDelete, onMarkSold }) {
  // { type: 'sold' | 'delete', product } while the confirm dialog is open
  const [pendingAction, setPendingAction] = useState(null);
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState('');

  function closeDialog() {
    if (working) return;
    setPendingAction(null);
    setActionError('');
  }

  async function handleConfirm() {
    const { type, product } = pendingAction;
    setWorking(true);
    setActionError('');
    try {
      if (type === 'sold') {
        await onMarkSold(product);
      } else {
        await onDelete(product);
      }
      setPendingAction(null);
    } catch {
      setActionError(ACTIONS[type].error);
    } finally {
      setWorking(false);
    }
  }

  const action = pendingAction ? ACTIONS[pendingAction.type] : null;

  if (products.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 48 }}>📦</Typography>
        <Typography color="text.secondary">You haven&apos;t listed any items yet.</Typography>
      </Card>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {products.map((product) => (
          <Card component="article" key={product.id} sx={{ display: 'flex', flexDirection: 'column' }}>
            {product.image ? (
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>📦</Box>
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography fontWeight="bold">{formatPrice(product.price)}</Typography>
              <Typography component="h3" variant="subtitle1">{product.name}</Typography>
              <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap', rowGap: 1 }}>
                <Chip size="small" label={product.condition} />
                <Chip size="small" variant="outlined" label={product.category} />
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {product.description}
              </Typography>
              {product.location && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  📍 {product.location}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SellIcon />}
                onClick={() => setPendingAction({ type: 'sold', product })}
              >
                Mark as sold
              </Button>
              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setPendingAction({ type: 'delete', product })}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={Boolean(pendingAction)} onClose={closeDialog}>
        {action && (
          <>
            <DialogTitle>{action.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{action.message(pendingAction.product)}</DialogContentText>
              {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} disabled={working}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={working} color={action.color} variant="contained">
                {working ? action.working : action.confirm}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

export default MyProductList;
