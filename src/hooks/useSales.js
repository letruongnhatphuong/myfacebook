import { useEffect, useState } from 'react';
import { db } from '../firebase.js';
import { subscribeToSales } from '../services/salesService.js';
import { getUsername } from '../services/profileService.js';

// Custom hook shared by the Revenue and Sold pages: the logged-in seller's
// completed sales, kept up to date live, plus each buyer's display name.
function useSales(user) {
  // "sellerId" remembers whose sales are loaded, so switching accounts never shows the wrong list.
  const [state, setState] = useState({ sellerId: null, sales: [], error: '' });
  const [buyerNames, setBuyerNames] = useState({});

  useEffect(() => {
    if (!user || !db) return;
    // subscribeToSales returns the "stop listening" function, which React calls on cleanup.
    return subscribeToSales(
      user.uid,
      (sales) => setState({ sellerId: user.uid, sales, error: '' }),
      () => setState({ sellerId: user.uid, sales: [], error: 'Unable to load your sales. Please refresh and try again.' }),
    );
  }, [user]);

  const currentUserId = user ? user.uid : null;
  const sales = state.sellerId === currentUserId ? state.sales : [];

  // Look up each buyer's name once (profileService is the team's shared lookup).
  useEffect(() => {
    let ignore = false;
    const buyerIds = [...new Set(state.sales.map((sale) => sale.buyerId).filter(Boolean))];

    async function loadNames() {
      const names = {};
      for (const buyerId of buyerIds) {
        names[buyerId] = await getUsername(buyerId);
      }
      if (!ignore) setBuyerNames(names);
    }

    loadNames();
    return () => { ignore = true; };
  }, [state.sales]);

  return {
    sales,
    buyerNames,
    error: state.sellerId === currentUserId ? state.error : '',
    loading: Boolean(user && db) && state.sellerId !== currentUserId,
  };
}

export default useSales;
