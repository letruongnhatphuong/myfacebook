import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Entry point to the Sell page, shown above the marketplace listings.
function SellButton() {
  return (
    <Button component={Link} to="/sell" variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>
      Sell an item
    </Button>
  );
}

export default SellButton;
