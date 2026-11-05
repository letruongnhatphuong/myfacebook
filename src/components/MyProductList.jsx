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
import DeleteIcon from '@mui/icons-material/DeleteIcon';

function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function MyProductList({ products, onDelete }) {
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function closeDialog() {
    if (deleting) return;
    setProductToDelete(null);
    setDeleteError('');
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(productToDelete);
      setProductToDelete(null);
    } catch {
      setDeleteError('Unable to delete this item. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

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
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setProductToDelete(product)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={Boolean(productToDelete)} onClose={closeDialog}>
        <DialogTitle>Delete this item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &quot;{productToDelete?.name}&quot; will be removed from your listings. This can&apos;t be undone.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={deleting}>Cancel</Button>
          <Button onClick={handleConfirmDelete} disabled={deleting} color="error" variant="contained">
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MyProductList;
