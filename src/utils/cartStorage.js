const STORAGE_KEY = 'notmarketplace-carts';

function validItem(item) {
  return item && (typeof item.id === 'string' || typeof item.id === 'number')
    && typeof item.name === 'string'
    && Number.isFinite(Number(item.price)) && Number(item.price) >= 0
    && Number.isSafeInteger(item.quantity) && item.quantity > 0;
}

export function loadCarts(storage) {
  try {
    const saved = JSON.parse((storage || localStorage).getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved)
      .filter(([, items]) => Array.isArray(items))
      .map(([owner, items]) => [owner, items.filter(validItem)]));
  } catch {
    return {};
  }
}

export function saveCarts(carts, storage) {
  try {
    (storage || localStorage).setItem(STORAGE_KEY, JSON.stringify(carts));
    return true;
  } catch {
    return false;
  }
}

export function addCartItem(items, item, quantity = 1) {
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    return items.map((entry) => entry.id === item.id
      ? { ...entry, quantity: entry.quantity + quantity }
      : entry);
  }
  return [...items, { ...item, quantity }];
}

export function mergeGuestCart(carts, userId) {
  const guestItems = carts.guest || [];
  if (guestItems.length === 0) return carts;
  const userItems = guestItems.reduce(
    (items, item) => addCartItem(items, item, item.quantity),
    carts[userId] || [],
  );
  return { ...carts, [userId]: userItems, guest: [] };
}
