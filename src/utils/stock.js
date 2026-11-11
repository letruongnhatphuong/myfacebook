export const MAX_STOCK = 9999;

export function getStock(product) {
  if (product.stock === undefined) return 1;
  return Number.isSafeInteger(product.stock) && product.stock >= 0 && product.stock <= MAX_STOCK
    ? product.stock
    : 0;
}

export function getSoldQuantity(sale) {
  return Number.isSafeInteger(sale.quantity) && sale.quantity > 0 ? sale.quantity : 1;
}
