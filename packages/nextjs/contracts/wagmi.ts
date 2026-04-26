import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "TipJar",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // https://cloud.walletconnect.com 에서 발급
  chains: [sepolia],
  ssr: true,
});
