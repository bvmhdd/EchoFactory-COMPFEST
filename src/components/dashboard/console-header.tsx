"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Layers } from "lucide-react";
import { EchoFactoryLogoIcon } from "@/components/brand/logo";

export type ConsoleTab = "01" | "02" | "03" | "04" | "all";

interface ConsoleHeaderProps {
  inferenceLatency?: number;
  status?: "idle" | "running" | "complete";
  activeTab?: ConsoleTab;
  onTabChange?: (tab: ConsoleTab) => void;
}

export function ConsoleHeader({
  inferenceLatency,
  status,
  activeTab = "01",
  onTabChange,
}: ConsoleHeaderProps) {
  const tabs = [
    { id: "01" as ConsoleTab, label: "01 / Ingestion & Acoustic Scan" },
    { id: "02" as ConsoleTab, label: "02 / Cognitive Diagnostics & Work Order" },
    { id: "03" as ConsoleTab, label: "03 / Fleet Analytics & Financial ROI" },
    { id: "04" as ConsoleTab, label: "04 / On-Chain Passport & Warranty" },
    { id: "all" as ConsoleTab, label: "Full Stacked Overview" },
  ];

  return (
    <div className="border-b border-[#1F1F23] bg-[#050507] select-none">
      {/* Top Header Row matching reference screenshot */}
      <div className="px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#18181C]">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors bg-[#111113] px-2.5 py-1.5 rounded-lg border border-[#27272A] hover:border-zinc-600"
            title="Kembali ke Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-mono">Kembali</span>
          </Link>

          {/* High-Tech Industrial EchoFactory Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <EchoFactoryLogoIcon size="md" glow={true} />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white group-hover:text-zinc-100 transition-colors">
                  ECHO<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">FACTORY</span>
                </span>
                {/* Green Amoy Node Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Amoy Testnet Node
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tracking-tight">
                Acoustic Machine Intelligence • Polygon Amoy Ledger • ISO 10816 Diagnostic Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Right Indicators & Architecture Badge matching user screenshot */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          {inferenceLatency !== undefined && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full border font-mono transition-all ${
                status === "running"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
            >
              <Zap className="w-3 h-3 text-sky-400" />
              {status === "running" ? "Processing Pipeline…" : `${inferenceLatency} ms`}
            </div>
          )}

          {/* STgram-MFN v3 Pill Badge matching user screenshot */}
          <div className="px-3 py-1 rounded-lg bg-[#111115] border border-zinc-800 text-zinc-300 font-mono font-semibold">
            STgram-MFN v3
          </div>
        </div>
      </div>

      {/* Tab Navigation Bar matching reference screenshot */}
      <div className="px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 bg-[#07070a]">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange && onTabChange(t.id)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-semibold transition-all whitespace-nowrap border-t border-x ${
                isActive
                  ? "bg-[#111115] border-zinc-700/80 text-white shadow-lg border-b-transparent"
                  : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#0c0c10]"
              }`}
            >
              {t.id === "all" ? (
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {t.label}
                </span>
              ) : (
                <span>{t.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
