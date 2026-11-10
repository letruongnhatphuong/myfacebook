import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from './firebase.js';
import useSales from './hooks/useSales.js';
import {
  buyerLabel,
  formatMoney,
  revenueByMonth,
  salesThisMonth,
  totalRevenue,
  withRunningTotal,
} from './utils/salesUtils.js';

// One summary figure, e.g. "Total revenue $1,234.00".
function StatCard({ label, value, note }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>{label}</Typography>
        <Typography variant="h5" component="p" fontWeight={600}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{note}</Typography>
      </CardContent>
    </Card>
  );
}

// Bar chart of revenue per month, drawn as SVG so no chart library is needed.
function MonthlyRevenueChart({ months }) {
  const theme = useTheme();
  const width = 600;
  const height = 220;
  const chartTop = 28;
  const chartBottom = 190;
  const slot = width / months.length;
  const barWidth = Math.min(64, slot * 0.6);
  const highest = Math.max(...months.map((month) => month.total), 1);
  const summary = months.map((month) => `${month.label} ${formatMoney(month.total)}`).join(', ');

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Revenue per month: ${summary}`}
      sx={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <line x1="0" x2={width} y1={chartBottom} y2={chartBottom} stroke={theme.palette.divider} />
      {months.map((month, index) => {
        const barHeight = ((chartBottom - chartTop) * month.total) / highest;
        const x = index * slot + (slot - barWidth) / 2;
        const centre = index * slot + slot / 2;
        return (
          <g key={month.key}>
            <rect
              x={x}
              y={chartBottom - barHeight}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill={theme.palette.primary.main}
            />
            <text x={centre} y={chartBottom - barHeight - 8} textAnchor="middle" fontSize="13" fill={theme.palette.text.primary}>
              {month.total > 0 ? formatMoney(month.total) : ''}
            </text>
            <text x={centre} y={chartBottom + 20} textAnchor="middle" fontSize="13" fill={theme.palette.text.secondary}>
              {month.label}
            </text>
          </g>
        );
      })}
    </Box>
  );
}

function Revenue({ user, authReady }) {
  const { sales, buyerNames, error, loading } = useSales(user);

  function renderContent() {
    if (!authReady) {
      return <CircularProgress aria-label="Checking your login" />;
    }
    if (!user) {
      return (
        <Alert severity="info" action={<Button component={Link} to="/" color="inherit">Log in</Button>}>
          Log in to see your revenue.
        </Alert>
      );
    }
    if (!db) {
      return <Alert severity="warning">The sales database is not configured yet. Please try again later.</Alert>;
    }
    if (loading) {
      return <CircularProgress aria-label="Loading your revenue" />;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (sales.length === 0) {
      return (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 48 }}>💰</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No sales yet. When one of your items sells, its revenue appears here.
          </Typography>
          <Button component={Link} to="/sell" variant="contained">Go to your listings</Button>
        </Card>
      );
    }

    const total = totalRevenue(sales);
    const thisMonth = salesThisMonth(sales);
    const rows = withRunningTotal(sales);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <StatCard label="Total revenue" value={formatMoney(total)} note="all time" />
          <StatCard label="This month" value={formatMoney(totalRevenue(thisMonth))} note={`${thisMonth.length} sold this month`} />
          <StatCard label="Items sold" value={sales.length} note="completed sales" />
          <StatCard label="Average sale" value={formatMoney(total / sales.length)} note="per item" />
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography component="h2" variant="h6" gutterBottom>Revenue per month</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Last 6 months</Typography>
            <MonthlyRevenueChart months={revenueByMonth(sales)} />
          </CardContent>
        </Card>

        <Box component="section" aria-labelledby="revenue-history-heading">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Typography id="revenue-history-heading" component="h2" variant="h6">Revenue history</Typography>
            <Button component={Link} to="/sold" size="small">View sold items</Button>
          </Box>
          <TableContainer component={Card} sx={{ borderRadius: 3 }}>
            <Table size="small" aria-labelledby="revenue-history-heading">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Sold to</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Running total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>{buyerLabel(sale, buyerNames)}</TableCell>
                    <TableCell align="right">{formatMoney(Number(sale.price))}</TableCell>
                    <TableCell align="right">{formatMoney(sale.runningTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        Revenue
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Money earned from your sold items, updated as soon as a sale is completed.
      </Typography>
      {renderContent()}
    </Box>
  );
}

export default Revenue;
