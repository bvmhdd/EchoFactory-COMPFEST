"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, FileText, Clock, AlertTriangle, Check, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";

export function SupervisorWidget({ result }: { result: DetectionResult }) {
  const [woCreated, setWoCreated] = useState(false);
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  return (
    <div className="p-5 rounded-2xl border border-[#27272A] bg-[#09090B] flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase">
                Supervisor Diagnostic Core
              </span>
              <span className="text-[10px] text-zinc-400 block font-mono">Root Cause & ISO 10816 SOP RAG</span>
            </div>
          </div>

          <Badge variant="warning" className="text-[10px] font-mono border-amber-500/30 bg-amber-500/10 text-amber-300">
            {result.supervisor_view.iso_standard.split("(")[0]}
          </Badge>
        </div>

        {/* Fault Diagnosis */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">
              Component Anomaly Identification
            </span>
            <div className="text-sm font-semibold text-white mt-1 flex items-center gap-2">
              {isAbnormal ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{result.supervisor_view.fault_type}</span>
            </div>
          </div>

          {/* Standard & Actionable SOP */}
          <div className="p-3.5 rounded-xl bg-[#111113] border border-[#27272A] space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">
              Standard Operating Procedure (SOP)
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {result.supervisor_view.recommended_action}
            </p>
          </div>
        </div>
      </div>

      {/* Automated Work Order Draft Action */}
      <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs font-mono">
        <div className="text-zinc-400">
          <span>Ticket: </span>
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
          {woCreated ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Work Order Dispatched</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>Dispatch Work Order (ERP)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
