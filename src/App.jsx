import { useEffect, useState } from "react";
import "./App.css";
import { loadState, saveState } from "./utils/storage";
import TabBar from "./components/TabBar";
import Dashboard from "./components/Dashboard";
import ExpenseLog from "./components/ExpenseLog";
import Stats from "./components/Stats";
import Challenge from "./components/Challenge";
import AIAdvisor from "./components/AIAdvisor";
import BankLink from "./components/BankLink";
import { generateBackfillTransactions } from "./utils/mockBank";

const DAY_MS = 24 * 60 * 60 * 1000;

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

  function linkAccount(account) {
    setState((s) => ({ ...s, linkedAccount: account }));
  }

  function unlinkAccount() {
    setState((s) => ({ ...s, linkedAccount: null }));
  }

  function importTransactions(newTransactions) {
    setState((s) => ({
      ...s,
      transactions: [...s.transactions, ...newTransactions],
    }));
  }

  function fillTestStreak(days = 7) {
    setState((s) => {
      const keys = [];
      for (let i = 1; i <= days; i++) {
        keys.push(new Date(Date.now() - i * DAY_MS).toISOString().slice(0, 10));
      }
      return { ...s, noSpendDays: [...new Set([...s.noSpendDays, ...keys])] };
    });
  }

  function fillTestHistory(weeks = 4) {
    setState((s) => ({
      ...s,
      transactions: [...s.transactions, ...generateBackfillTransactions(weeks)],
    }));
  }

  function completeTestGoal() {
    setState((s) => ({ ...s, goal: { ...s.goal, saved: s.goal.target } }));
  }

  function resetTestData() {
    setState((s) => ({
      ...s,
      transactions: s.transactions.filter((t) => !t.isTest),
      noSpendDays: [],
      goal: { ...s.goal, saved: 0 },
      linkedAccount: null,
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
        {tab === "bank" && (
          <BankLink
            state={state}
            onLinkAccount={linkAccount}
            onUnlinkAccount={unlinkAccount}
            onImportTransactions={importTransactions}
            onFillTestStreak={fillTestStreak}
            onFillTestHistory={fillTestHistory}
            onCompleteTestGoal={completeTestGoal}
            onResetTestData={resetTestData}
          />
        )}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
