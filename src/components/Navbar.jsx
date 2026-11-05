import { Link } from 'react-router-dom';
import { AppBar, Box, Button, Container, TextField, Toolbar } from '@mui/material';

function Navbar({ user, authReady, loggingOut, onLogout }) {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Container>
        <Toolbar component="nav" disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
          <Box component="img" src="/not-marketplace.svg" width={40} height={40} alt="Not Marketplace" />
          <TextField type="search" disabled size="small" placeholder="Search Not Marketplace"
            slotProps={{ htmlInput: { 'aria-label': 'Search Not Marketplace' } }}
            sx={{ flexGrow: 1, minWidth: 180 }} />
          {authReady && (user ? (
            <Button onClick={onLogout} disabled={loggingOut} variant="outlined">
              {loggingOut ? 'Logging out…' : 'Log out'}
            </Button>
          ) : <Button component={Link} to="/" variant="outlined">Log in</Button>)}
          <Button component={Link} to="/marketplace" variant="outlined">Not Marketplace</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
