import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-bold text-4xl tracking-tight">onchain</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Your on-chain dashboard. Connect your wallet, track your assets, and
          manage your portfolio.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/login">
            <LogIn />
            Sign in
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
