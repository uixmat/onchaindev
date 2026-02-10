"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

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
    <form onSubmit={handleSubmit}>
      <InputGroup className="bg-black/10 backdrop-blur-sm dark:bg-black/50">
        <InputGroupInput
          aria-label="Enter wallet address or ENS"
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address or ENS..."
          value={address}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            disabled={!address.trim()}
            size="xs"
            type="submit"
            variant="default"
          >
            <Search className="size-3.5" />
            <span className="sr-only">View</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
