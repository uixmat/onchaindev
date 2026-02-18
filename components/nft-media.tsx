"use client";

import Image from "next/image";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".ogv"];

function isVideo(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
  }
}

interface NftMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
}

export function NftMedia({
  src,
  alt,
  width = 500,
  height = 500,
  className = "size-full object-cover",
  loading = "lazy",
}: NftMediaProps) {
  if (isVideo(src)) {
    return (
      <video
        autoPlay
        className={className}
        loop
        muted
        playsInline
        poster=""
        preload="metadata"
      >
        <source src={src} />
      </video>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      loading={loading}
      src={src}
      width={width}
    />
  );
}
