"use client";

import { formatEther } from "viem";
import { useTipStats } from "../hooks/useTipJar";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Stats() {
  const { balance, totalReceived, tipCount, topTipper, topAmount } =
    useTipStats();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">현재 잔액</div>
        <div className="stat-value">
          {balance.data !== undefined ? formatEther(balance.data) : "—"} ETH
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">총 수령액</div>
        <div className="stat-value">
          {totalReceived.data !== undefined
            ? formatEther(totalReceived.data)
            : "—"}{" "}
          ETH
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">팁 횟수</div>
        <div className="stat-value">
          {tipCount.data !== undefined ? tipCount.data.toString() : "—"} 건
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🏆 최다 기부자</div>
        <div className="stat-value">
          {topTipper.data && topTipper.data !== ZERO_ADDR
            ? `${shortAddr(topTipper.data)} (${
                topAmount.data ? formatEther(topAmount.data) : "0"
              } ETH)`
            : "—"}
        </div>
      </div>
    </div>
  );
}
