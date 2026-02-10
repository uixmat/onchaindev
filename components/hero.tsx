"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { WalletInput } from "@/components/wallet-input";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Shader background */}
      <div className="pointer-events-none absolute inset-0">
        <GrainGradient
          colorBack="#000000"
          colors={["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"]}
          height="100%"
          intensity={0.5}
          noise={0.25}
          shape="corners"
          softness={0.5}
          speed={1}
          width="100%"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-bold text-5xl text-white tracking-tight">
            Explore any wallet
          </h1>
          <p className="mt-4 text-lg text-white/70">
            View NFT portfolios, track collections, and discover trending tokens
            across the blockchain.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <WalletInput />
            <p className="mt-2 text-white/50 text-xs">
              Try: vitalik.eth or any Ethereum address
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
