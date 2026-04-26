"use client";

import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useSendTip, useTipStats } from "../hooks/useTipJar";

export function TipForm() {
  const [amount, setAmount] = useState("0.001");
  const [message, setMessage] = useState("");
  const { sendTip, isPending, isConfirming, isSuccess, error } = useSendTip();
  const { minTip } = useTipStats();

  const minTipEth = minTip.data ? formatEther(minTip.data) : "0.001";

  const handleSubmit = () => {
    try {
      sendTip(parseEther(amount || "0"), message);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="card">
      <h2>💸 팁 보내기</h2>
      <p className="sub">최소 팁: {minTipEth} ETH</p>

      <div className="field">
        <label>금액 (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.001"
          min={minTipEth}
          placeholder="0.001"
        />
      </div>

      <div className="field">
        <label>메시지 (선택)</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="응원합니다! 🎉"
          maxLength={100}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={isPending || isConfirming}
      >
        {isPending
          ? "⏳ 지갑 확인 중..."
          : isConfirming
          ? "⛓️ 블록 확인 중..."
          : "팁 보내기 🫙"}
      </button>

      {isSuccess && <p className="success">✅ 팁이 전송되었습니다!</p>}
      {error && <p className="error">❌ {error.message.slice(0, 80)}</p>}
    </div>
  );
}
