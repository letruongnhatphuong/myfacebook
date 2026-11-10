// Pure helpers for the Revenue and Sold pages: they only take sales in and
// return numbers or text, so they are easy to test and reuse.

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// $1,234.50
export function formatMoney(amount) {
  return amount.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
}

// Adds up every sale with reduce: the running total starts at 0.
export function totalRevenue(sales) {
  return sales.reduce((total, sale) => total + Number(sale.price), 0);
}

// Sales made in the same calendar month as `now`.
export function salesThisMonth(sales, now = new Date()) {
  return sales.filter((sale) => {
    const date = new Date(sale.createdAt);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}

// Revenue for each of the last `count` months, oldest first, including the current month:
// [{ key: '2026-11', label: 'Nov', total: 205 }, ...]
export function revenueByMonth(sales, count = 6, now = new Date()) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTH_NAMES[date.getMonth()],
      total: 0,
    });
  }

  for (const sale of sales) {
    const date = new Date(sale.createdAt);
    const month = months.find((m) => m.key === `${date.getFullYear()}-${date.getMonth()}`);
    if (month) month.total += Number(sale.price);
  }
  return months;
}

// Sales newest first, each with the revenue total up to and including it.
export function withRunningTotal(sales) {
  const oldestFirst = [...sales].sort((a, b) => a.createdAt - b.createdAt);
  let runningTotal = 0;
  const rows = oldestFirst.map((sale) => {
    runningTotal += Number(sale.price);
    return { ...sale, runningTotal };
  });
  return rows.reverse();
}

// Who bought it: the buyer's name, or a note when the seller sold it in person.
export function buyerLabel(sale, buyerNames) {
  if (!sale.buyerId) return 'Sold in person';
  return buyerNames[sale.buyerId] || 'A buyer';
}
