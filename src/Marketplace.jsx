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
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CartContext from './context/CartContext'
import { Link } from 'react-router-dom';
import { getAllProducts } from './services/productService.js';
import { getUsername } from './services/profileService.js';

const ITEMS = [
  {
    id: 1,
    emoji: '🚲',
    name: 'Bicycle',
    price: 80,
    image: '/products/mountain-bike.jpg',
    category: 'Sports & Outdoors',
    condition: 'Used - Good',
    ownerId: 'seller-alex'
  },
  {
    id: 2,
    emoji: '🪑',
    name: 'Desk chair',
    price: 25,
    image: '/products/desk-chair.jpg',
    category: 'Furniture',
    condition: 'Used - Like new',
    ownerId: 'seller-maya'
  },
  {
    id: 3,
    emoji: '📚',
    name: 'Books',
    price: 15,
    image: '/products/novels.jpg',
    category: 'Books',
    condition: 'Used - Fair',
    ownerId: 'seller-sam'
  }
]

function matchesFilters(product, filters) {
  if (filters.item && !product.name.toLowerCase().includes(filters.item.toLowerCase())) return false;
  if (filters.category && product.category !== filters.category) return false;
  if (filters.condition && product.condition !== filters.condition) return false;
  if (filters.minPrice !== '' && product.price < Number(filters.minPrice)) return false;
  if (filters.maxPrice !== '' && product.price > Number(filters.maxPrice)) return false;
  return true;
}

const Marketplace = ({ filters }) => {

  const { handleAddToCart } = useContext(CartContext);
  const [favourites, setFavourites] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [sellerNames, setSellerNames] = useState({});

  // Load the products users listed on the Sell page from the database.
  useEffect(() => {
    let ignore = false;
    getAllProducts()
      .then((products) => {
        if (!ignore) setListedProducts(products);
      })
      .catch(() => {
        if (!ignore) setLoadError('Unable to load items listed by users. Showing featured items only.');
      });
    return () => { ignore = true; };
  }, []);

  const items = [...listedProducts, ...ITEMS].filter((product) => matchesFilters(product, filters));

  useEffect(() => {
    async function loadSellerNames() {
      const names = {};
      for (const product of [...listedProducts, ...ITEMS]) {
        if (product.ownerId && !names[product.ownerId]) {
          names[product.ownerId] = await getUsername(product.ownerId);
        }
      }
      setSellerNames(names);
    }

    loadSellerNames();
  }, [listedProducts]);

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
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            )
          })
        }
      </Box>
    </Box>
  )
}

export default Marketplace