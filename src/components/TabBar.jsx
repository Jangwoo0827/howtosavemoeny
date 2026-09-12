const TABS = [
  { id: "home", label: "홈", emoji: "🏠" },
  { id: "log", label: "기록", emoji: "📝" },
  { id: "stats", label: "통계", emoji: "📊" },
  { id: "challenge", label: "챌린지", emoji: "🔥" },
  { id: "ai", label: "AI분석", emoji: "🤖" },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tab-bar">
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
