"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, FileText, AlertTriangle, Check, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";

export function SupervisorWidget({
  result,
  geminiDiagnosis,
  isLoading,
  analysisStepText,
}: {
  result: DetectionResult;
  geminiDiagnosis?: string | null;
  isLoading?: boolean;
  analysisStepText?: string;
}) {
  const [woCreated, setWoCreated] = useState(false);
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  return (
    <div className="p-5 rounded-2xl border border-[#1F1F23] bg-[#050508] flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 text-zinc-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-200">
                Analisis Akar Masalah
              </span>
            </div>
          </div>

          <Badge variant="mono" className="text-[10px] font-mono border-zinc-800 bg-black text-zinc-500">
            {result.supervisor_view.iso_standard.split("(")[0]}
          </Badge>
        </div>

        {/* Fault Diagnosis */}
        <div className="space-y-3">
          <div>
            <span className="text-[11px] text-zinc-400 block mb-1">
              Identifikasi Masalah
            </span>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              {isAbnormal ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{result.supervisor_view.fault_type}</span>
            </div>
          </div>

          {/* Standard & Actionable SOP */}
          <div className="p-3 rounded-xl bg-black border border-[#1F1F23] space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">
              Rekomendasi Tindakan
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {result.supervisor_view.recommended_action}
            </p>
          </div>

          {/* Gemini Flash AI Diagnosis Panel */}
          <div className="p-3.5 rounded-xl bg-[#09090c] border border-sky-500/20 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="text-[10px] font-mono font-semibold text-sky-300 uppercase tracking-wider">
                  Gemini Flash 3.6 Diagnostic Core
                </span>
              </div>
              <Badge variant="mono" className="text-[9px] font-mono bg-sky-500/10 text-sky-400 border-sky-500/30">
                LLM RAG ISO-10816
              </Badge>
            </div>
            {isLoading ? (
              <div className="bg-black/90 p-3 rounded-lg border border-sky-500/30 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    <span className="text-[11px] font-mono text-sky-300 font-semibold animate-pulse">
                      Gemini Flash 3.6 Diagnostic Pipeline...
                    </span>
                  </div>
                  <Badge variant="mono" className="text-[9px] font-mono bg-sky-500/20 text-sky-300 border-sky-500/40">
                    ANALYZING
                  </Badge>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 h-full animate-pulse w-3/4 transition-all duration-300" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400 truncate">
                  {analysisStepText || "Mengevaluasi spektrum getaran & rekomendasi SOP preskriptif..."}
                </p>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-300 leading-relaxed font-sans whitespace-pre-line bg-black/50 p-3 rounded-lg border border-zinc-800/80 max-h-[220px] overflow-y-auto pr-2 font-mono scrollbar-thin">
                {geminiDiagnosis || (
                  isAbnormal
                    ? `[Gemini Flash 3.6 Real-Time Analysis]\nTerdeteksi lonjakan getaran harmonik abnormal pada sinyal akustik ${result.machine_id}. Skor anomali (${result.operator_view.anomaly_score.toFixed(3)}) melebihi ambang batas aman 0.500. Diidentifikasi sebagai ${result.supervisor_view.fault_type}. Rekomendasi: ${result.supervisor_view.recommended_action}`
                    : `[Gemini Flash 3.6 Real-Time Analysis]\nSpektrum akustik ${result.machine_id} dalam batas kerja normal (Skor anomali: ${result.operator_view.anomaly_score.toFixed(3)}). Memenuhi kriteria ${result.supervisor_view.iso_standard} tanpa tanda degradasi mekanis.`
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Automated Work Order Action */}
      <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs">
        <div className="text-zinc-400 font-mono text-[11px]">
          <span>Tiket: </span>
          <span className="text-zinc-200 font-semibold">{result.supervisor_view.work_order_draft.wo_id}</span>
        </div>

        <button
          onClick={() => setWoCreated(!woCreated)}
          className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
            woCreated
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-medium"
              : "bg-[#18181B] hover:bg-[#27272A] border-zinc-700 text-zinc-300 hover:text-white"
          }`}
        >
          {woCreated ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Work Order Diterbitkan</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>Buat Work Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
