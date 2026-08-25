import React from "react";
import Link from "next/link";
import Image from "next/image";

interface EchoFactoryLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
  isLink?: boolean;
  href?: string;
  glow?: boolean;
}

export function EchoFactoryLogoIcon({
  size = "md",
  className = "",
  glow = true,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}) {
  const sizeMap = {
    xs: { container: "w-6 h-6", px: 24, rounded: "rounded-lg" },
    sm: { container: "w-8 h-8", px: 32, rounded: "rounded-lg" },
    md: { container: "w-10 h-10", px: 40, rounded: "rounded-xl" },
    lg: { container: "w-12 h-12", px: 48, rounded: "rounded-xl" },
    xl: { container: "w-16 h-16", px: 64, rounded: "rounded-2xl" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${currentSize.container} ${className} group`}
    >
      {/* Outer Glow Aura */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/25 via-blue-500/20 to-emerald-500/20 blur-md group-hover:blur-lg group-hover:opacity-100 opacity-70 transition-all duration-300 pointer-events-none" />
      )}

      {/* Modern Badge Container with subtle glass border for high contrast on dark theme */}
      <div
        className={`relative z-10 w-full h-full ${currentSize.rounded} bg-[#0B101B]/95 border border-cyan-500/30 p-1 flex items-center justify-center overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-cyan-400/60 group-hover:scale-[1.03]`}
      >
        <Image
          src="/logo produk/EchoFactoryLogo.png"
          alt="EchoFactory Logo"
          width={currentSize.px}
          height={currentSize.px}
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.25)]"
          priority
        />
      </div>
    </div>
  );
}

export function EchoFactoryLogo({
  size = "md",
  showText = true,
  subtitle = "Smart Manufacturing",
  className = "",
  isLink = true,
  href = "/",
  glow = true,
}: EchoFactoryLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <EchoFactoryLogoIcon size={size} glow={glow} />

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-wider text-white group-hover:text-zinc-100 transition-colors">
              ECHO<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">FACTORY</span>
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
