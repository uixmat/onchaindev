"use client";

import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null | undefined;
  };
}

export function DashboardClient({ session }: { session: Session }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const { user } = session;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="font-semibold text-lg">onchain</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.name}</span>
          </div>
          <ModeToggle />
          <Button onClick={handleSignOut} size="sm" variant="ghost">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage alt={user.name} src={user.image ?? undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
              <CardDescription>Connect your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled variant="outline">
                <Wallet className="size-4" />
                Connect Wallet (coming soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
