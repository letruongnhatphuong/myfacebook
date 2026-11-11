const DAY = 24 * 60 * 60 * 1000;

function daysAgo(days) {
  return Date.now() - days * DAY;
}

export const SAMPLE_USERS = [
  { id: 'seller-alex', username: 'Alex Chen', bio: 'Sells bikes and bike parts.', joinedAt: daysAgo(420) },
  { id: 'seller-maya', username: 'Maya Patel', bio: 'Moving out in December, selling furniture.', joinedAt: daysAgo(200) },
  { id: 'seller-sam', username: 'Sam Rivera', bio: 'Mostly books.', joinedAt: daysAgo(35) },
  { id: 'seller-new', username: 'Jordan Lee', bio: 'New here.', joinedAt: daysAgo(3) },
];

export const SAMPLE_ORDERS = [
  { id: 'order-1', buyerId: 'buyer-w', sellerId: 'seller-alex', productName: 'Mountain bike', image: '/products/mountain-bike.jpg', price: 180, status: 'completed', createdAt: daysAgo(12) },
  { id: 'order-2', buyerId: 'buyer-w', sellerId: 'seller-maya', productName: 'Desk chair', image: '/products/desk-chair.jpg', price: 25, status: 'completed', createdAt: daysAgo(8) },
  { id: 'order-3', buyerId: 'buyer-x', sellerId: 'seller-alex', productName: 'Bike helmet', image: '/products/bike-helmet.jpg', price: 30, status: 'completed', createdAt: daysAgo(40) },
  { id: 'order-4', buyerId: 'buyer-y', sellerId: 'seller-alex', productName: 'Road bike', image: '/products/road-bike.jpg', price: 320, status: 'completed', createdAt: daysAgo(90) },
  { id: 'order-5', buyerId: 'buyer-x', sellerId: 'seller-maya', productName: 'Bookshelf', image: '/products/bookshelf.jpg', price: 55, status: 'completed', createdAt: daysAgo(30) },
  { id: 'order-6', buyerId: 'buyer-z', sellerId: 'seller-sam', productName: 'Novel set', image: '/products/novels.jpg', price: 22, status: 'completed', createdAt: daysAgo(20) },
];

export const SAMPLE_REVIEWS = [
  { id: 'review-1', sellerId: 'seller-alex', reviewerName: 'Dana W.', rating: 4, comment: 'Bike is good, chain was a bit rusty. Picked it up the same day.', createdAt: daysAgo(11) },
  { id: 'review-2', sellerId: 'seller-alex', reviewerName: 'Priya N.', rating: 5, comment: 'Fair price, quick replies.', createdAt: daysAgo(39) },
  { id: 'review-3', sellerId: 'seller-alex', reviewerName: 'Tom H.', rating: 3, comment: 'Helmet had a crack that was not in the photos. He refunded part of it.', createdAt: daysAgo(88) },
  { id: 'review-4', sellerId: 'seller-maya', reviewerName: 'Dana W.', rating: 4, comment: 'Chair works, wheels squeak a little.', createdAt: daysAgo(7) },
  { id: 'review-5', sellerId: 'seller-maya', reviewerName: 'Chris D.', rating: 2, comment: 'Shelf was wobbly and she was late to the meetup.', createdAt: daysAgo(29) },
  { id: 'review-6', sellerId: 'seller-sam', reviewerName: 'Lena K.', rating: 5, comment: 'Books were as described.', createdAt: daysAgo(19) },
  { id: 'review-7', sellerId: 'seller-sam', reviewerName: 'Mike T.', rating: 4, comment: 'One of the books had highlighting, otherwise fine.', createdAt: daysAgo(15) },
];

export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    emoji: '🚲',
    name: 'Bicycle',
    stock: 1,
    price: 80,
    image: '/products/mountain-bike.jpg',
    category: 'Sports & Outdoors',
    condition: 'Used - Good',
    ownerId: 'seller-alex'
  },
  {
    id: 2,
    emoji: '🪑',
    name: 'Desk chair',
    stock: 1,
    price: 25,
    image: '/products/desk-chair.jpg',
    category: 'Furniture',
    condition: 'Used - Like new',
    ownerId: 'seller-maya'
  },
  {
    id: 3,
    emoji: '📚',
    name: 'Books',
    stock: 3,
    price: 15,
    image: '/products/novels.jpg',
    category: 'Books',
    condition: 'Used - Fair',
    ownerId: 'seller-sam'
  }
];
