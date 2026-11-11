import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addCartItem, loadCarts, mergeGuestCart, saveCarts } from '../src/utils/cartStorage.js';

const bike = { id: 'bike', name: 'Bike', price: 80, quantity: 1 };

function memoryStorage() {
  let value = null;
  return { getItem: () => value, setItem: (_, next) => { value = next; } };
}

test('a saved cart survives recreating the app', () => {
  const storage = memoryStorage();
  const carts = { alice: [bike] };
  assert.equal(saveCarts(carts, storage), true);
  assert.deepEqual(loadCarts(storage), carts);
});

test('login moves guest quantities into that account without changing another account', () => {
  const carts = { guest: [bike], alice: [{ ...bike, quantity: 2 }], bob: [] };
  const merged = mergeGuestCart(carts, 'alice');
  assert.equal(merged.alice[0].quantity, 3);
  assert.deepEqual(merged.guest, []);
  assert.deepEqual(merged.bob, []);
  assert.deepEqual(mergeGuestCart(merged, 'alice'), merged);
  assert.equal(carts.alice[0].quantity, 2);
});

test('adding the same product increases quantity instead of duplicating rows', () => {
  const items = addCartItem([bike], bike);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 2);
  assert.equal(bike.quantity, 1);
});

test('invalid saved data and unavailable storage do not crash the app', () => {
  assert.deepEqual(loadCarts({ getItem: () => '{broken' }), {});
  assert.deepEqual(loadCarts({ getItem: () => JSON.stringify({ alice: [bike, { ...bike, quantity: -2 }] }) }), { alice: [bike] });
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.deepEqual(loadCarts(blocked), {});
  assert.equal(saveCarts({}, blocked), false);
});
