import {
  AppBar,
  Box,
  Button,
  Container,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import Home from './Home.jsx';
import Marketplace from './Marketplace.jsx';

function App() {
  const page = window.location.pathname.replace(/\/+$/, '') || '/';

  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <Container>
          <Toolbar component="nav" disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
            <Box component="img" src="/facebook.svg" width={40} height={40} alt="Facebook" />
            <TextField
              type="search"
              disabled
              size="small"
              placeholder="Search Facebook"
              slotProps={{ htmlInput: { 'aria-label': 'Search Facebook' } }}
              sx={{ flexGrow: 1, minWidth: 180 }}
            />
            <Button
              href="/"
              variant={page === '/' ? 'contained' : 'outlined'}
              aria-current={page === '/' ? 'page' : undefined}
            >
              Home
            </Button>
            <Button
              href="/marketplace"
              variant={page === '/marketplace' ? 'contained' : 'outlined'}
              aria-current={page === '/marketplace' ? 'page' : undefined}
            >
              Marketplace
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ py: 4 }}>
        {page === '/' && <Home />}
        {page === '/marketplace' && <Marketplace />}
        {page !== '/' && page !== '/marketplace' && (
          <Typography component="h1" variant="h5">Page not found</Typography>
        )}
      </Container>
    </>
  );
}

export default App;
