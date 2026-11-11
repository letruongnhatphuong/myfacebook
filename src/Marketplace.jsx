import { useContext, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import CartContext from './context/CartContext'
import { Link } from 'react-router-dom';
import { getUsername } from './services/profileService.js';
import { getStock } from './utils/stock.js';


function matchesFilters(product, filters) {
  if (filters.item && !product.name.toLowerCase().includes(filters.item.toLowerCase())) return false;
  if (filters.category && product.category !== filters.category) return false;
  if (filters.condition && product.condition !== filters.condition) return false;
  if (filters.minPrice !== '' && product.price < Number(filters.minPrice)) return false;
  if (filters.maxPrice !== '' && product.price > Number(filters.maxPrice)) return false;
  return true;
}

const Marketplace = ({ filters, products, loadError }) => {

  const { cartItems, handleAddToCart, cartReady } = useContext(CartContext);
  const [favourites, setFavourites] = useState([]);
  const [addedItem, setAddedItem] = useState(null);
  const [sellerNames, setSellerNames] = useState({});

  const items = products.filter((product) => matchesFilters(product, filters));

  useEffect(() => {
    async function loadSellerNames() {
      const names = {};
      for (const product of products) {
        if (product.ownerId && !names[product.ownerId]) {
          names[product.ownerId] = await getUsername(product.ownerId);
        }
      }
      setSellerNames(names);
    }

    loadSellerNames();
  }, [products]);

  const handleFavourite = (id) => {
    if (favourites.includes(id)) {
      setFavourites(favourites.filter((favouriteId) => favouriteId !== id));
    } else {
      setFavourites([...favourites, id]);
    }
  }

  return (
    <Box component="section">
      <Typography variant="h5" component="h1" gutterBottom>
        Not Marketplace
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Items for sale
      </Typography>
      {loadError && <Alert severity="warning" sx={{ mb: 2 }}>{loadError}</Alert>}
      {items.length === 0 && <Typography color="text.secondary">No items match your search.</Typography>}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {
          items.map((item) => {
            const isFavourite = favourites.includes(item.id);
            const cartEntry = cartItems.find((cartItem) => cartItem.id === item.id);
            const stock = getStock(item);
            const limitReached = (cartEntry?.quantity || 0) >= stock;

            return (
              <Card component="article" key={item.id}>
                {item.image ? (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: '100%', height: 144, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>
                    {item.emoji || '📦'}
                  </Box>
                )}
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight="bold">${item.price}</Typography>
                    <Typography component="h3" variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stock === 0 ? 'Out of stock' : `${stock} available`}
                    </Typography>
                    {item.condition && <Chip size="small" label={item.condition} sx={{ my: 0.5 }} />}
                    {item.ownerId && (
                      <Typography variant="body2" color="text.secondary">
                        Sold by{' '}
                        <Link to={`/user/profile/${item.ownerId}`}>
                          {sellerNames[item.ownerId] || 'seller'}
                        </Link>
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    color="error"
                    aria-label={`Favourite ${item.name}`}
                    aria-pressed={isFavourite}
                    onClick={() => handleFavourite(item.id)}
                  >
                    {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    disabled={!cartReady || limitReached}
                    variant="contained"
                    color={cartEntry ? 'success' : 'primary'}
                    startIcon={cartEntry ? <CheckIcon /> : <AddShoppingCartIcon />}
                    onClick={() => {
                      handleAddToCart(item);
                      setAddedItem(item);
                    }}
                  >
                    {stock === 0 ? 'Out of stock' : limitReached ? `Limit reached (${stock})` : cartEntry
                      ? cartEntry.quantity > 1
                        ? `In cart (${cartEntry.quantity})`
                        : 'In cart'
                      : 'Add to cart'}
                  </Button>
                </CardActions>
              </Card>
            )
          })
        }
      </Box>

      <Snackbar
        open={Boolean(addedItem)}
        autoHideDuration={3000}
        onClose={() => setAddedItem(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setAddedItem(null)}
          sx={{ width: '100%' }}
        >
          {addedItem && `Added ${addedItem.name} to cart`}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Marketplace
