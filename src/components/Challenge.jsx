import { useState } from "react";
import ProgressBar from "./ProgressBar";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Challenge({ state, onToggleNoSpend, onUpdateGoal, onAddSaved }) {
  const [saveInput, setSaveInput] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [title, setTitle] = useState(state.goal.title);
  const [target, setTarget] = useState(state.goal.target);

  const todayKey = new Date().toISOString().slice(0, 10);
  const isTodaySuccess = state.noSpendDays.includes(todayKey);
  const weekDays = getWeekDays();

  function handleAddSaved(e) {
    e.preventDefault();
    const value = Number(saveInput);
    if (!value || value <= 0) return;
    onAddSaved(value);
    setSaveInput("");
  }

  function handleGoalSave() {
    onUpdateGoal({ title: title.trim() || "저축 목표", target: Number(target) || 0 });
    setEditingGoal(false);
  }

  return (
    <div className="screen">
      <h1 className="screen-title">챌린지</h1>

      <div className="card">
        <h2 className="card-title">🔥 무지출 챌린지</h2>
        <p className="muted">오늘 돈을 하나도 안 썼다면 체크해보세요!</p>
        <div className="week-row">
          {weekDays.map(({ key, label, isToday, isFuture }) => {
            const done = state.noSpendDays.includes(key);
            return (
              <div
                key={key}
                className={`day-pill ${done ? "day-done" : ""} ${isToday ? "day-today" : ""} ${
                  isFuture ? "day-future" : ""
                }`}
              >
                <span>{label}</span>
                <span className="day-mark">{done ? "✓" : "·"}</span>
              </div>
            );
          })}
        </div>
        <button
          className={`cta-btn ${isTodaySuccess ? "cta-btn-done" : ""}`}
          onClick={() => onToggleNoSpend(todayKey)}
        >
          {isTodaySuccess ? "오늘 무지출 성공! ✓" : "오늘 무지출 성공 체크하기"}
        </button>
      </div>

      <div className="card">
        <div className="section-head">
          <h2 className="card-title">🎯 저축 목표</h2>
          <button className="link-btn" onClick={() => setEditingGoal((v) => !v)}>
            {editingGoal ? "취소" : "목표 수정"}
          </button>
        </div>

        {editingGoal ? (
          <div className="field">
            <label>목표 이름</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>목표 금액</label>
            <input
              type="number"
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <button className="cta-btn" onClick={handleGoalSave}>
              저장하기
            </button>
          </div>
        ) : (
          <>
            <p className="goal-title">{state.goal.title}</p>
            <ProgressBar value={state.goal.saved} max={state.goal.target} color="#ff8a65" />
            <p className="muted">
              {state.goal.saved.toLocaleString()}원 / {state.goal.target.toLocaleString()}원
            </p>
            <form className="budget-row" onSubmit={handleAddSaved}>
              <input
                type="number"
                inputMode="numeric"
                placeholder="저축할 금액"
                value={saveInput}
                onChange={(e) => setSaveInput(e.target.value)}
              />
              <button className="cta-btn small" type="submit">
                저축하기
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function getWeekDays() {
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const days = [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const startOffset = new Date().getDay();
  for (let i = -startOffset; i < 7 - startOffset; i++) {
    const d = new Date(Date.now() + i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    days.push({
      key,
      label: labels[d.getDay()],
      isToday: key === todayKey,
      isFuture: key > todayKey,
    });
  }
  return days;
}
