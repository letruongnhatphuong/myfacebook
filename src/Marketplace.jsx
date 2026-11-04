import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function Marketplace() {
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
        <Card component="article">
          <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>
            🚲
          </Box>
          <CardContent>
            <Typography fontWeight="bold">$80</Typography>
            <Typography component="h3" variant="subtitle1">Bicycle</Typography>
          </CardContent>
        </Card>

        <Card component="article">
          <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>
            🪑
          </Box>
          <CardContent>
            <Typography fontWeight="bold">$25</Typography>
            <Typography component="h3" variant="subtitle1">Desk chair</Typography>
          </CardContent>
        </Card>

        <Card component="article">
          <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>
            📚
          </Box>
          <CardContent>
            <Typography fontWeight="bold">$15</Typography>
            <Typography component="h3" variant="subtitle1">Books</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Marketplace;
