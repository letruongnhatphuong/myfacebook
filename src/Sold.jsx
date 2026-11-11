import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from './firebase.js';
import useSales from './hooks/useSales.js';
import { buyerLabel, formatMoney } from './utils/salesUtils.js';
import { getSoldQuantity } from './utils/stock.js';

function Sold({ user, authReady }) {
  const { sales, buyerNames, error, loading } = useSales(user);
  const unitsSold = sales.reduce((count, sale) => count + getSoldQuantity(sale), 0);

  function renderContent() {
    if (!authReady) {
      return <CircularProgress aria-label="Checking your login" />;
    }
    if (!user) {
      return (
        <Alert severity="info" action={<Button component={Link} to="/" color="inherit">Log in</Button>}>
          Log in to see the items you sold.
        </Alert>
      );
    }
    if (!db) {
      return <Alert severity="warning">The sales database is not configured yet. Please try again later.</Alert>;
    }
    if (loading) {
      return <CircularProgress aria-label="Loading your sold items" />;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (sales.length === 0) {
      return (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 48 }}>📦</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Nothing sold yet. Items move here from your listings once they sell.
          </Typography>
          <Button component={Link} to="/sell" variant="contained">Go to your listings</Button>
        </Card>
      );
    }

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Typography component="h2" variant="h6">
            {unitsSold === 1 ? '1 item sold' : `${unitsSold} items sold`}
          </Typography>
          <Button component={Link} to="/revenue" size="small">View revenue</Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {sales.map((sale) => (
            <Card component="article" key={sale.id}>
              {sale.image ? (
                <Box
                  component="img"
                  src={sale.image}
                  alt={sale.productName}
                  sx={{ width: '100%', height: 144, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>📦</Box>
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                  <Typography component="h3" variant="subtitle1">{sale.productName}</Typography>
                  <Typography fontWeight="bold">{formatMoney(Number(sale.price))}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">Qty sold: {getSoldQuantity(sale)}</Typography>
                <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap', rowGap: 1 }}>
                  <Chip size="small" color="success" label="Sold" />
                  {sale.condition && <Chip size="small" label={sale.condition} />}
                  {sale.category && <Chip size="small" variant="outlined" label={sale.category} />}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {buyerLabel(sale, buyerNames)} · {new Date(sale.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </>
    );
  }

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        Sold
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Your sales history. Sold items leave your listings and are kept here.
      </Typography>
      {renderContent()}
    </Box>
  );
}

export default Sold;
