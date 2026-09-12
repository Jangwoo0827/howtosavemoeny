import { useState } from "react";

const BUDGET_PRESETS = [30000, 50000, 70000, 100000];
const GOAL_PRESETS = [
  { title: "무선이어폰 사기", target: 150000 },
  { title: "새 운동화 사기", target: 120000 },
  { title: "여행 자금 모으기", target: 300000 },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(50000);
  const [goalTitle, setGoalTitle] = useState("무선이어폰 사기");
  const [goalTarget, setGoalTarget] = useState(150000);

  function handleFinish() {
    onComplete({
      budget: Number(budget) || 0,
      goal: { title: goalTitle.trim() || "저축 목표", target: Number(goalTarget) || 0, saved: 0 },
    });
  }

  return (
    <div className="onboarding">
      <div className="onboarding-dots">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`onboarding-dot ${i === step ? "onboarding-dot-active" : ""}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="onboarding-step">
          <div className="onboarding-emoji">🐷</div>
          <h1 className="onboarding-title">세이브틴에 오신 걸 환영해요</h1>
          <p className="onboarding-desc">
            지출을 기록하고, 무지출 챌린지에 도전하고,
            <br />
            AI 분석으로 절약 습관을 만들어봐요.
          </p>
          <button className="cta-btn" onClick={() => setStep(1)}>
            시작하기
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="onboarding-step">
          <div className="onboarding-emoji">💰</div>
          <h1 className="onboarding-title">이번 주 예산을 정해볼까요?</h1>
          <p className="onboarding-desc">일주일 동안 쓸 수 있는 금액이에요. 나중에 언제든 바꿀 수 있어요.</p>

          <div className="onboarding-amount">{Number(budget).toLocaleString()}원</div>
          <input
            className="onboarding-input"
            type="number"
            inputMode="numeric"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <div className="chip-row onboarding-chip-row">
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`chip ${Number(budget) === p ? "chip-active" : ""}`}
                onClick={() => setBudget(p)}
              >
                {p.toLocaleString()}원
              </button>
            ))}
          </div>

          <button className="cta-btn" onClick={() => setStep(2)} disabled={!budget}>
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <div className="onboarding-emoji">🎯</div>
          <h1 className="onboarding-title">모으고 싶은 목표가 있나요?</h1>
          <p className="onboarding-desc">목표를 정해두면 저축할 이유가 더 확실해져요.</p>

          <div className="chip-row onboarding-chip-row">
            {GOAL_PRESETS.map((p) => (
              <button
                key={p.title}
                type="button"
                className={`chip ${goalTitle === p.title ? "chip-active" : ""}`}
                onClick={() => {
                  setGoalTitle(p.title);
                  setGoalTarget(p.target);
                }}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="field onboarding-field">
            <label>목표 이름</label>
            <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
            <label>목표 금액</label>
            <input
              type="number"
              inputMode="numeric"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
            />
          </div>

          <button className="cta-btn" onClick={handleFinish} disabled={!goalTitle.trim() || !goalTarget}>
            세이브틴 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
