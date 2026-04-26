"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Stats } from "../components/Stats";
import { TipForm } from "../components/TipForm";
import { TipHistory } from "../components/TipHistory";
import { OwnerPanel } from "../components/OwnerPanel";
import deployedContracts from "../contracts/deployedContracts";

const CONTRACT_ADDRESS = deployedContracts[11155111].TipJar.address;

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="logo">🫙</span>
          <h1>TipJar</h1>
          <span className="network-badge">Sepolia Testnet</span>
        </div>
        {/* RainbowKit 지갑 연결 버튼 */}
        <ConnectButton />
      </header>

      <main className="app-main">
        <Stats />

        <div className="content-grid">
          <div className="left-col">
            {isConnected ? (
              <TipForm />
            ) : (
              <div className="card connect-prompt">
                <p>💡 팁을 보내려면 지갑을 연결하세요</p>
              </div>
            )}
            <OwnerPanel />
          </div>
          <div className="right-col">
            <TipHistory />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Contract:{" "}
          <a
            href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CONTRACT_ADDRESS} ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
