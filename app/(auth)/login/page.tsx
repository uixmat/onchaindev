"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const handleDiscordLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleDiscordLogin} size="lg">
            <LogIn />
            Sign in with Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
