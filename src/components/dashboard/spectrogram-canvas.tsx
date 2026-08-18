"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, Sparkles, Zap } from "lucide-react";
import { PresetSample, playSyntheticIndustrialSound } from "@/lib/audio-presets";

interface SpectrogramProps {
  sample: PresetSample;
  condition: "NORMAL" | "ABNORMAL";
}

export function SpectrogramCanvas({ sample, condition }: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const soundStopRef = useRef<(() => void) | null>(null);
  const animFrameRef = useRef<number>(0);

  const isAbnormal = condition === "ABNORMAL";

  // Generate synthetic spectrogram grid data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw Spectrogram background
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, width, height);

    // Columns (time) and Rows (frequency bins)
    const timeCols = 100;
    const freqRows = 48;
    const cellW = width / timeCols;
    const cellH = height / freqRows;

    // Color gradient interpolation (deep blue/purple -> amber -> yellow -> white)
    const getColor = (intensity: number) => {
      const clamped = Math.max(0, Math.min(1, intensity));
      if (clamped < 0.25) {
        // Deep purple to navy
        const t = clamped / 0.25;
        return `rgb(${Math.round(15 + t * 40)}, ${Math.round(10 + t * 20)}, ${Math.round(40 + t * 90)})`;
      } else if (clamped < 0.6) {
        // Blue to magenta/amber
        const t = (clamped - 0.25) / 0.35;
        return `rgb(${Math.round(55 + t * 180)}, ${Math.round(30 + t * 60)}, ${Math.round(130 - t * 80)})`;
      } else if (clamped < 0.85) {
        // Orange to yellow
        const t = (clamped - 0.6) / 0.25;
        return `rgb(255, ${Math.round(90 + t * 140)}, ${Math.round(50 - t * 40)})`;
      } else {
        // Yellow to bright white (anomalous energy spike)
        const t = (clamped - 0.85) / 0.15;
        return `rgb(255, 255, ${Math.round(10 + t * 245)})`;
      }
    };

    for (let c = 0; c < timeCols; c++) {
      for (let r = 0; r < freqRows; r++) {
        // Invert row so high freq is at top
        const freqRatio = 1 - r / freqRows;
        let intensity = 0.08 + Math.sin(c * 0.15 + r * 0.3) * 0.04;

        // Base machine fundamental hum
        if (freqRatio < 0.15) {
          intensity += 0.45 + Math.sin(c * 0.2) * 0.15;
        }

        // Abnormal signatures: high frequency harmonic bursts & cavitation hiss
        if (isAbnormal) {
          // High frequency band (3 kHz - 6 kHz)
          if (freqRatio > 0.45 && freqRatio < 0.85) {
            intensity += 0.55 + Math.sin(c * 0.8) * 0.3;
          }
          // Periodic bearing defect knock bursts
          if (c % 12 === 0 || (c + 1) % 12 === 0) {
            intensity += 0.75;
          }
        }

        ctx.fillStyle = getColor(intensity);
        ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // Grid overlays & Frequency lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [sample, isAbnormal]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (soundStopRef.current) soundStopRef.current();
      setIsPlaying(false);
      setPlayProgress(0);
      cancelAnimationFrame(animFrameRef.current);
    } else {
      const duration = 4.0;
      const { stop } = playSyntheticIndustrialSound(sample, duration);
      soundStopRef.current = stop;
      setIsPlaying(true);

      const startTime = performance.now();
      const updateProgress = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(1, elapsed / duration);
        setPlayProgress(progress);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
          setIsPlaying(false);
          setPlayProgress(0);
        }
      };
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    return () => {
      if (soundStopRef.current) soundStopRef.current();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl bg-[#050508] border border-[#2A2A2E] p-3.5 flex flex-col space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mel-Spectrogram & Linear STFT Dual-Plot (16 kHz / 0 dB SNR)</span>
        </div>
        <span className="text-[10px] text-zinc-400">128 Mel Bins • 10s Window</span>
      </div>

      {/* Canvas Area with Frequency Y-Axis & Time X-Axis */}
      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-zinc-800 flex">
        {/* Y-Axis labels */}
        <div className="w-12 bg-black/80 flex flex-col justify-between py-1 px-1 text-[9px] font-mono text-zinc-400 border-r border-zinc-800 select-none">
          <span>8.0 kHz</span>
          <span>4.0 kHz</span>
          <span>1.5 kHz</span>
          <span>0 Hz</span>
        </div>

        {/* Canvas */}
        <div className="relative flex-1 h-full">
          <canvas
            ref={canvasRef}
            width={480}
            height={144}
            className="w-full h-full object-cover"
          />

          {/* Time playback scrub line */}
          {isPlaying && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#ffffff] transition-all duration-75 pointer-events-none"
              style={{ left: `${playProgress * 100}%` }}
            />
          )}

          {/* Anomaly annotation tag on canvas */}
          {isAbnormal && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500/90 text-white font-mono text-[9px] font-semibold tracking-wide shadow-md flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-white" />
              <span>HIGH HARMONIC ENERGY SPIKE</span>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls & Colormap Scale */}
      <div className="flex items-center justify-between text-xs font-mono pt-1">
        <button
          onClick={handleTogglePlay}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#18181B] hover:bg-[#27272A] border border-[#2A2A2E] text-zinc-200 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause Sound" : "Listen Audio Track"}</span>
        </button>

        {/* Color Scale Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
          <span>-80dB</span>
          <div className="w-20 h-2 rounded bg-gradient-to-r from-[#0f0a28] via-[#871e82] via-[#ff5a36] to-[#ffffff]" />
          <span>0dB</span>
        </div>
      </div>
    </div>
  );
}
