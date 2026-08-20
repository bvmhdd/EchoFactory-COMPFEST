"use client";

import { Activity, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";
import { PresetSample } from "@/lib/audio-presets";
import { SpectrogramCanvas } from "./spectrogram-canvas";
import { AudioPlayerWidget } from "./audio-player-widget";

export function OperatorWidget({
  result,
  sample,
  isLoading,
  analysisStep,
}: {
  result: DetectionResult;
  sample: PresetSample;
  isLoading?: boolean;
  analysisStep?: number;
}) {
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        isAbnormal
          ? "bg-[#0C0809] border-rose-500/30 animate-glow-abnormal"
          : "bg-[#07090a] border-white/10"
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isAbnormal ? "bg-rose-500/15 text-rose-400" : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-200">
              Kondisi Akustik — {sample.machineId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="mono" className="text-[10px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
            <Zap className="w-3 h-3 mr-1 text-sky-400" />
            {result.inference_time_ms} ms
          </Badge>
          <Badge
            variant={isAbnormal ? "danger" : "success"}
            className="text-xs font-medium px-2.5 py-1"
          >
            {isAbnormal ? (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Abnormal
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Normal
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Score Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80">
          <span className="text-zinc-400 block text-[11px]">Skor Anomali</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-lg font-bold font-mono ${
                isAbnormal ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {result.operator_view.anomaly_score.toFixed(3)}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">(Threshold: 0.500)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80">
          <span className="text-zinc-400 block text-[11px]">Tingkat Keyakinan</span>
          <span className="text-lg font-bold text-white block mt-0.5 font-mono">
            {result.operator_view.confidence_level}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80">
          <span className="text-zinc-400 block text-[11px]">Arsitektur Model</span>
          <span className="text-xs font-semibold text-white truncate block mt-1 font-mono">
            STgram-MFN v3
          </span>
        </div>
      </div>

      {/* Real-time Spectrogram (Mel + FFT) */}
      <SpectrogramCanvas
        sample={sample}
        condition={result.operator_view.condition}
        isLoading={isLoading}
        analysisStep={analysisStep}
      />

      {/* Audio Player */}
      <div className="mt-4">
        <AudioPlayerWidget sample={sample} />
      </div>
    </div>
  );
}
