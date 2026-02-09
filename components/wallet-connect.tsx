"use client";

import { Check, ChevronDown, Copy, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletConnect() {
  const [open, setOpen] = useState(false);
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();

  const currentChain = chains.find((c) => c.id === chainId);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  if (!isConnected) {
    return (
      <>
        <Button className="w-full" onClick={() => setOpen(true)} size="lg">
          <Wallet className="mr-2 size-4" />
          Connect Wallet
        </Button>

        <Dialog onOpenChange={setOpen} open={open}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose a wallet to connect to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  className="w-full justify-start"
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    setOpen(false);
                  }}
                  size="lg"
                  variant="outline"
                >
                  {connector.icon && (
                    // biome-ignore lint: connector icon from wagmi
                    <img
                      alt={connector.name}
                      className="mr-2 size-5"
                      src={connector.icon}
                    />
                  )}
                  {connector.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Chain Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2" variant="outline">
            {currentChain?.name || "Unknown Chain"}
            <ChevronDown className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {chains.map((chain) => (
            <DropdownMenuItem
              className="gap-2"
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
            >
              {chain.name}
              {chain.id === chainId && <Check className="ml-auto size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Account Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex-1 gap-2" variant="outline">
            <div className="flex size-6 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
              {address?.charAt(2).toUpperCase()}
            </div>
            <span className="font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <ChevronDown className="ml-auto size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-muted-foreground text-xs">Connected with</p>
            <p className="font-medium text-sm">{connector?.name}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2" onClick={handleCopyAddress}>
            <Copy className="size-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-destructive"
            onClick={handleDisconnect}
          >
            <LogOut className="size-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
