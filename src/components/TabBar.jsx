const TABS = [
  { id: "home", label: "홈", emoji: "🏠" },
  { id: "log", label: "기록", emoji: "📝" },
  { id: "stats", label: "통계", emoji: "📊" },
  { id: "challenge", label: "챌린지", emoji: "🔥" },
  { id: "ai", label: "AI분석", emoji: "🤖" },
];

export default function TabBar({ active, onChange }) {
  const index = TABS.findIndex((t) => t.id === active);
  return (
    <nav className="tab-bar">
      <div
        className="tab-indicator-track"
        style={{
          width: `${100 / TABS.length}%`,
          transform: `translateX(${Math.max(0, index) * 100}%)`,
          opacity: index === -1 ? 0 : 1,
        }}
      >
        <span className="tab-indicator-pill" />
      </div>
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${active === t.id ? "tab-active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          <span className="tab-emoji">{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
