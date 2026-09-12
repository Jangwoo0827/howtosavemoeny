const DAY_MS = 24 * 60 * 60 * 1000;

export function categoryBreakdown(transactions) {
  const week = transactions.filter((t) => (Date.now() - new Date(t.date).getTime()) / DAY_MS < 7);
  const totals = {};
  for (const t of week) {
    totals[t.category] = (totals[t.category] ?? 0) + t.amount;
  }
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total, pct: sum > 0 ? Math.round((total / sum) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);
}

// Totals for the current week and the 3 weeks before it, oldest first.
export function weeklyTrend(transactions) {
  const weeks = [0, 0, 0, 0];
  for (const t of transactions) {
    const age = Math.floor((Date.now() - new Date(t.date).getTime()) / DAY_MS);
    const weekIndex = Math.floor(age / 7);
    if (weekIndex >= 0 && weekIndex < 4) {
      weeks[3 - weekIndex] += t.amount;
    }
  }
  return weeks;
}
