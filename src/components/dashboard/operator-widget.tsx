"use client";

import { Activity, CheckCircle2, AlertOctagon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";
import { PresetSample } from "@/lib/audio-presets";
import { SpectrogramCanvas } from "./spectrogram-canvas";

export function OperatorWidget({
  result,
  sample,
}: {
  result: DetectionResult;
  sample: PresetSample;
}) {
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        isAbnormal
          ? "bg-[#0E0A0B] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
          : "bg-[#0A0E0C] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2E]/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isAbnormal ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            👷 WIDGET OPERATOR LAPANGAN: STATUS AKUSTIK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="mono" className="text-[10px] font-mono">
            <Zap className="w-3 h-3 mr-1 text-cyan-400" />
            {result.inference_time_ms} ms
          </Badge>
          <Badge variant={isAbnormal ? "danger" : "success"} className="text-xs font-mono font-bold">
            {isAbnormal ? "🔴 ABNORMAL (ALERT)" : "🟢 NORMAL (PASS)"}
          </Badge>
        </div>
      </div>

      {/* Main Condition Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#000000]/60 border border-zinc-800">
          <span className="text-zinc-400 block text-[10px]">ANOMALY SCORE:</span>
          <span
            className={`text-lg font-bold ${
              isAbnormal ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {result.operator_view.anomaly_score.toFixed(3)}
          </span>
          <span className="text-[10px] text-zinc-400 ml-1.5">(Thresh: 0.500)</span>
        </div>

        <div className="p-3 rounded-xl bg-[#000000]/60 border border-zinc-800">
          <span className="text-zinc-400 block text-[10px]">CONFIDENCE LEVEL:</span>
          <span className="text-lg font-bold text-white">
            {result.operator_view.confidence_level}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#000000]/60 border border-zinc-800">
          <span className="text-zinc-400 block text-[10px]">INFERENCE ENGINE:</span>
          <span className="text-xs font-semibold text-cyan-400 truncate block mt-1">
            STgram-MFN v3 ONNX
          </span>
        </div>
      </div>

      {/* 2D Mel-Spectrogram & Linear STFT Visualizer */}
      <SpectrogramCanvas sample={sample} condition={result.operator_view.condition} />
    </div>
  );
}
