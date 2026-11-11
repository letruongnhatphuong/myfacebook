import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';

let environment;
const product = { ownerId: 'seller', name: 'Bike', price: 80, image: '', category: 'Sports', condition: 'Used' };
const order = {
  productId: 'bike', productName: 'Bike', price: 80, image: '', category: 'Sports',
  condition: 'Used', sellerId: 'seller', buyerId: null, status: 'completed', createdAt: 1000,
};
const { buyerId, ...summary } = order;
assert.equal(buyerId, null);

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-myfacebook',
    firestore: { rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8') },
  });
});
after(async () => { await environment?.cleanup(); });
beforeEach(async () => { await environment.clearFirestore(); });

function database(userId) {
  return userId ? environment.authenticatedContext(userId).firestore() : environment.unauthenticatedContext().firestore();
}

async function seed(path, data) {
  await environment.withSecurityRulesDisabled((context) => setDoc(doc(context.firestore(), path), data));
}

function sell(db, changes = {}, publicChanges = {}) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'orders/bike'), { ...order, ...changes });
  batch.set(doc(db, 'publicSales/bike'), { ...summary, ...publicChanges });
  batch.delete(doc(db, 'products/bike'));
  return batch.commit();
}

test('seller can atomically record a sale and publish a summary without buyer details', async () => {
  await seed('products/bike', product);
  const seller = database('seller');
  await assertSucceeds(sell(seller));
  assert.equal((await getDoc(doc(seller, 'products/bike'))).exists(), false);
  assert.equal((await getDoc(doc(seller, 'orders/bike'))).data().price, 80);
  const publicData = (await assertSucceeds(getDoc(doc(database(), 'publicSales/bike')))).data();
  assert.equal('buyerId' in publicData, false);
});

test('another user cannot sell someone else’s product', async () => {
  await seed('products/bike', product);
  await assertFails(sell(database('stranger')));
  assert.equal((await getDoc(doc(database(), 'products/bike'))).exists(), true);
});

test('seller cannot change the price or invent a buyer while recording an in-person sale', async () => {
  await seed('products/bike', product);
  await assertFails(sell(database('seller'), { price: 500 }, { price: 500 }));
  await assertFails(sell(database('seller'), { buyerId: 'victim' }));
});

test('sale must remove the listing and cannot be recorded twice', async () => {
  await seed('products/bike', product);
  const seller = database('seller');
  const incomplete = writeBatch(seller);
  incomplete.set(doc(seller, 'orders/bike'), order);
  incomplete.set(doc(seller, 'publicSales/bike'), summary);
  await assertFails(incomplete.commit());
  await assertSucceeds(sell(seller));
  await assertFails(sell(seller));
  await assertFails(setDoc(doc(seller, 'products/bike'), product));
});

test('sale must include a matching public summary and cannot expose private fields', async () => {
  await seed('products/bike', product);
  const seller = database('seller');
  const missingSummary = writeBatch(seller);
  missingSummary.set(doc(seller, 'orders/bike'), order);
  missingSummary.delete(doc(seller, 'products/bike'));
  await assertFails(missingSummary.commit());
  await assertFails(sell(seller, {}, { buyerId: 'private-buyer' }));
  await assertFails(setDoc(doc(seller, 'publicSales/bike'), summary));
});

test('private orders can be read and queried only by their buyer and seller', async () => {
  await seed('orders/bike', { ...order, buyerId: 'buyer' });
  for (const uid of ['seller', 'buyer']) {
    const db = database(uid);
    await assertSucceeds(getDoc(doc(db, 'orders/bike')));
    const field = uid === 'seller' ? 'sellerId' : 'buyerId';
    await assertSucceeds(getDocs(query(collection(db, 'orders'), where(field, '==', uid))));
  }
  for (const uid of [null, 'stranger']) {
    const db = database(uid);
    await assertFails(getDoc(doc(db, 'orders/bike')));
    await assertFails(getDocs(collection(db, 'orders')));
  }
});

test('completed orders and public sale summaries cannot be edited or deleted', async () => {
  await seed('orders/bike', order);
  await seed('publicSales/bike', summary);
  const seller = database('seller');
  await assertFails(setDoc(doc(seller, 'orders/bike'), { ...order, price: 900 }));
  await assertFails(deleteDoc(doc(seller, 'orders/bike')));
  await assertFails(deleteDoc(doc(seller, 'publicSales/bike')));
});

test('public profile can be created only by its owner and must not include email', async () => {
  const profile = { username: 'Seller', bio: '', joinedAt: 1000 };
  await assertSucceeds(setDoc(doc(database('seller'), 'users/seller'), profile));
  await assertSucceeds(getDoc(doc(database(), 'users/seller')));
  await assertFails(setDoc(doc(database('stranger'), 'users/seller'), profile));
  await assertFails(setDoc(doc(database('seller'), 'users/seller'), { ...profile, email: 'private@example.com' }));
});
