"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type React from "react";
import { useCallback, useRef, useState } from "react";

const SPRING_CONFIG = { stiffness: 150, damping: 20, mass: 0.5 };

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoloCard({ children, className }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [12, -12]),
    SPRING_CONFIG
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-12, 12]),
    SPRING_CONFIG
  );

  const gradientX = useSpring(
    useTransform(mouseX, [0, 1], [0, 100]),
    SPRING_CONFIG
  );
  const gradientY = useSpring(
    useTransform(mouseY, [0, 1], [0, 100]),
    SPRING_CONFIG
  );

  // Holo rainbow background — CSS radial gradient that tracks the cursor
  const holoBackground = useMotionTemplate`radial-gradient(
    circle at ${gradientX}% ${gradientY}%,
    rgba(255,0,255,0.55) 0%,
    rgba(0,255,255,0.4) 20%,
    rgba(255,255,0,0.35) 40%,
    rgba(0,255,136,0.4) 60%,
    rgba(255,102,0,0.25) 80%,
    transparent 100%
  )`;

  // Glare — a bright white hotspot that follows the cursor
  const glareBackground = useMotionTemplate`radial-gradient(
    circle at ${gradientX}% ${gradientY}%,
    rgba(255,255,255,0.75) 0%,
    rgba(255,255,255,0.12) 35%,
    transparent 70%
  )`;

  // Subtle angle shift for the SVG diffraction lines (small range for subtlety)
  const diffractionAngle = useSpring(
    useTransform(mouseX, [0, 1], [25, 45]),
    SPRING_CONFIG
  );
  const diffractionTransform = useMotionTemplate`rotate(${diffractionAngle})`;

  // Diagonal gradient shift — x1/y1/x2/y2 move gently with mouse
  const gradX1 = useSpring(
    useTransform(mouseX, [0, 1], [0, 20]),
    SPRING_CONFIG
  );
  const gradY1 = useSpring(
    useTransform(mouseY, [0, 1], [0, 15]),
    SPRING_CONFIG
  );
  const gradX2 = useSpring(
    useTransform(mouseX, [0, 1], [80, 100]),
    SPRING_CONFIG
  );
  const gradY2 = useSpring(
    useTransform(mouseY, [0, 1], [85, 100]),
    SPRING_CONFIG
  );

  // A conic sweep that rotates based on cursor angle
  const conicAngle = useSpring(
    useTransform(mouseX, [0, 1], [0, 360]),
    SPRING_CONFIG
  );
  const conicBackground = useMotionTemplate`conic-gradient(
    from ${conicAngle}deg at ${gradientX}% ${gradientY}%,
    #ff008040, #ff800040, #ffff0040, #00ff8040, #0080ff40, #8000ff40, #ff008040
  )`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) {
        return;
      }
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: "1200px" }}>
      <motion.div
        className={`relative h-auto w-full cursor-pointer rounded-2xl ${className ?? ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-black/10 shadow-xl">
          {children}
        </div>

        <motion.div
          animate={{ opacity: isHovering ? 1 : 0.3 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `
              repeating-conic-gradient(
                rgba(255,255,255,0.15) 0% 25%,
                transparent 0% 50%
              )
            `,
            backgroundSize: "12px 12px",
            mixBlendMode: "overlay",
          }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          animate={{ opacity: isHovering ? 0.6 : 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ background: holoBackground, mixBlendMode: "color-dodge" }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          animate={{ opacity: isHovering ? 0.45 : 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ background: conicBackground, mixBlendMode: "overlay" }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          animate={{ opacity: isHovering ? 0.3 : 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ mixBlendMode: "overlay" }}
          transition={{ duration: 0.4 }}
        >
          <motion.svg
            aria-hidden="true"
            className="absolute inset-0"
            height="100%"
            width="100%"
          >
            <defs>
              <motion.linearGradient
                gradientUnits="userSpaceOnUse"
                id="holo-line-grad"
                x1={gradX1}
                x2={gradX2}
                y1={gradY1}
                y2={gradY2}
              >
                <stop offset="0%" stopColor="#ff0080" />
                <stop offset="16%" stopColor="#ff8000" />
                <stop offset="33%" stopColor="#ffff00" />
                <stop offset="50%" stopColor="#00ff80" />
                <stop offset="66%" stopColor="#0080ff" />
                <stop offset="83%" stopColor="#8000ff" />
                <stop offset="100%" stopColor="#ff0080" />
              </motion.linearGradient>
              <motion.pattern
                height="6"
                id="diffraction"
                patternTransform={diffractionTransform}
                patternUnits="userSpaceOnUse"
                width="6"
              >
                <line
                  stroke="url(#holo-line-grad)"
                  strokeWidth="0.5"
                  x1="0"
                  x2="6"
                  y1="3"
                  y2="3"
                />
              </motion.pattern>
            </defs>
            <rect fill="url(#diffraction)" height="100%" width="100%" />
          </motion.svg>
        </motion.div>

        <motion.div
          animate={{ opacity: isHovering ? 0.55 : 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ mixBlendMode: "soft-light" }}
          transition={{ duration: 0.4 }}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0"
            height="100%"
            width="100%"
          >
            <defs>
              <filter id="sparkle">
                <feTurbulence
                  baseFrequency="0.8"
                  numOctaves="4"
                  stitchTiles="stitch"
                  type="fractalNoise"
                />
                <feColorMatrix type="saturate" values="3" />
              </filter>
            </defs>
            <rect
              filter="url(#sparkle)"
              height="100%"
              opacity="0.5"
              width="100%"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ opacity: isHovering ? 0.3 : 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ background: glareBackground, mixBlendMode: "screen" }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          animate={{
            boxShadow: isHovering
              ? "inset 0 0 0 1px rgba(255,255,255,0.35), 0 0 30px rgba(120,200,255,0.18), 0 0 60px rgba(200,100,255,0.12)"
              : "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl"
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
