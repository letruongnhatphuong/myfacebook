import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const titleStyle = {
  bgcolor: 'primary.main',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  px: 2,
  py: 1,
  mt: 1,
};

function Sidebar({ onApply }) {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [sellingOpen, setSellingOpen] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
    onApply({ item, category, minPrice, maxPrice, condition });
  }

  function handleClear() {
    setItem('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCondition('');
    onApply({ item: '', category: '', minPrice: '', maxPrice: '', condition: '' });
  }

  return (
    <Box component="aside" sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, bgcolor: 'white' }}>
      <Typography sx={titleStyle}>Buying</Typography>

      <List disablePadding>
        <ListItemButton component={Link} to="/orders">
          <ListItemText primary="Order" />
        </ListItemButton>
      </List>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <TextField label="Item" size="small" value={item} onChange={(e) => setItem(e.target.value)} />

        <TextField select label="Category" size="small" value={category} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="">All categories</MenuItem>
          {CATEGORIES.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </TextField>

        <Typography variant="body2" fontWeight="bold">Price</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField label="Min" type="number" size="small" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <TextField label="Max" type="number" size="small" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </Box>

        <TextField select label="Condition" size="small" value={condition} onChange={(e) => setCondition(e.target.value)}>
          <MenuItem value="">Any condition</MenuItem>
          {CONDITIONS.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" fullWidth>Apply</Button>
          <Button variant="outlined" fullWidth onClick={handleClear}>Clear</Button>
        </Box>
      </Box>

      <Box
        onClick={() => setSellingOpen(!sellingOpen)}
        sx={{ ...titleStyle, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        Selling
        {sellingOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      {sellingOpen && (
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Revenue" />
          </ListItem>
          <ListItemButton>
            <ListItemText primary="Selling" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Sold" />
          </ListItemButton>
        </List>
      )}
    </Box>
  );
}

export default Sidebar;
