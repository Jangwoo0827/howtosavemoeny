import { categoryBreakdown, weeklyTrend } from "../utils/stats";
import { categoryOf } from "../utils/categories";
import CategoryIcon from "./CategoryIcon";
import LineChart from "./LineChart";

const WEEK_LABELS = ["3주 전", "2주 전", "1주 전", "이번 주"];

export default function Stats({ state }) {
  const breakdown = categoryBreakdown(state.transactions);
  const trend = weeklyTrend(state.transactions);
  const trendData = trend.map((value, i) => ({ label: WEEK_LABELS[i], value }));

  return (
    <div className="screen">
      <h1 className="screen-title">📊 통계</h1>

      <div className="card">
        <h2 className="card-title">이번 주 쓰는 곳</h2>
        {breakdown.length === 0 ? (
          <p className="empty">아직 이번 주 지출 기록이 없어요.</p>
        ) : (
          <ul className="bar-list">
            {breakdown.map((b) => {
              const cat = categoryOf(b.category);
              return (
                <li key={b.category} className="bar-row">
                  <span className="bar-label">
                    <CategoryIcon categoryId={b.category} size={22} /> {cat.label}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${b.pct}%`, background: cat.color }}
                    />
                  </div>
                  <span className="bar-value">{b.total.toLocaleString()}원</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">주마다 쓰는 돈</h2>
        <p className="muted">최근 4주 지출 추이</p>
        <LineChart data={trendData} />
      </div>
    </div>
  );
}
