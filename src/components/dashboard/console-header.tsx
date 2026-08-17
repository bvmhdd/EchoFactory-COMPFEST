"use client";

import Link from "next/link";
import { Activity, ArrowLeft, Cpu, ShieldCheck, Zap, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ConsoleHeader({
  inferenceLatency,
  status,
}: {
  inferenceLatency?: number;
  status?: "idle" | "running" | "complete";
}) {
  return (
    <header className="border-b border-[#2A2A2E] bg-[#0A0A0B] px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left: Brand & Page Context */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-[#2A2A2E]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              EchoFactory Unified Industrial Console
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Booklet P.15 Compliant
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Real-time System Indicators */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#2A2A2E] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Engine: STgram-MFN v3 ONNX</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#2A2A2E] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Amoy: 80002</span>
        </div>

        {inferenceLatency !== undefined && (
          <Badge variant="success" className="font-mono text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {inferenceLatency} ms
          </Badge>
        )}
      </div>
    </header>
  );
}
