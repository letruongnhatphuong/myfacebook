import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Badge, Box, Button, Container, IconButton, Menu, MenuItem, TextField, Toolbar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartContext from '../context/CartContext.js';

function Navbar({ user, authReady, loggingOut, onLogout }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  let userName = '';
  if (user) {
    userName = user.displayName || user.email.split('@')[0];
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function handleLogout() {
    closeMenu();
    onLogout();
  }

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Container>
        <Toolbar component="nav" disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
          <Box component="img" src="/not-marketplace.svg" width={40} height={40} alt="Not Marketplace" />
          <TextField type="search" disabled size="small" placeholder="Search Not Marketplace"
            slotProps={{ htmlInput: { 'aria-label': 'Search Not Marketplace' } }}
            sx={{ flexGrow: 1, minWidth: 180 }} />
          <Button component={Link} to="/marketplace" variant="outlined">Not Marketplace</Button>

          <IconButton component={Link} to="/cart" aria-label={`Cart, ${cartCount} items`} title="Cart">
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {authReady && user && (
            <>
              <Button
                variant={menuAnchor ? 'contained' : 'outlined'}
                disabled={loggingOut}
                aria-haspopup="true"
                onClick={(event) => setMenuAnchor(event.currentTarget)}
              >
                {loggingOut ? 'Logging out…' : userName}
              </Button>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { width: menuAnchor ? menuAnchor.offsetWidth : 'auto' } } }}
              >
                <MenuItem component={Link} to="/user/profile" onClick={closeMenu}>Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Log out</MenuItem>
              </Menu>
            </>
          )}
          {authReady && !user && <Button component={Link} to="/" variant="outlined">Log in</Button>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
