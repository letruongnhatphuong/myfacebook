import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getAverageRating,
  getSellerReviews,
  getSoldOrders,
  getUserProfile,
} from './services/profileService.js';

function UserProfile({ user, authReady }) {
  const { userId } = useParams();

  let currentUserId = null;
  if (user) {
    currentUserId = user.uid;
  }
  const profileId = userId || currentUserId;
  const isOwnProfile = profileId && profileId === currentUserId;

  const [profile, setProfile] = useState(null);
  const [soldOrders, setSoldOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profileId) return;

    async function loadProfile() {
      try {
        setProfile(await getUserProfile(profileId));
        setSoldOrders(await getSoldOrders(profileId));
        setReviews(await getSellerReviews(profileId));
      } catch {
        setError('Unable to load this profile. Please try again.');
      }
      setLoaded(true);
    }

    loadProfile();
  }, [profileId]);

  function renderContent() {
    if (!userId && !authReady) {
      return <CircularProgress aria-label="Checking your login" />;
    }
    if (!profileId) {
      return (
        <Alert severity="info" action={<Button component={Link} to="/" color="inherit">Log in</Button>}>
          Log in to see your profile.
        </Alert>
      );
    }
    if (!loaded) {
      return <CircularProgress aria-label="Loading profile" />;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    let username = null;
    if (profile) {
      username = profile.username;
    } else if (isOwnProfile && user) {
      username = user.displayName || user.email.split('@')[0];
    }
    if (!username) {
      return <Alert severity="warning">This user could not be found.</Alert>;
    }

    const averageRating = getAverageRating(reviews);

    let reviewText = 'No reviews yet';
    if (reviews.length === 1) {
      reviewText = '1 review';
    } else if (reviews.length > 1) {
      reviewText = `${reviews.length} reviews`;
    }

    return (
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Avatar sx={{ width: 72, height: 72, fontSize: 32, bgcolor: 'primary.main' }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h2" variant="h5" fontWeight={600}>{username}</Typography>
                {profile && profile.joinedAt && (
                  <Typography variant="body2" color="text.secondary">
                    Member since {new Date(profile.joinedAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
            {profile && profile.bio && <Typography sx={{ mt: 2 }}>{profile.bio}</Typography>}

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 3 }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h5" component="p" fontWeight={600}>
                    {averageRating === null ? '–' : averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={averageRating || 0} precision={0.1} readOnly size="small" aria-label="Average rating" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {reviewText}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>Products sold</Typography>
                <Typography variant="h5" component="p" fontWeight={600}>{soldOrders.length}</Typography>
                <Typography variant="body2" color="text.secondary">completed orders</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box component="section" aria-labelledby="sold-heading">
          <Typography id="sold-heading" component="h2" variant="h6" gutterBottom>Products sold</Typography>
          {soldOrders.length === 0 ? (
            <Typography color="text.secondary">Nothing sold yet.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {soldOrders.map((order) => (
                <Card component="article" key={order.id}>
                  {order.image ? (
                    <Box
                      component="img"
                      src={order.image}
                      alt={order.productName}
                      sx={{ width: '100%', height: 144, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box sx={{ bgcolor: 'grey.100', textAlign: 'center', p: 3, fontSize: 64 }}>📦</Box>
                  )}
                  <CardContent>
                    <Typography component="h3" variant="subtitle1">{order.productName}</Typography>
                    <Typography fontWeight="bold">${order.price}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sold {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Box component="section" aria-labelledby="reviews-heading">
          <Typography id="reviews-heading" component="h2" variant="h6" gutterBottom>Reviews</Typography>
          {reviews.length === 0 ? (
            <Typography color="text.secondary">No reviews yet.</Typography>
          ) : (
            <Card>
              {reviews.map((review, index) => (
                <Box key={review.id} component="article">
                  {index > 0 && <Divider />}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Typography fontWeight="bold">{review.reviewerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" aria-label={`${review.rating} out of 5 stars`} />
                    <Typography sx={{ mt: 0.5 }}>{review.comment}</Typography>
                  </CardContent>
                </Box>
              ))}
            </Card>
          )}
        </Box>
      </Stack>
    );
  }

  return (
    <Box component="section">
      <Button component={Link} to="/marketplace" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Not Marketplace
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        {isOwnProfile ? 'Your profile' : 'Seller profile'}
      </Typography>
      {renderContent()}
    </Box>
  );
}

export default UserProfile;
