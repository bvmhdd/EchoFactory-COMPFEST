"use client";

import { useState } from "react";
import { Wrench, CheckCircle, FileText, Clock, AlertTriangle, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetectionResult } from "@/lib/inference-engine";

export function SupervisorWidget({ result }: { result: DetectionResult }) {
  const [woCreated, setWoCreated] = useState(false);
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  return (
    <div className="p-5 rounded-2xl border border-[#2A2A2E] bg-[#0A0A0B] flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2E]/80 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              👨‍💼 SUPERVISOR: ROOT CAUSE & SOP
            </span>
          </div>

          <Badge variant="warning" className="text-[10px] font-mono">
            {result.supervisor_view.iso_standard.split("(")[0]}
          </Badge>
        </div>

        {/* Fault Diagnosis */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">
              DIAGNOSIS ANOMALI KOMPONEN:
            </span>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
              {isAbnormal ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{result.supervisor_view.fault_type}</span>
            </div>
          </div>

          {/* Standard & Actionable SOP */}
          <div className="p-3 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">
              PANDUAN TINDAKAN PREVENTIF (SOP):
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed">
              {result.supervisor_view.recommended_action}
            </p>
          </div>
        </div>
      </div>

      {/* Automated Work Order Draft Action */}
      <div className="pt-3 border-t border-[#2A2A2E]/60 flex items-center justify-between text-xs font-mono">
        <div className="text-zinc-400">
          <span>Tiket: </span>
          <span className="text-zinc-200 font-semibold">{result.supervisor_view.work_order_draft.wo_id}</span>
        </div>

        <button
          onClick={() => setWoCreated(!woCreated)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
            woCreated
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-[#18181B] hover:bg-[#27272A] border-zinc-700 text-zinc-300 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {woCreated ? "Work Order Diterbitkan ✅" : "Terbitkan Work Order (ERP)"}
        </button>
      </div>
    </div>
  );
}
