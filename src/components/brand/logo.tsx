import React from "react";
import Link from "next/link";

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
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${dim} ${className} group`}
    >
      {/* Outer Glow Aura */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-emerald-500/20 to-transparent blur-md group-hover:blur-lg group-hover:opacity-100 opacity-70 transition-all duration-300 pointer-events-none" />
      )}

      {/* SVG Vector Graphic */}
      <svg
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
      >
        <defs>
          <linearGradient id="ef-box-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#131722" />
            <stop offset="50%" stopColor="#0B0D13" />
            <stop offset="100%" stopColor="#050608" />
          </linearGradient>

          <linearGradient id="ef-box-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="ef-cyan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="ef-emerald-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="ef-core-beacon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <radialGradient id="ef-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <filter id="ef-spark-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Squircle Chassis with chamfered futuristic bevel */}
        <rect
          x="6"
          y="6"
          width="116"
          height="116"
          rx="28"
          fill="url(#ef-box-bg)"
        />
        <rect
          x="6"
          y="6"
          width="116"
          height="116"
          rx="28"
          fill="url(#ef-center-glow)"
        />
        <rect
          x="6"
          y="6"
          width="116"
          height="116"
          rx="28"
          stroke="url(#ef-box-border)"
          strokeWidth="2.5"
        />

        {/* Acoustic Resonance Target Rings (Radar/Sonic Echo) */}
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="#38BDF8"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle
          cx="64"
          cy="64"
          r="26"
          stroke="#10B981"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />

        {/* Outer Acoustic Echo Waves (Left: Ingest Sensor, Right: Passport Verified) */}
        <path
          d="M34 46C29 51 26 57 26 64C26 71 29 77 34 82"
          stroke="url(#ef-cyan-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M23 37C15 45 11 54 11 64C11 74 15 83 23 91"
          stroke="url(#ef-cyan-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        <path
          d="M94 46C99 51 102 57 102 64C102 71 99 77 94 82"
          stroke="url(#ef-emerald-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M105 37C113 45 117 54 117 64C117 74 113 83 105 91"
          stroke="url(#ef-emerald-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Central Acoustic AI Spectrogram Bars */}
        {/* Bar 1 (Sub-bass) */}
        <rect
          x="44"
          y="54"
          width="4.5"
          height="20"
          rx="2.25"
          fill="#38BDF8"
          fillOpacity="0.65"
        />
        {/* Bar 2 (Mid Low) */}
        <rect
          x="53"
          y="40"
          width="5"
          height="48"
          rx="2.5"
          fill="url(#ef-cyan-grad)"
        />
        {/* Bar 3 (Core AI Resonance Peak / Factory Pillar) */}
        <rect
          x="61.5"
          y="28"
          width="5.5"
          height="72"
          rx="2.75"
          fill="url(#ef-core-beacon)"
        />
        {/* Bar 4 (Mid High) */}
        <rect
          x="70.5"
          y="42"
          width="5"
          height="44"
          rx="2.5"
          fill="url(#ef-emerald-grad)"
        />
        {/* Bar 5 (Harmonic High) */}
        <rect
          x="79.5"
          y="56"
          width="4.5"
          height="16"
          rx="2.25"
          fill="#34D399"
          fillOpacity="0.65"
        />

        {/* High-Precision Real-Time Pulse Waveform Line Overlay */}
        <path
          d="M26 64H38L47 50L56 78L64 36L72 84L81 54L90 64H102"
          stroke="#FFFFFF"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Peak AI Pulse Spark Node */}
        <circle
          cx="64"
          cy="36"
          r="3"
          fill="#FFFFFF"
          filter="url(#ef-spark-glow)"
        />
        <circle cx="64" cy="36" r="6" fill="#38BDF8" fillOpacity="0.4" />
      </svg>
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
