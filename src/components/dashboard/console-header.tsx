"use client";

import Link from "next/link";
import { Activity, ArrowLeft, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ConsoleHeader({
  inferenceLatency,
  status,
}: {
  inferenceLatency?: number;
  status?: "idle" | "running" | "complete";
}) {
  return (
    <header className="border-b border-[#27272A] bg-[#09090B] px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left: Brand & Page Context */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-[#27272A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">
              EchoFactory Diagnostic Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Real-time System Indicators */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>STgram-MFN v3</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Polygon Amoy</span>
        </div>

        {inferenceLatency !== undefined && (
          <Badge variant="success" className="font-mono text-xs px-2.5 py-0.5">
            <Zap className="w-3 h-3 mr-1" />
            {inferenceLatency} ms
          </Badge>
        )}
      </div>
    </header>
  );
}
