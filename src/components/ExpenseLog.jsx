import { useMemo, useState } from "react";
import { CATEGORIES, categoryOf } from "../utils/categories";
import { computeCategoryNudge } from "../utils/nudge";
import CategoryIcon from "./CategoryIcon";

export default function ExpenseLog({ state, onAddTransaction, onDeleteTransaction, onSetBudget }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [memo, setMemo] = useState("");
  const [budgetInput, setBudgetInput] = useState(state.budget);

  function handleSubmit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    onAddTransaction({ amount: value, category, memo: memo.trim() });
    setAmount("");
    setMemo("");
  }

  const grouped = groupByDate(state.transactions);
  const nudge = useMemo(() => {
    const value = Number(amount);
    if (!value || value <= 0) return null;
    return computeCategoryNudge({ transactions: state.transactions, category, amount: value });
  }, [amount, category, state.transactions]);

  return (
    <div className="screen">
      <h1 className="screen-title">지출 기록</h1>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label>금액</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="field">
          <label>카테고리</label>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip ${category === c.id ? "chip-active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>메모 (선택)</label>
          <input
            type="text"
            placeholder="예: 편의점 삼각김밥"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        {nudge && <p className="nudge-inline">🚫 {nudge}</p>}
        <button className="cta-btn" type="submit">
          지출 추가하기
        </button>
      </form>

      <div className="card">
        <div className="field">
          <label>이번 주 예산</label>
          <div className="budget-row">
            <input
              type="number"
              inputMode="numeric"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={() => onSetBudget(Number(budgetInput) || 0)}
            />
            <span>원</span>
          </div>
        </div>
      </div>

      <section className="section">
        <h2>기록 내역</h2>
        {grouped.length === 0 ? (
          <p className="empty">아직 기록된 지출이 없어요.</p>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date} className="tx-group">
              <p className="tx-group-date">{formatDate(date)}</p>
              <ul className="tx-list">
                {items.map((t) => {
                  const cat = categoryOf(t.category);
                  return (
                    <li key={t.id} className="tx-item">
                      <CategoryIcon categoryId={t.category} size={36} />
                      <div className="tx-info">
                        <span className="tx-label">
                          {t.memo || cat.label}
                          {t.isTest && <span className="test-tag">가짜</span>}
                        </span>
                        <span className="tx-date">{cat.label}</span>
                      </div>
                      <span className="tx-amount">-{t.amount.toLocaleString()}원</span>
                      <button
                        className="tx-delete"
                        onClick={() => onDeleteTransaction(t.id)}
                        aria-label="삭제"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function groupByDate(transactions) {
  const map = new Map();
  for (const t of [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))) {
    const key = t.date.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
  }
  return [...map.entries()];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}
