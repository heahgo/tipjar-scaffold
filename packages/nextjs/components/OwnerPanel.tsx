"use client";

import { useState } from "react";
import { formatEther, parseEther, isAddress } from "viem";
import {
  useIsOwner,
  useWithdraw,
  useSetMinTip,
  useTransferOwnership,
  useTipStats,
} from "../hooks/useTipJar";

export function OwnerPanel() {
  const isOwner = useIsOwner();
  const [newMinTip, setNewMinTip] = useState("0.001");
  const [newOwner, setNewOwner] = useState("");

  const { balance } = useTipStats();
  const { withdraw, isPending: wPending, isSuccess: wSuccess } = useWithdraw();
  const { setMinTip, isPending: mPending, isSuccess: mSuccess } = useSetMinTip();
  const { transferOwnership, isPending: oPending, isSuccess: oSuccess } =
    useTransferOwnership();

  if (!isOwner) return null;

  return (
    <div className="card owner-panel">
      <h2>🔐 Owner 패널</h2>

      {/* 출금 */}
      <div className="owner-section">
        <h3>출금</h3>
        <p>
          현재 잔액:{" "}
          {balance.data !== undefined ? formatEther(balance.data) : "0"} ETH
        </p>
        <button
          className="btn-danger"
          onClick={withdraw}
          disabled={wPending || !balance.data || balance.data === 0n}
        >
          {wPending ? "⏳ 처리 중..." : "전액 출금"}
        </button>
        {wSuccess && <p className="success">✅ 출금 완료!</p>}
      </div>

      {/* 최소 팁 변경 */}
      <div className="owner-section">
        <h3>최소 팁 설정</h3>
        <div className="field">
          <input
            type="number"
            value={newMinTip}
            onChange={(e) => setNewMinTip(e.target.value)}
            step="0.001"
            placeholder="0.001"
          />
          <span>ETH</span>
        </div>
        <button
          className="btn-secondary"
          onClick={() => setMinTip(parseEther(newMinTip || "0"))}
          disabled={mPending}
        >
          {mPending ? "⏳ 처리 중..." : "최소 팁 변경"}
        </button>
        {mSuccess && <p className="success">✅ 변경 완료!</p>}
      </div>

      {/* 소유권 이전 */}
      <div className="owner-section">
        <h3>소유권 이전</h3>
        <div className="field">
          <input
            type="text"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <button
          className="btn-warning"
          onClick={() => transferOwnership(newOwner as `0x${string}`)}
          disabled={oPending || !isAddress(newOwner)}
        >
          {oPending ? "⏳ 처리 중..." : "소유권 이전 ⚠️"}
        </button>
        {oSuccess && <p className="success">✅ 소유권이 이전되었습니다!</p>}
      </div>
    </div>
  );
}
