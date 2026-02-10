"use client";

import { useEffect, useState } from "react";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

export function useEthPrice(): number | null {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch(COINGECKO_URL)
      .then((res) => res.json())
      .then((data) => {
        const usd = data?.ethereum?.usd;
        setPrice(typeof usd === "number" ? usd : null);
      })
      .catch(() => setPrice(null));
  }, []);

  return price;
}
