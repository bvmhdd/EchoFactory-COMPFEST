"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, FileText, AlertTriangle, Check, Cpu, ShieldAlert, BarChart3, Package, Leaf } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"sop" | "fmea" | "supply_chain" | "esg">("sop");
  const [woCreated, setWoCreated] = useState(false);
  const isAbnormal = result.operator_view.condition === "ABNORMAL";
  const { prescriptive_sop, fmea_matrix, supply_chain_derating } = result.supervisor_view;
  const { esg_forensics } = result.manager_view;

  return (
    <div className="p-5 rounded-2xl border border-[#1F1F23] bg-[#050508] flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header with Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 text-zinc-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-200">
                Cognitive Diagnostic & SOP Core
              </span>
            </div>
          </div>

          <Badge variant="mono" className="text-[10px] font-mono border-zinc-800 bg-black text-zinc-500">
            {result.supervisor_view.iso_standard.split("(")[0]}
          </Badge>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#09090c] border border-zinc-800/80 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab("sop")}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === "sop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileText className="w-3 h-3 text-sky-400" />
            <span>SOP & LOTO</span>
          </button>
          <button
            onClick={() => setActiveTab("fmea")}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === "fmea" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>FMEA (RPN)</span>
          </button>
          <button
            onClick={() => setActiveTab("supply_chain")}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === "supply_chain" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Package className="w-3 h-3 text-emerald-400" />
            <span>Derating</span>
          </button>
          <button
            onClick={() => setActiveTab("esg")}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === "esg" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Leaf className="w-3 h-3 text-green-400" />
            <span>ESG Eco</span>
          </button>
        </div>

        {/* Tab 1: SOP & Gemini Diagnostic */}
        {activeTab === "sop" && (
          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">
                Identifikasi Kerusakan & Standar
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

            {/* Prescriptive 5-Step SOP Accordion */}
            {prescriptive_sop && (
              <div className="p-3 rounded-xl bg-black border border-sky-500/20 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sky-400 font-semibold uppercase">
                    🛠️ 5-Step Prescriptive SOP
                  </span>
                  <span className="text-[9px] text-zinc-500">LOTO MANDATE</span>
                </div>
                <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[10px] leading-relaxed">
                  <b className="text-red-400">K3 LOTO:</b> {prescriptive_sop.loto_protocol}
                </div>
                <div className="space-y-1 text-zinc-300 text-[10px] max-h-[110px] overflow-y-auto pr-1 scrollbar-thin">
                  {prescriptive_sop.steps.map((step, idx) => (
                    <p key={idx} className="leading-snug">{step}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Gemini Flash AI Diagnosis Panel */}
            <div className="p-3 rounded-xl bg-[#09090c] border border-sky-500/20 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-semibold text-sky-300 uppercase tracking-wider">
                    Gemini Flash 2.0 Multimodal Core
                  </span>
                </div>
                <Badge variant="mono" className="text-[9px] font-mono bg-sky-500/10 text-sky-400 border-sky-500/30">
                  ISO-10816 + IATF 16949
                </Badge>
              </div>
              {isLoading ? (
                <div className="bg-black/90 p-3 rounded-lg border border-sky-500/30 space-y-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    <span className="text-[10px] font-mono text-sky-300 font-semibold animate-pulse">
                      Gemini Flash Reasoning Pipeline...
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">
                    {analysisStepText || "Mengevaluasi spektrum getaran & rekomendasi SOP preskriptif..."}
                  </p>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-300 leading-relaxed font-sans whitespace-pre-line bg-black/50 p-2.5 rounded-lg border border-zinc-800/80 max-h-[110px] overflow-y-auto pr-2 font-mono scrollbar-thin">
                  {geminiDiagnosis || (
                    isAbnormal
                      ? `[Gemini Flash 2.0 Real-Time Analysis]\nTerdeteksi anomali harmonik akustik pada ${result.machine_id}. Skor anomali (${result.operator_view.anomaly_score.toFixed(3)}) melebihi batas aman 0.500. FMEA RPN ${fmea_matrix.rpn_score}. Rekomendasi: ${result.supervisor_view.recommended_action}`
                      : `[Gemini Flash 2.0 Real-Time Analysis]\nSpektrum akustik ${result.machine_id} dalam batas kerja normal (Skor anomali: ${result.operator_view.anomaly_score.toFixed(3)}). Memenuhi kriteria ${result.supervisor_view.iso_standard}.`
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: FMEA Matrix */}
        {activeTab === "fmea" && fmea_matrix && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black border border-[#27272A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-400 font-semibold uppercase">
                  IATF 16949 FMEA Risk Assessment
                </span>
                <Badge variant="mono" className={`text-[10px] font-bold ${fmea_matrix.rpn_score > 40 ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400"}`}>
                  RPN: {fmea_matrix.rpn_score}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">Severity (S)</span>
                  <b className="text-red-400 text-sm">{fmea_matrix.severity_s}/10</b>
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">Occurrence (O)</span>
                  <b className="text-amber-400 text-sm">{fmea_matrix.occurrence_o}/10</b>
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">Detection (D)</span>
                  <b className="text-emerald-400 text-sm">{fmea_matrix.detection_d}/10</b>
                </div>
              </div>
              <div className="text-[11px] text-zinc-400 pt-1 space-y-1">
                <p><b className="text-zinc-300">Potential Effect:</b> {fmea_matrix.potential_effect}</p>
                <p><b className="text-zinc-300">Risk Priority Category:</b> <span className="text-amber-400">{fmea_matrix.risk_category}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Supply Chain & Derating */}
        {activeTab === "supply_chain" && supply_chain_derating && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black border border-[#27272A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold uppercase">
                  Supply Chain Lead Time vs RUL
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${supply_chain_derating.is_bottleneck ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-400"}`}>
                  {supply_chain_derating.is_bottleneck ? "BOTTLENECK ALERT" : "SUPPLY SECURE"}
                </span>
              </div>
              <div className="text-[11px] text-zinc-300 space-y-1">
                <p>Allocated SKU: <b className="text-white">{supply_chain_derating.part_sku}</b></p>
                <p>Warehouse Stock: <b className="text-emerald-400">{supply_chain_derating.in_stock} Units</b> (Lead Time: {supply_chain_derating.lead_time_days} Hari)</p>
              </div>
              <div className="p-2.5 rounded bg-zinc-900/90 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
                <b>Prescriptive Derating Advice:</b><br />
                {supply_chain_derating.derating_advice}
                <span className="block mt-1 text-[10px] text-zinc-400">
                  Extended RUL under Derating: <b className="text-white">~{supply_chain_derating.extended_rul_days} Hari</b>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: ESG Eco-Efficiency */}
        {activeTab === "esg" && esg_forensics && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black border border-green-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-green-400 font-semibold uppercase">
                  ESG Carbon & Energy Loss Forensics
                </span>
                <Badge variant="mono" className="text-[9px] bg-green-500/10 text-green-400 border-green-500/30">
                  GREEN MFG
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">Motor Efficiency</span>
                  <b className="text-green-400 text-sm">{esg_forensics.motor_efficiency_pct}%</b>
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-500 block">Excess Energy Loss</span>
                  <b className="text-amber-400 text-sm">+{esg_forensics.excess_kwh_per_day} kWh/d</b>
                </div>
              </div>
              <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] space-y-0.5 text-zinc-300">
                <p>Carbon Penalty: <b className="text-red-400">+{esg_forensics.excess_co2_kg_per_day} kg CO2e/hari</b></p>
                <p>Waste Energy Cost: <b className="text-amber-400">IDR {esg_forensics.excess_cost_idr_per_month.toLocaleString()}/bulan</b></p>
              </div>
            </div>
          </div>
        )}
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

