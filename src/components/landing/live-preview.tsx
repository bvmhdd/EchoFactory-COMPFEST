"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  Wrench,
  BarChart3,
  Lock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LivePreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [anomalyProgress, setAnomalyProgress] = useState(0.887);
  const [selectedMachine, setSelectedMachine] = useState<"fan" | "pump" | "slider" | "valve">("fan");
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWavePhase((prev) => (prev + 1) % 1000);
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnomalyProgress((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        return Math.min(0.98, Math.max(0.75, prev + delta));
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="preview" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Real-Time Edge Telemetry
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Continuous acoustic intelligence without cloud latency.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed font-sans">
          Transform raw 16kHz industrial audio into continuous STgram-MFN feature embeddings. Real-time deterministic diagnosis directly at the factory edge.
        </p>
      </div>

      {/* Main High-Contrast Console Mockup Frame */}
      <div className="rounded-2xl border border-[#27272A] bg-[#09090B] shadow-2xl overflow-hidden relative">
        {/* Mockup Window Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#111113] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-xs font-mono text-zinc-400 ml-3">
              console://echofactory.engine/live-acoustic-inference
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="mono" className="text-[11px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5 animate-pulse"></span>
              STgram-MFN v3 ONNX
            </Badge>
            <Badge variant="success" className="text-[11px] font-mono">
              Latency: 42.6 ms
            </Badge>
          </div>
        </div>

        {/* Mockup Body: Split Acoustic Console */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sub-panel: Waveform & Ingestion */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#111113]/60 rounded-xl p-5 border border-[#27272A]/60">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Acoustic Sensor Stream
                </span>
                <span className="text-xs font-mono text-sky-400">16,000 Hz PCM</span>
              </div>

              {/* Machine selector tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#09090B] rounded-lg border border-[#27272A] mb-6">
                {(["fan", "pump", "slider", "valve"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMachine(m)}
                    className={`py-1.5 text-xs font-mono uppercase rounded transition-all ${
                      selectedMachine === m
                        ? "bg-[#27272A] text-white font-semibold shadow"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="h-28 bg-black rounded-lg border border-[#27272A] p-3 flex items-center justify-between gap-1 overflow-hidden relative">
                {Array.from({ length: 36 }).map((_, i) => {
                  const rawHeight = isPlaying
                    ? Math.sin(i * 0.4 + wavePhase * 0.3) * 35 + 45
                    : 15;
                  const height = Math.round(Math.max(8, Math.min(95, rawHeight)));
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-sky-600 via-sky-400 to-white rounded-full transition-all duration-150"
                      style={{
                        height: `${height}%`,
                        opacity: i % 2 === 0 ? 0.9 : 0.6,
                      }}
                    />
                  );
                })}
                <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-400 bg-black/70 px-1.5 py-0.5 rounded border border-zinc-800">
                  0 dB SNR Floor
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27272A]/60">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white bg-[#18181B] px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause Stream" : "Resume Stream"}</span>
              </button>

              <Link href="/dashboard">
                <span className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium font-mono">
                  Launch Console <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Sub-panel: Real-Time Multi-View Diagnostics */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Operator Card */}
            <div className="p-4 rounded-xl bg-[#111113]/80 border border-rose-500/30 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  Operator View
                </span>
                <Badge variant="danger" className="text-[10px] font-mono">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  ABNORMAL ALERT
                </Badge>
              </div>
              <div className="my-2">
                <div className="text-2xl font-bold font-mono text-rose-400">
                  {anomalyProgress.toFixed(3)}
                </div>
                <div className="text-xs text-zinc-400 flex justify-between mt-1 font-mono">
                  <span>Threshold: 0.500</span>
                  <span className="text-emerald-400">Confidence: 99.32%</span>
                </div>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-2">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${anomalyProgress * 100}%` }}
                />
              </div>
            </div>

            {/* Supervisor Card */}
            <div className="p-4 rounded-xl bg-[#111113]/80 border border-[#27272A] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  Supervisor SOP
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ISO 10816-3
                </span>
              </div>
              <div className="text-sm font-semibold text-white mb-1">
                Bearing Outer Race Degradation
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 font-sans">
                Replace part #SKF-6204 & lubricate ISO VG 46 within 48 hours.
              </p>
            </div>

            {/* Plant Manager Card */}
            <div className="p-4 rounded-xl bg-[#111113]/80 border border-[#27272A] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  Plant Executive
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  62% HEALTH
                </span>
              </div>
              <div className="text-lg font-bold text-white font-mono">
                $4,200 <span className="text-xs font-sans text-zinc-400 font-normal">Downtime Saved</span>
              </div>
              <div className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3" />
                <span>Medium Operational Risk</span>
              </div>
            </div>

            {/* Auditor Card */}
            <div className="p-4 rounded-xl bg-[#111113]/80 border border-[#27272A] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  On-Chain Trust
                </span>
                <span className="text-[10px] font-mono text-purple-300">Amoy #80002</span>
              </div>
              <div className="font-mono text-xs text-zinc-300 truncate bg-black/60 p-1.5 rounded border border-zinc-800">
                0x8f3c71a9e2d5b6...
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Tamper-Proof Audit Hash
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Highlights Below Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#27272A]/60 text-left">
        <div>
          <h4 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            Sub-50ms Edge Latency
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Ultra-lightweight STgram-MFN v3 architecture runs natively on standard industrial edge CPUs without expensive GPUs.
          </p>
        </div>
        <div>
          <h4 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            0 dB SNR Harsh Noise Immunity
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Dual-branch STFT & Mel-spectrogram time-frequency metric learning separates micro-defect clicks from heavy background factory hum.
          </p>
        </div>
        <div>
          <h4 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Tamper-Proof Audit Trail
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Every health diagnosis is cryptographically committed to the Polygon Amoy blockchain for immutable insurance and asset resale proof.
          </p>
        </div>
      </div>
    </section>
  );
}
