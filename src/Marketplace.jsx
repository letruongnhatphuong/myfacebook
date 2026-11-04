import React, { useContext, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CartContext from './context/CartContext'

const ITEMS = [
  {
    id: 1,
    emoji: '🚲',
    name: 'Bicycle',
    price: 80
  },
  {
    id: 2,
    emoji: '🪑',
    name: 'Desk chair',
    price: 25
  },
  {
    id: 3,
    emoji: '📚',
    name: 'Books',
    price: 15
  }
]

const Marketplace = () => {

  const { handleAddToCart } = useContext(CartContext);
  const [favourites, setFavourites] = useState([]);

  const handleFavourite = (id) => {
    // Remove the id if it is already a favourite, otherwise add it
    if (favourites.includes(id)) {
      setFavourites(favourites.filter((favouriteId) => favouriteId !== id));
    } else {
      setFavourites([...favourites, id]);
    }
  }

  return (
    <Box component="section">
      <Typography variant="h5" component="h1" gutterBottom>
        Marketplace
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Items for sale
      </Typography>

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
          ITEMS.map((item) => {
            const isFavourite = favourites.includes(item.id);

            return (
              <Card component="article" key={item.id}>
                <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>
                  {item.emoji}
                </Box>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight="bold">${item.price}</Typography>
                    <Typography component="h3" variant="subtitle1">{item.name}</Typography>
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