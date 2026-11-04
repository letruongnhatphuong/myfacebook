import { useState } from 'react';
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
  const [liked, setLiked] = useState(false);
  const likeCount = liked ? 1 : 0;

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
          <Typography variant="body2" color="text.secondary">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant={liked ? 'contained' : 'text'}
              aria-pressed={liked}
              onClick={() => setLiked((prev) => !prev)}
            >
              {liked ? 'Liked' : 'Like'}
            </Button>
            <Button fullWidth>Comment</Button>
            <Button fullWidth>Share</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Home;