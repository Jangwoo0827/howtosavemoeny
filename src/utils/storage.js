const KEY = "saveteen_v1";

export const DEFAULT_STATE = {
  onboarded: false,
  budget: 50000,
  transactions: [],
  noSpendDays: [],
  goal: { title: "무선이어폰 사기", target: 150000, saved: 0 },
  linkedAccount: null,
};

const defaultState = DEFAULT_STATE;

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota) — state stays in-memory only
  }
}
