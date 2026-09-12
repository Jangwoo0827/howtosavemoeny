import { useMemo, useState } from "react";
import { generateInsights } from "../utils/analysis";

function computeStreak(noSpendDays) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const set = new Set(noSpendDays);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = new Date(Date.now() - i * DAY_MS).toISOString().slice(0, 10);
    if (set.has(key)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

export default function AIAdvisor({ state }) {
  const [runCount, setRunCount] = useState(0);

  const messages = useMemo(() => {
    return generateInsights({
      transactions: state.transactions,
      budget: state.budget,
      streak: computeStreak(state.noSpendDays),
      goal: state.goal,
    });
    // runCount forces a fresh "re-analysis" moment for the demo
  }, [state, runCount]);

  return (
    <div className="screen">
      <h1 className="screen-title">🤖 AI 소비 분석</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        기록된 지출을 바탕으로 이번 주 소비 패턴을 분석했어요.
      </p>

      <div className="chat-thread">
        {messages.map((m, i) => (
          <div className="chat-bubble" key={i}>
            {m}
          </div>
        ))}
      </div>

      <button className="cta-btn" onClick={() => setRunCount((n) => n + 1)}>
        다시 분석하기
      </button>
    </div>
  );
}
