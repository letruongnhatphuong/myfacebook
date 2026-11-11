import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { getStock } from '../utils/stock.js';

// Every product is one document in the "products" collection.
// "ownerId" links the product to the logged-in user who created it.
const PRODUCTS_COLLECTION = 'products';

function getProductsCollection() {
  if (!db) {
    throw new Error('The database is not configured.');
  }
  return collection(db, PRODUCTS_COLLECTION);
}

// Saves a new product for the given user and returns it with its new id.
export async function addProduct(ownerId, product) {
  const stock = getStock(product);
  if (stock < 1) throw new Error('Quantity available must be a positive whole number.');
  const newProduct = {
    ...product,
    stock,
    ownerId,
    createdAt: Date.now(),
  };
  const docRef = await addDoc(getProductsCollection(), newProduct);
  return { id: docRef.id, ...newProduct };
}

// Turns query results into plain product objects, newest first.
function toProducts(snapshot) {
  return snapshot.docs
    .map((productDoc) => ({ id: productDoc.id, ...productDoc.data() }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

// Loads every product listed by any user (used by the marketplace page).
export async function getAllProducts() {
  const snapshot = await getDocs(getProductsCollection());
  return toProducts(snapshot);
}

export function subscribeToProducts(onChange, onError) {
  return onSnapshot(getProductsCollection(), { includeMetadataChanges: true }, (snapshot) => {
    onChange(toProducts(snapshot), snapshot.metadata.fromCache);
  }, onError);
}

// Loads only the products created by the given user, newest first.
export async function getUserProducts(ownerId) {
  const userProductsQuery = query(getProductsCollection(), where('ownerId', '==', ownerId));
  const snapshot = await getDocs(userProductsQuery);
  return toProducts(snapshot);
}

// Permanently removes one product document.
export async function deleteProduct(productId) {
  await deleteDoc(doc(getProductsCollection(), productId));
}
