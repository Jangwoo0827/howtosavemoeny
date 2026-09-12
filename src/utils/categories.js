export const CATEGORIES = [
  { id: "food", label: "배달음식", emoji: "🍔", color: "#FF8A65" },
  { id: "cafe", label: "카페·음료", emoji: "☕", color: "#B98A5E" },
  { id: "snack", label: "편의점·간식", emoji: "🍬", color: "#FF6B81" },
  { id: "fashion", label: "쇼핑·패션", emoji: "👕", color: "#9C6BFF" },
  { id: "game", label: "게임·구독", emoji: "🎮", color: "#3182F6" },
  { id: "transport", label: "교통", emoji: "🚌", color: "#22B07D" },
  { id: "etc", label: "기타", emoji: "📦", color: "#8B95A1" },
];

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
