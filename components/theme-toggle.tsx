"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost">
        <Sun className="size-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="px-2"
      onClick={toggle}
      variant="ghost"
    >
      <span className="relative size-[1.2rem]">
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.span
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0, filter: "blur(2px)" }}
              initial={{ opacity: 0, filter: "blur(2px)" }}
              key="sun"
              transition={{ duration: 0.15 }}
            >
              <Sun className="size-[1.2rem]" />
            </motion.span>
          ) : (
            <motion.span
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0, filter: "blur(2px)" }}
              initial={{ opacity: 0, filter: "blur(2px)" }}
              key="moon"
              transition={{ duration: 0.15 }}
            >
              <Moon className="size-[1.2rem]" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
