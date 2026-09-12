import { categoryOf } from "./categories";

const DAY_MS = 24 * 60 * 60 * 1000;

function thisWeekTx(transactions) {
  return transactions.filter((t) => (Date.now() - new Date(t.date).getTime()) / DAY_MS < 7);
}

export function computeBudgetNudge({ transactions, budget }) {
  if (budget <= 0) return null;
  const spent = thisWeekTx(transactions).reduce((s, t) => s + t.amount, 0);
  const ratio = spent / budget;
  if (ratio >= 1) {
    return { level: "danger", message: `이번 주 예산을 다 썼어요! 남은 요일은 지출을 멈춰보는 게 어때요?` };
  }
  if (ratio >= 0.8) {
    return { level: "warning", message: `이번 주 예산의 ${Math.round(ratio * 100)}%를 썼어요. 이제 슬슬 지갑을 닫아볼까요?` };
  }
  return null;
}

// Warn before adding an expense if its category is already a big chunk of this week's spending.
export function computeCategoryNudge({ transactions, category, amount }) {
  const week = thisWeekTx(transactions);
  const categoryTotal = week.filter((t) => t.category === category).reduce((s, t) => s + t.amount, 0);
  const weekTotal = week.reduce((s, t) => s + t.amount, 0);
  const projected = categoryTotal + amount;

  if (projected >= 30000 && weekTotal > 0 && projected / (weekTotal + amount) >= 0.5) {
    const cat = categoryOf(category);
    return `이번 주 ${cat.emoji} ${cat.label}에만 벌써 ${projected.toLocaleString()}원을 쓰게 돼요. 정말 추가할까요?`;
  }
  return null;
}
