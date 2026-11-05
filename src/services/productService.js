import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.js';

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
  const newProduct = {
    ...product,
    ownerId,
    createdAt: Date.now(),
  };
  const docRef = await addDoc(getProductsCollection(), newProduct);
  return { id: docRef.id, ...newProduct };
}

// Loads only the products created by the given user, newest first.
export async function getUserProducts(ownerId) {
  const userProductsQuery = query(getProductsCollection(), where('ownerId', '==', ownerId));
  const snapshot = await getDocs(userProductsQuery);
  return snapshot.docs
    .map((productDoc) => ({ id: productDoc.id, ...productDoc.data() }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

// Permanently removes one product document.
export async function deleteProduct(productId) {
  await deleteDoc(doc(getProductsCollection(), productId));
}
