"use client";

import { formatEther } from "viem";
import { useTipHistory } from "../hooks/useTipJar";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function TipHistory() {
  const { data: history, isLoading, refetch } = useTipHistory();

  return (
    <div className="card">
      <div className="card-header">
        <h2>📋 팁 내역</h2>
        <button className="btn-sm" onClick={() => refetch()}>
          새로고침
        </button>
      </div>

      {isLoading && <p className="sub">불러오는 중...</p>}

      {!isLoading && (!history || history.length === 0) && (
        <p className="sub empty">아직 팁이 없습니다. 첫 번째 팁을 보내보세요! 🎉</p>
      )}

      <div className="history-list">
        {history &&
          [...history]
            .reverse()
            .map((record, i) => (
              <div key={i} className="tip-record">
                <div className="tip-record-top">
                  <span className="tipper" title={record.tipper}>
                    👤 {shortAddr(record.tipper)}
                  </span>
                  <span className="amount">
                    💰 {formatEther(record.amount)} ETH
                  </span>
                </div>
                {record.message && (
                  <p className="tip-message">💬 {record.message}</p>
                )}
                <p className="tip-time">
                  🕐{" "}
                  {new Date(
                    Number(record.timestamp) * 1000
                  ).toLocaleString("ko-KR")}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
