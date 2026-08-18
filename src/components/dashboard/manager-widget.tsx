"use client";

import { Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";

export function ManagerWidget({ result }: { result: DetectionResult }) {
  const health = result.manager_view.machine_health_percentage;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  return (
    <div className="p-5 rounded-2xl border border-[#27272A] bg-[#09090B] flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-200">
                Ringkasan Kondisi Mesin
              </span>
            </div>
          </div>

          <Badge
            variant={
              result.manager_view.risk_level === "HIGH_CRITICAL"
                ? "danger"
                : result.manager_view.risk_level === "MEDIUM_WARNING"
                ? "warning"
                : "success"
            }
            className="text-[10px] font-medium px-2 py-0.5"
          >
            {result.manager_view.risk_level === "HIGH_CRITICAL"
              ? "Risiko Tinggi"
              : result.manager_view.risk_level === "MEDIUM_WARNING"
              ? "Peringatan"
              : "Aman"}
          </Badge>
        </div>

        {/* Gauge & Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Circular Health Gauge */}
          <div className="sm:col-span-5 flex items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#1F1F23"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={health > 80 ? "#10b981" : health > 50 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold font-mono text-white leading-none">
                  {health.toFixed(0)}%
                </span>
                <span className="text-[9px] text-zinc-400 mt-0.5 font-medium">
                  Health Index
                </span>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="sm:col-span-7 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">Downtime Dicegah:</span>
              <span className="text-white font-semibold font-mono text-xs">
                ${result.manager_view.estimated_downtime_mitigated_usd.toLocaleString()} USD
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">Estimasi Sisa Umur:</span>
              <span className="text-amber-400 font-semibold font-mono text-xs">
                ~{result.manager_view.estimated_rul_days} Hari
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#27272A] text-[11px] text-zinc-400 flex items-center justify-between">
        <span>Ketersediaan Armada:</span>
        <span className="text-emerald-400 font-semibold font-mono">99.98% Availability</span>
      </div>
    </div>
  );
}
