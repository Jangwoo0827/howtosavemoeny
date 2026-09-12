export const BANKS = [
  { id: "kb", name: "국민은행", emoji: "🟡", color: "#FFB800" },
  { id: "shinhan", name: "신한은행", emoji: "🔵", color: "#0046FF" },
  { id: "kakao", name: "카카오뱅크", emoji: "💛", color: "#FEE500" },
  { id: "toss", name: "토스뱅크", emoji: "🔷", color: "#3182F6" },
];

const SAMPLE_TX = [
  { merchant: "스타벅스", category: "cafe", min: 4500, max: 7000 },
  { merchant: "배달의민족", category: "food", min: 12000, max: 25000 },
  { merchant: "GS25", category: "snack", min: 2000, max: 8000 },
  { merchant: "지하철", category: "transport", min: 1400, max: 1400 },
  { merchant: "유튜브 프리미엄", category: "game", min: 14900, max: 14900 },
  { merchant: "무신사", category: "fashion", min: 25000, max: 60000 },
  { merchant: "CU편의점", category: "snack", min: 1500, max: 6000 },
  { merchant: "메가커피", category: "cafe", min: 2500, max: 4500 },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockAccount(bankId) {
  const bank = BANKS.find((b) => b.id === bankId);
  const num = `110-${randomInt(100, 999)}-${randomInt(100000, 999999)}`;
  return {
    bankId,
    bankName: bank.name,
    accountNumber: num,
    balance: randomInt(30000, 250000),
  };
}

// Generates a handful of fake recent transactions in the app's transaction shape.
export function generateMockTransactions(count = 4) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const picks = [...SAMPLE_TX].sort(() => Math.random() - 0.5).slice(0, count);
  return picks.map((p, i) => ({
    id: `bank-${Date.now()}-${i}`,
    amount: randomInt(p.min, p.max),
    category: p.category,
    memo: p.merchant,
    date: new Date(Date.now() - randomInt(0, 3) * DAY_MS - i * 3600_000).toISOString(),
    fromBank: true,
  }));
}
