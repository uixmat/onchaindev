import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";

// Anvil local chain (for testing)
export const anvil = {
  id: 31_337,
  name: "Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
} as const;

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

export const config = getDefaultConfig({
  appName: "onchain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [anvil, mainnet],
  ssr: true,
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});
