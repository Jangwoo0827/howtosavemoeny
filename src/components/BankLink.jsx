import { useState } from "react";
import { BANKS, generateMockAccount, generateMockTransactions } from "../utils/mockBank";
import CategoryIcon from "./CategoryIcon";
import { categoryOf } from "../utils/categories";

export default function BankLink({
  state,
  onLinkAccount,
  onUnlinkAccount,
  onImportTransactions,
  onFillTestStreak,
  onFillTestHistory,
  onCompleteTestGoal,
  onResetAll,
}) {
  const [connecting, setConnecting] = useState(null);
  const [pending, setPending] = useState([]);
  const [imported, setImported] = useState(false);

  const linked = state.linkedAccount;

  function handleConnect(bankId) {
    setConnecting(bankId);
    setTimeout(() => {
      const account = generateMockAccount(bankId);
      onLinkAccount(account);
      setPending(generateMockTransactions(4));
      setConnecting(null);
      setImported(false);
    }, 1200);
  }

  function handleImport() {
    onImportTransactions(pending);
    setImported(true);
  }

  function handleRefresh() {
    setPending(generateMockTransactions(2));
    setImported(false);
  }

  return (
    <div className="screen">
      <h1 className="screen-title">🏦 계좌 연동</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        은행 계좌를 연동하면 지출을 직접 입력하지 않아도 자동으로 기록돼요.
      </p>

      {!linked && (
        <div className="card">
          <h2 className="card-title">은행을 선택해주세요</h2>
          <div className="bank-grid">
            {BANKS.map((b) => (
              <button
                key={b.id}
                className="bank-tile"
                onClick={() => handleConnect(b.id)}
                disabled={connecting !== null}
              >
                <span className="bank-tile-emoji" style={{ background: `${b.color}33` }}>
                  {b.emoji}
                </span>
                <span className="bank-tile-name">
                  {connecting === b.id ? "연동 중..." : b.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {linked && (
        <>
          <div className="card bank-account-card">
            <div className="section-head">
              <h2 className="card-title">{linked.bankName}</h2>
              <button className="link-btn" onClick={onUnlinkAccount}>
                연동 해제
              </button>
            </div>
            <p className="muted">{linked.accountNumber}</p>
            <p className="hero-amount" style={{ fontSize: 28, margin: "8px 0 0" }}>
              {linked.balance.toLocaleString()}원
            </p>
          </div>

          <div className="card">
            <div className="section-head">
              <h2 className="card-title">새로 발견된 거래내역</h2>
              <button className="link-btn" onClick={handleRefresh}>
                새로고침
              </button>
            </div>
            {pending.length === 0 ? (
              <p className="empty">새로운 거래내역이 없어요.</p>
            ) : imported ? (
              <p className="empty">✅ 가져오기 완료! 지출 기록에서 확인해보세요.</p>
            ) : (
              <>
                <ul className="tx-list">
                  {pending.map((t) => {
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
                      </li>
                    );
                  })}
                </ul>
                <button className="cta-btn" onClick={handleImport}>
                  {pending.length}건 지출 기록으로 가져오기
                </button>
              </>
            )}
          </div>
        </>
      )}

      <div className="card test-tool-card">
        <h2 className="card-title">🧪 테스트 도구</h2>
        <p className="muted">
          실제 서비스엔 없는 개발용 기능이에요. 일주일씩 안 기다리고 바로 테스트해보세요.
          여기서 만든 데이터는 전부 <span className="test-tag">가짜</span> 표시가 붙어요.
          단, 전체 초기화는 직접 입력한 지출까지 포함해서 앱의 모든 데이터를 지워요.
        </p>
        <div className="test-tool-grid">
          <button className="test-tool-btn" onClick={() => onFillTestStreak(7)}>
            🔥 무지출 7일 채우기
          </button>
          <button className="test-tool-btn" onClick={() => onFillTestHistory(4)}>
            📊 지난 4주 지출 채우기
          </button>
          <button className="test-tool-btn" onClick={onCompleteTestGoal}>
            🎯 저축 목표 100% 채우기
          </button>
          <button className="test-tool-btn test-tool-danger" onClick={onResetAll}>
            🗑️ 전체 초기화 (모든 데이터 삭제)
          </button>
        </div>
      </div>

      <p className="bank-disclaimer">
        * 데모용 목업이에요. 실제 계좌 정보와 연결되지 않으며, 실제 서비스에서는 금융결제원
        오픈뱅킹 API로 대체돼요.
      </p>
    </div>
  );
}
