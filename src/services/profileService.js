import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { SAMPLE_ORDERS, SAMPLE_REVIEWS, SAMPLE_USERS } from '../data/sampleData.js';

function shouldUseSampleData(userId) {
  return SAMPLE_USERS.some((sampleUser) => sampleUser.id === userId);
}

function newestFirst(a, b) {
  return b.createdAt - a.createdAt;
}

function docsToList(snapshot) {
  const list = [];
  snapshot.forEach((item) => {
    list.push({ id: item.id, ...item.data() });
  });
  return list;
}

export async function getUserProfile(userId) {
  if (shouldUseSampleData(userId)) {
    return SAMPLE_USERS.find((sampleUser) => sampleUser.id === userId) || null;
  }
  const snapshot = await getDoc(doc(db, 'users', userId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getUsername(userId) {
  try {
    const profile = await getUserProfile(userId);
    return profile ? profile.username : null;
  } catch {
    return null;
  }
}

export async function getSoldOrders(sellerId) {
  if (shouldUseSampleData(sellerId)) {
    return SAMPLE_ORDERS
      .filter((order) => order.sellerId === sellerId && order.status === 'completed')
      .sort(newestFirst);
  }
  const soldQuery = query(
    collection(db, 'orders'),
    where('sellerId', '==', sellerId),
    where('status', '==', 'completed'),
  );
  const snapshot = await getDocs(soldQuery);
  return docsToList(snapshot).sort(newestFirst);
}

export async function getSellerReviews(sellerId) {
  if (shouldUseSampleData(sellerId)) {
    return SAMPLE_REVIEWS.filter((review) => review.sellerId === sellerId).sort(newestFirst);
  }
  const reviewsQuery = query(collection(db, 'reviews'), where('sellerId', '==', sellerId));
  const snapshot = await getDocs(reviewsQuery);
  return docsToList(snapshot).sort(newestFirst);
}

export async function getBuyerOrders(buyerId) {
  const ordersQuery = query(collection(db, 'orders'), where('buyerId', '==', buyerId));
  const orders = docsToList(await getDocs(ordersQuery));

  for (const order of orders) {
    order.sellerName = (await getUsername(order.sellerId)) || 'Unknown seller';
  }
  return orders.sort(newestFirst);
}

export function getAverageRating(reviews) {
  if (reviews.length === 0) return null;
  let total = 0;
  for (const review of reviews) {
    total += review.rating;
  }
  return Math.round((total / reviews.length) * 10) / 10;
}
