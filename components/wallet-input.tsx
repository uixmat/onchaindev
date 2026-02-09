"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WalletInput() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      router.push(`/portfolio/${address.trim()}`);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address or ENS..."
        type="text"
        value={address}
      />
      <Button disabled={!address.trim()} type="submit">
        <Search className="size-4" />
        View
      </Button>
    </form>
  );
}
