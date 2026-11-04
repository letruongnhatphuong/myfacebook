import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import Marketplace from './Marketplace.jsx';

function App() {
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
            <Button variant="contained">Home</Button>
            <Button variant="outlined">Marketplace</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ py: 4 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" component="h1" gutterBottom>Your feed</Typography>
          <Card component="article">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>P</Avatar>
                <Box>
                  <Typography component="h2" variant="subtitle1" fontWeight="bold">Phuong</Typography>
                  <Typography variant="body2" color="text.secondary">Just now · Public</Typography>
                </Box>
              </Stack>
              <Typography sx={{ mb: 3 }}>Hello everyone! This is my first post.</Typography>
              <Typography variant="body2" color="text.secondary">0 likes</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1}>
                <Button fullWidth>Like</Button>
                <Button fullWidth>Comment</Button>
                <Button fullWidth>Share</Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Marketplace />
      </Container>
    </>
  );
}

export default App;
