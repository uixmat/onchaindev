import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Chain } from "wagmi/chains";
import { mainnet } from "wagmi/chains";

// Anvil local chain (Chain ID 31337)
export const anvil = {
  id: 31_337,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "" },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "onchain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [anvil, mainnet],
  ssr: true,
});
