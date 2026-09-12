import { categoryOf } from "./categories";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / DAY_MS);
}

function sumByCategory(transactions) {
  const totals = {};
  for (const t of transactions) {
    totals[t.category] = (totals[t.category] ?? 0) + t.amount;
  }
  return totals;
}

const CATEGORY_TIPS = {
  food: "배달음식에 가장 많이 썼어요. 배달비까지 합치면 생각보다 커요 — 일주일에 한 번만 직접 해먹어도 꽤 모을 수 있어요.",
  cafe: "카페·음료 지출이 많아요. 텀블러 할인을 챙기거나 학교 정수기를 활용해보는 건 어떨까요?",
  snack: "편의점 간식비가 잦아요. 간식 살 돈을 따로 모아두면 목표에 더 빨리 도달할 수 있어요.",
  fashion: "쇼핑·패션 지출이 커요. 장바구니에 담아두고 3일 뒤에도 사고 싶으면 사는 '3일 규칙'을 써보세요.",
  game: "게임·구독 결제가 많아요. 요즘 안 쓰는 구독이 있는지 한번 점검해보세요.",
  transport: "교통비가 많이 나갔어요. 정기권이나 환승 할인을 챙기면 아낄 수 있어요.",
  etc: "이번 주 지출을 잘 기록하고 있어요. 카테고리를 좀 더 구체적으로 나누면 분석이 더 정확해져요.",
};

export function generateInsights({ transactions, budget, streak, goal }) {
  const thisWeek = transactions.filter((t) => daysAgo(t.date) < 7);
  const lastWeek = transactions.filter((t) => daysAgo(t.date) >= 7 && daysAgo(t.date) < 14);

  const thisTotal = thisWeek.reduce((s, t) => s + t.amount, 0);
  const lastTotal = lastWeek.reduce((s, t) => s + t.amount, 0);

  const messages = [];

  if (thisWeek.length === 0) {
    messages.push("아직 이번 주 지출 기록이 없어요. 지출을 기록하면 AI가 소비 패턴을 분석해드려요!");
    return messages;
  }

  messages.push(`이번 주 총 ${thisTotal.toLocaleString()}원을 썼어요.`);

  if (budget > 0) {
    const ratio = Math.round((thisTotal / budget) * 100);
    if (ratio >= 100) {
      messages.push(`이번 주 예산 ${budget.toLocaleString()}원을 이미 ${ratio}% 사용했어요. 남은 요일은 지출을 좀 줄여보는 게 좋겠어요.`);
    } else {
      messages.push(`이번 주 예산의 ${ratio}%를 사용했어요. 아직 ${(budget - thisTotal).toLocaleString()}원 여유가 있어요.`);
    }
  }

  if (lastWeek.length > 0) {
    const diff = thisTotal - lastTotal;
    if (diff > 0) {
      messages.push(`지난주보다 ${diff.toLocaleString()}원 더 썼어요.`);
    } else if (diff < 0) {
      messages.push(`지난주보다 ${Math.abs(diff).toLocaleString()}원 덜 썼어요! 잘하고 있어요.`);
    } else {
      messages.push("지난주와 지출이 똑같아요.");
    }
  }

  const totals = sumByCategory(thisWeek);
  const topCategoryId = Object.keys(totals).sort((a, b) => totals[b] - totals[a])[0];
  if (topCategoryId) {
    const cat = categoryOf(topCategoryId);
    messages.push(`가장 많이 쓴 카테고리는 ${cat.emoji} ${cat.label}(${totals[topCategoryId].toLocaleString()}원)이에요.`);
    messages.push(CATEGORY_TIPS[topCategoryId] ?? CATEGORY_TIPS.etc);
  }

  if (streak >= 3) {
    messages.push(`무지출 ${streak}일 연속 성공 중이에요! 이 기세를 이어가 보세요.`);
  }

  if (goal && goal.target > 0) {
    const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    if (pct >= 100) {
      messages.push(`목표 "${goal.title}" 달성했어요! 축하해요 🎉`);
    } else if (pct >= 50) {
      messages.push(`목표 "${goal.title}"까지 ${pct}% 달성했어요. 절반 넘었어요!`);
    }
  }

  return messages;
}
