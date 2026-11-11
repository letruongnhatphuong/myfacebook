import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { MAX_IMAGE_FILE_SIZE, resizeImage } from '../utils/imageUtils.js';
import { MAX_STOCK } from '../utils/stock.js';

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing & Accessories',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Vehicles',
  'Other',
];

const CONDITIONS = ['New', 'Used - Like new', 'Used - Good', 'Used - Fair'];

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  stock: 1,
  category: '',
  condition: '',
  description: '',
  location: '',
};

function ProductForm({ onCreate }) {
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [processingImage, setProcessingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // One handler for every text field: copy the product and overwrite one field.
  function handleChange(event) {
    setProduct({ ...product, [event.target.name]: event.target.value });
    setMessage({ type: '', text: '' });
  }

  async function handleImageChange(event) {
    const file = event.target.files[0];
    event.target.value = ''; // lets the user pick the same file again
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Choose an image file (JPG, PNG, WEBP…).');
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      setImageError('Choose an image smaller than 5 MB.');
      return;
    }

    setImageError('');
    setProcessingImage(true);
    try {
      setImage(await resizeImage(file));
    } catch (error) {
      setImageError(error.message);
    } finally {
      setProcessingImage(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || processingImage) return;

    const stock = Number(product.stock);
    if (!Number.isSafeInteger(stock) || stock < 1 || stock > MAX_STOCK) {
      setMessage({ type: 'error', text: `Quantity must be a whole number from 1 to ${MAX_STOCK}.` });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await onCreate({
        name: product.name.trim(),
        price: Number(product.price),
        stock,
        category: product.category,
        condition: product.condition,
        description: product.description.trim(),
        location: product.location.trim(),
        image,
      });
      setProduct(EMPTY_PRODUCT);
      setImage('');
      setMessage({ type: 'success', text: 'Your item is now listed.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to list your item. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          Item for sale
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
          Fields marked with * are required.
        </Typography>

        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <Box>
            {image ? (
              <Box
                component="img"
                src={image}
                alt="Preview of your item"
                sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 2, display: 'block' }}
              />
            ) : (
              <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', fontSize: 64 }}>
                📷
              </Box>
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />} disabled={processingImage || submitting}>
                {processingImage ? 'Processing…' : image ? 'Change photo' : 'Add photo'}
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
              {image && (
                <Button color="inherit" onClick={() => setImage('')} disabled={submitting}>
                  Remove
                </Button>
              )}
            </Stack>
            {imageError && <Alert severity="error" sx={{ mt: 1 }}>{imageError}</Alert>}
          </Box>

          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ htmlInput: { maxLength: 80 } }}
          />
          <TextField
            label="Price"
            helperText="Price per item"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{
              htmlInput: { min: 0, step: '0.01' },
              input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
            }}
          />
          <TextField
            label="Quantity available"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: MAX_STOCK, step: 1 } }}
          />
          <TextField select label="Category" name="category" value={product.category} onChange={handleChange} required fullWidth>
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Condition" name="condition" value={product.condition} onChange={handleChange} required fullWidth>
            {CONDITIONS.map((condition) => (
              <MenuItem key={condition} value={condition}>{condition}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            minRows={3}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            helperText={`${product.description.length}/1000`}
          />
          <TextField
            label="Location"
            name="location"
            value={product.location}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Vancouver, BC"
            slotProps={{ htmlInput: { maxLength: 80 } }}
          />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting || processingImage}>
            {submitting ? 'Listing…' : 'List item'}
          </Button>
          {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProductForm;
