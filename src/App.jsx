import { useEffect, useState } from "react";
import "./App.css";
import { loadState, saveState } from "./utils/storage";
import TabBar from "./components/TabBar";
import Dashboard from "./components/Dashboard";
import ExpenseLog from "./components/ExpenseLog";
import Stats from "./components/Stats";
import Challenge from "./components/Challenge";
import AIAdvisor from "./components/AIAdvisor";

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("home");

  useEffect(() => {
    saveState(state);
  }, [state]);

  function addTransaction({ amount, category, memo }) {
    setState((s) => ({
      ...s,
      transactions: [
        ...s.transactions,
        { id: crypto.randomUUID(), amount, category, memo, date: new Date().toISOString() },
      ],
    }));
  }

  function deleteTransaction(id) {
    setState((s) => ({
      ...s,
      transactions: s.transactions.filter((t) => t.id !== id),
    }));
  }

  function setBudget(budget) {
    setState((s) => ({ ...s, budget }));
  }

  function toggleNoSpend(dateKey) {
    setState((s) => {
      const has = s.noSpendDays.includes(dateKey);
      return {
        ...s,
        noSpendDays: has
          ? s.noSpendDays.filter((d) => d !== dateKey)
          : [...s.noSpendDays, dateKey],
      };
    });
  }

  function updateGoal(goal) {
    setState((s) => ({ ...s, goal: { ...s.goal, ...goal } }));
  }

  function addSaved(amount) {
    setState((s) => ({
      ...s,
      goal: { ...s.goal, saved: s.goal.saved + amount },
    }));
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        {tab === "home" && <Dashboard state={state} onNavigate={setTab} />}
        {tab === "log" && (
          <ExpenseLog
            state={state}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onSetBudget={setBudget}
          />
        )}
        {tab === "stats" && <Stats state={state} />}
        {tab === "challenge" && (
          <Challenge
            state={state}
            onToggleNoSpend={toggleNoSpend}
            onUpdateGoal={updateGoal}
            onAddSaved={addSaved}
          />
        )}
        {tab === "ai" && <AIAdvisor state={state} />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
