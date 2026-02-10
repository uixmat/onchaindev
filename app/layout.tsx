import { GrainGradient } from "@paper-design/shaders-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/components/web3-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "onchain",
  description: "Your on-chain dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Web3Provider>
            <div className="relative flex min-h-screen flex-col">
              <div className="pointer-events-none absolute inset-0 -z-10 max-h-[700px] opacity-50">
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
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
              </div>
              <AppHeader />
              <ViewTransition enter="page-transition" exit="page-transition">
                <main className="flex-1">{children}</main>
              </ViewTransition>
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
