import ProgressBar from "./ProgressBar";
import CategoryIcon from "./CategoryIcon";
import { categoryOf } from "../utils/categories";
import { computeBudgetNudge } from "../utils/nudge";

const DAY_MS = 24 * 60 * 60 * 1000;

const QUICK_ACTIONS = [
  { id: "log", icon: "➕", label: "지출 추가" },
  { id: "bank", icon: "🏦", label: "계좌 연동" },
  { id: "challenge", icon: "🔥", label: "챌린지" },
  { id: "stats", icon: "📊", label: "통계" },
];

export default function Dashboard({ state, onNavigate }) {
  const { budget, transactions, noSpendDays, goal } = state;

  const thisWeek = transactions.filter(
    (t) => (Date.now() - new Date(t.date).getTime()) / DAY_MS < 7
  );
  const spent = thisWeek.reduce((s, t) => s + t.amount, 0);
  const remaining = Math.max(0, budget - spent);

  const streak = computeStreak(noSpendDays);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  const nudge = computeBudgetNudge({ transactions, budget });

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <p className="topbar-greeting">안녕하세요 👋</p>
          <p className="topbar-sub">오늘도 절약 습관 만들어봐요</p>
        </div>
        <button className="topbar-bell" aria-label="알림">
          🔔
        </button>
      </div>

      {state.linkedAccount && (
        <button className="bank-pill" onClick={() => onNavigate("bank")}>
          🏦 {state.linkedAccount.bankName} 연동됨
        </button>
      )}

      {nudge && (
        <div className={`nudge-banner nudge-${nudge.level}`}>
          🚫 {nudge.message}
        </div>
      )}
      <header className="hero">
        <p className="hero-sub">이번 주 남은 예산</p>
        <h1 className="hero-amount">{remaining.toLocaleString()}원</h1>
        <ProgressBar value={spent} max={budget} />
        <p className="hero-caption">
          {budget.toLocaleString()}원 중 {spent.toLocaleString()}원 사용
        </p>
      </header>

      <div className="quick-actions">
        {QUICK_ACTIONS.map((a) => (
          <button key={a.id} className="quick-action" onClick={() => onNavigate(a.id)}>
            <span className="quick-action-icon">{a.icon}</span>
            <span className="quick-action-label">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="card-grid">
        <button className="stat-card" onClick={() => onNavigate("challenge")}>
          <span className="stat-emoji">🔥</span>
          <span className="stat-value">{streak}일</span>
          <span className="stat-label">무지출 연속</span>
        </button>
        <button className="stat-card" onClick={() => onNavigate("challenge")}>
          <span className="stat-emoji">🎯</span>
          <span className="stat-value">
            {goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0}%
          </span>
          <span className="stat-label">{goal.title}</span>
        </button>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>최근 지출</h2>
          <button className="link-btn" onClick={() => onNavigate("log")}>
            전체보기
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="empty">아직 기록된 지출이 없어요.</p>
        ) : (
          <ul className="tx-list">
            {recent.map((t) => {
              const cat = categoryOf(t.category);
              return (
                <li key={t.id} className="tx-item">
                  <CategoryIcon categoryId={t.category} />
                  <div className="tx-info">
                    <span className="tx-label">
                      {t.memo || cat.label}
                      {t.isTest && <span className="test-tag">가짜</span>}
                    </span>
                    <span className="tx-date">{formatDate(t.date)}</span>
                  </div>
                  <span className="tx-amount">-{t.amount.toLocaleString()}원</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function computeStreak(noSpendDays) {
  const set = new Set(noSpendDays);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
