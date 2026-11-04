import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

function Home() {
  return (
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
  );
}

export default Home;
