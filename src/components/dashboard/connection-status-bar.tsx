"use client";

import { RefreshCw, Server, Brain, Link2 } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useConnectionStatus";

interface ConnectionStatusBarProps {
  status: ConnectionStatus;
  latencyMs: number | null;
  useLiveBackend: boolean;
  onToggleLive: (val: boolean) => void;
  onRefresh: () => void;
}

function StatusDot({ state }: { state: "live" | "sleeping" | "offline" | "unconfigured" | "active" | "not_configured" | "linked" | "simulated" }) {
  const isGood = state === "live" || state === "active" || state === "linked";
  const isPending = state === "sleeping";

  return (
    <span className="relative flex items-center justify-center w-2 h-2">
      {isGood && (
        <span className="animate-status-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60" />
      )}
      <span
        className={`relative inline-flex w-2 h-2 rounded-full ${
          isGood
            ? "bg-emerald-400"
            : isPending
            ? "bg-amber-400"
            : "bg-zinc-600"
        }`}
      />
    </span>
  );
}

const HF_LABELS: Record<string, string> = {
  live: "LIVE",
  sleeping: "WARMING UP",
  offline: "OFFLINE",
  unconfigured: "NOT SET",
};

export function ConnectionStatusBar({
  status,
  latencyMs,
  useLiveBackend,
  onToggleLive,
  onRefresh,
}: ConnectionStatusBarProps) {
  const shortAddr = `${status.contractAddress.slice(0, 6)}...${status.contractAddress.slice(-4)}`;

  return (
    <div className="border-b border-[#1a1a1e] bg-[#050507] px-4 sm:px-6 py-2 flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500 select-none">
      {/* HF Backend */}
      <div className="flex items-center gap-1.5">
        <Server className="w-3 h-3 text-zinc-600" />
        <StatusDot state={status.hfBackend} />
        <span className={status.hfBackend === "live" ? "text-emerald-400" : "text-zinc-500"}>
          {HF_LABELS[status.hfBackend] ?? status.hfBackend.toUpperCase()}
        </span>
        {latencyMs !== null && status.hfBackend === "live" && (
          <span className="text-zinc-600">· {latencyMs}ms</span>
        )}
        <span className="text-zinc-700 hidden sm:inline">bvmhd-compfest.hf.space</span>
      </div>

      <span className="text-zinc-800">|</span>

      {/* Gemini API */}
      <div className="flex items-center gap-1.5">
        <Brain className="w-3 h-3 text-zinc-600" />
        <StatusDot state={status.geminiApi} />
        <span className={status.geminiApi === "active" ? "text-emerald-400" : "text-zinc-500"}>
          {status.geminiApi === "active" ? "GEMINI FLASH" : "GEMINI — NOT SET"}
        </span>
      </div>

      <span className="text-zinc-800">|</span>

      {/* Smart Contract */}
      <div className="flex items-center gap-1.5">
        <Link2 className="w-3 h-3 text-zinc-600" />
        <StatusDot state={status.smartContract} />
        <span className={status.smartContract === "linked" ? "text-emerald-400" : "text-zinc-500"}>
          {status.smartContract === "linked" ? "CHAIN 80002" : "SIMULATED"}
        </span>
        <span className="text-zinc-700 hidden sm:inline">· {shortAddr}</span>
      </div>

      {/* Spacer */}
      <div className="ml-auto flex items-center gap-3">
        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh connection status"
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>

        {/* Live Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className={useLiveBackend ? "text-white" : "text-zinc-600"}>
            LIVE MODE
          </span>
          <button
            onClick={() => onToggleLive(!useLiveBackend)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors duration-200 ${
              useLiveBackend ? "bg-white/20 border border-white/40" : "bg-zinc-800 border border-zinc-700"
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                useLiveBackend ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
