"use client";

import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Wind,
  Droplet,
  SlidersHorizontal,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      {/* Top Engine Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8 hover:border-white/30 transition-all cursor-default">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-xs font-medium text-zinc-300 font-mono tracking-wide">
          STgram-MFN v3 ONNX Edge • Polygon Amoy 80002
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
      </div>

      {/* Main Hero Headline */}
      <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gradient leading-[1.08] mb-6">
        The acoustic intelligence platform for autonomous factory maintenance
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 font-normal">
        Detect microscopic mechanical degradation in 0 dB SNR industrial noise.
        Durable sub-50ms edge inference, ISO 10816 cognitive SOP diagnostics, and tamper-proof on-chain machine health ledgers.
      </p>

      {/* Dual CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold tracking-wide border-zinc-700 hover:border-white gap-2 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
          >
            LAUNCH CONSOLE
            <span className="text-zinc-400 font-mono">»</span>
          </Button>
        </Link>

        <a
          href="https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold tracking-wide gap-2 shadow-[0_0_30px_rgba(255,255,255,0.18)]"
          >
            VIEW SMART CONTRACT
            <ArrowUpRight className="w-4 h-4 text-black" />
          </Button>
        </a>
      </div>

      {/* Machine Preset Quick Tickers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full mb-16 text-left">
        {[
          { icon: Wind, title: "Fan Blower", score: "94.04% AUC", status: "Optimal" },
          { icon: Droplet, title: "Pump Centrifugal", score: "91.90% AUC", status: "Optimal" },
          { icon: SlidersHorizontal, title: "Slider Rail", score: "99.32% AUC", status: "Optimal" },
          { icon: Activity, title: "Solenoid Valve", score: "99.60% AUC", status: "Optimal" },
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#09090B]/80 border border-[#27272A] flex flex-col gap-1 hover:border-zinc-500 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-2 font-medium text-white">
                  <IconComp className="w-3.5 h-3.5 text-sky-400" />
                  <span>{item.title}</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-mono text-zinc-300">{item.score}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  0 dB SNR
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Social Proof / Ecosystem Bar with Smooth Infinite Right-Sliding Marquee */}
      <div className="w-full max-w-6xl border-t border-[#2A2A2E]/60 pt-10 overflow-hidden">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-8">
          INDUSTRIAL STANDARDS & EMBEDDED ECOSYSTEM
        </p>

        {/* Marquee Wrapper with Edge Fade Mask */}
        <div className="relative w-full overflow-hidden mask-fade-x py-3">
          <div className="flex w-max items-center animate-marquee-left select-none">
            {/* First Set of Logos */}
            <div className="flex items-center gap-12 sm:gap-16 px-6 sm:px-8 text-xs sm:text-sm font-semibold tracking-wider text-zinc-400">
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">POLYGON AMOY</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">ISO 10816-3</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">HITACHI MIMII</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">ONNX RUNTIME</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">WEBAUDIO API</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">SKF INDUSTRIAL</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">SIEMENS S7</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">BOSCH REXROTH</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">FANUC ROBOTICS</span>
              <span className="text-zinc-700">•</span>
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex items-center gap-12 sm:gap-16 px-6 sm:px-8 text-xs sm:text-sm font-semibold tracking-wider text-zinc-400">
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">POLYGON AMOY</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">ISO 10816-3</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">HITACHI MIMII</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">ONNX RUNTIME</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">WEBAUDIO API</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">SKF INDUSTRIAL</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">SIEMENS S7</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">BOSCH REXROTH</span>
              <span className="text-zinc-700">•</span>
              <span className="hover:text-white transition-colors cursor-default whitespace-nowrap">FANUC ROBOTICS</span>
              <span className="text-zinc-700">•</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
