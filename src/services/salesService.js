import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { getStock } from '../utils/stock.js';

// A sale is one document in the "orders" collection (same fields the Orders and
// Profile pages already read), created in the same write that removes the product
// from the listings. The order reuses the product's id, so an item can only be sold once.

function requireDb() {
  if (!db) {
    throw new Error('The database is not configured.');
  }
  return db;
}

// Records a sale and moves the product out of the listings.
// The checkout/payment page calls this with the buyer's user id once payment succeeds.
// Pass buyerId = null when the seller marks an item as sold outside the app.
export async function completeSale(productId, buyerId) {
  const database = requireDb();
  const productRef = doc(database, 'products', productId);
  const orderRef = doc(database, 'orders', productId);
  const publicSaleRef = doc(database, 'publicSales', productId);

  return runTransaction(database, async (transaction) => {
    const productSnapshot = await transaction.get(productRef);
    if (!productSnapshot.exists()) {
      throw new Error('This item has already been sold or removed.');
    }

    const product = productSnapshot.data();
    const quantity = getStock(product);
    if (quantity === 0) throw new Error('This item is out of stock.');
    const order = {
      productId,
      productName: product.name,
      image: product.image || '',
      price: product.price * quantity,
      unitPrice: product.price,
      quantity,
      category: product.category || '',
      condition: product.condition || '',
      sellerId: product.ownerId,
      buyerId,
      status: 'completed',
      createdAt: Date.now(),
    };

    // Both writes succeed together or not at all.
    transaction.set(orderRef, order);
    transaction.set(publicSaleRef, {
      productId: order.productId,
      productName: order.productName,
      image: order.image,
      price: order.price,
      unitPrice: order.unitPrice,
      quantity: order.quantity,
      category: order.category,
      condition: order.condition,
      sellerId: order.sellerId,
      status: order.status,
      createdAt: order.createdAt,
    });
    transaction.delete(productRef);
    return { id: orderRef.id, ...order };
  });
}

// The seller sold the item in person (no buyer account in the app).
export function markAsSold(productId) {
  return completeSale(productId, null);
}

// Listens to a seller's completed sales and calls onChange with the newest first,
// again every time a sale is added, so the Revenue and Sold pages update live.
// Returns the function that stops listening.
export function subscribeToSales(sellerId, onChange, onError) {
  const salesQuery = query(
    collection(requireDb(), 'orders'),
    where('sellerId', '==', sellerId),
    where('status', '==', 'completed'),
  );

  return onSnapshot(
    salesQuery,
    (snapshot) => {
      const sales = snapshot.docs
        .map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      onChange(sales);
    },
    onError,
  );
}
