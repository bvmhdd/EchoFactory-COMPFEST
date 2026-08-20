"use client";

import Link from "next/link";
import { Activity, ArrowLeft, Zap } from "lucide-react";

export function ConsoleHeader({
  inferenceLatency,
  status,
}: {
  inferenceLatency?: number;
  status?: "idle" | "running" | "complete";
}) {
  return (
    <header className="border-b border-[#1F1F23] bg-[#050507] px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left: Back + Brand */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors bg-[#111113] px-2.5 py-1.5 rounded-lg border border-[#27272A] hover:border-zinc-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-mono">Kembali</span>
        </Link>

        {/* Logo — identik dengan Navbar landing */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-600 p-[1px] shadow-[0_0_15px_rgba(255,255,255,0.12)] group-hover:shadow-[0_0_22px_rgba(255,255,255,0.25)] transition-all">
            <div className="w-full h-full bg-[#0A0A0B] rounded-[11px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-white">
              ECHOFACTORY
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
              Diagnostic Console
            </span>
          </div>
        </Link>
      </div>

      {/* Right: System Indicators */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111113] border border-[#1F1F23] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
          <span>STgram-MFN v3</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111113] border border-[#1F1F23] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          <span>Polygon Amoy</span>
        </div>

        {inferenceLatency !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono text-[10px] transition-colors ${
            status === "running"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-white/5 border-white/15 text-white"
          }`}>
            <Zap className="w-3 h-3" />
            {status === "running" ? "Processing…" : `${inferenceLatency} ms`}
          </div>
        )}
      </div>
    </header>
  );
}
