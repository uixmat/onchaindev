"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { authClient } from "@/lib/auth-client";

export function useLinkWallet() {
  const { address, isConnected } = useAccount();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (isConnected && address && session) {
      fetch("/api/wallet/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      }).catch(console.error);
    }
  }, [address, isConnected, session]);
}
