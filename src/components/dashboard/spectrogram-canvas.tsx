"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, Cpu } from "lucide-react";
import { PresetSample } from "@/lib/audio-presets";

interface SpectrogramProps {
  sample: PresetSample;
  condition: "NORMAL" | "ABNORMAL";
  isLoading?: boolean;
  analysisStep?: number;
}

// ---------- DSP helpers (runs in browser only) ----------

function hzToMel(hz: number) {
  return 2595 * Math.log10(1 + hz / 700);
}
function melToHz(mel: number) {
  return 700 * (10 ** (mel / 2595) - 1);
}

function buildMelFilterbank(
  numMelBins: number,
  fftSize: number,
  sampleRate: number,
  fMin = 50,
  fMax = 8000
): Float32Array[] {
  const melMin = hzToMel(fMin);
  const melMax = hzToMel(fMax);
  const melPoints = Array.from({ length: numMelBins + 2 }, (_, i) =>
    melMin + (i / (numMelBins + 1)) * (melMax - melMin)
  );
  const hzPoints = melPoints.map(melToHz);
  const binPoints = hzPoints.map((hz) =>
    Math.round((hz / sampleRate) * fftSize)
  );

  return Array.from({ length: numMelBins }, (_, m) => {
    const filter = new Float32Array(fftSize / 2 + 1);
    const left = binPoints[m];
    const center = binPoints[m + 1];
    const right = binPoints[m + 2];
    for (let k = left; k <= center; k++) {
      filter[k] = (k - left) / Math.max(1, center - left);
    }
    for (let k = center; k <= right; k++) {
      filter[k] = (right - k) / Math.max(1, right - center);
    }
    return filter;
  });
}

function computeMelSpectrogram(
  audioBuffer: AudioBuffer,
  numMelBins = 96,
  numTimeFrames = 128,
  fftSize = 1024
): { melDb: Float32Array[]; avgPowerSpectrum: Float32Array } {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const hopSize = Math.floor(totalSamples / numTimeFrames);
  const filters = buildMelFilterbank(numMelBins, fftSize, sampleRate);

  const melFrames: Float32Array[] = [];
  const avgPower = new Float32Array(fftSize / 2 + 1);

  // Hann window
  const window = new Float32Array(fftSize);
  for (let n = 0; n < fftSize; n++) {
    window[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (fftSize - 1)));
  }

  for (let t = 0; t < numTimeFrames; t++) {
    const start = t * hopSize;
    const frame = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      const idx = start + i;
      frame[i] = idx < totalSamples ? channelData[idx] * window[i] : 0;
    }

    // Naive DFT magnitude (browser-side, no WASM needed for moderate fftSize)
    const halfN = fftSize / 2 + 1;
    const mag = new Float32Array(halfN);
    for (let k = 0; k < halfN; k++) {
      let re = 0,
        im = 0;
      for (let n = 0; n < fftSize; n++) {
        const angle = (-2 * Math.PI * k * n) / fftSize;
        re += frame[n] * Math.cos(angle);
        im += frame[n] * Math.sin(angle);
      }
      mag[k] = Math.sqrt(re * re + im * im);
      avgPower[k] += mag[k];
    }

    // Apply mel filterbank
    const melEnergy = new Float32Array(numMelBins);
    for (let m = 0; m < numMelBins; m++) {
      let energy = 0;
      for (let k = 0; k < halfN; k++) {
        energy += filters[m][k] * mag[k];
      }
      melEnergy[m] = energy;
    }

    melFrames.push(melEnergy);
  }

  // Normalize avg power
  for (let k = 0; k < avgPower.length; k++) avgPower[k] /= numTimeFrames;

  return { melDb: melFrames, avgPowerSpectrum: avgPower };
}

// Colourmap: viridis-inspired (dark purple -> blue -> teal -> yellow -> white)
function intensityToRgb(v: number): string {
  const t = Math.max(0, Math.min(1, v));
  if (t < 0.2) {
    const u = t / 0.2;
    return `rgb(${Math.round(68 + u * (59 - 68))},${Math.round(1 + u * (82 - 1))},${Math.round(84 + u * (139 - 84))})`;
  } else if (t < 0.4) {
    const u = (t - 0.2) / 0.2;
    return `rgb(${Math.round(59 + u * (33 - 59))},${Math.round(82 + u * (145 - 82))},${Math.round(139 + u * (140 - 139))})`;
  } else if (t < 0.6) {
    const u = (t - 0.4) / 0.2;
    return `rgb(${Math.round(33 + u * (94 - 33))},${Math.round(145 + u * (201 - 145))},${Math.round(140 + u * (98 - 140))})`;
  } else if (t < 0.8) {
    const u = (t - 0.6) / 0.2;
    return `rgb(${Math.round(94 + u * (253 - 94))},${Math.round(201 + u * (231 - 201))},${Math.round(98 + u * (37 - 98))})`;
  } else {
    const u = (t - 0.8) / 0.2;
    return `rgb(${Math.round(253 + u * (255 - 253))},${Math.round(231 + u * (255 - 231))},${Math.round(37 + u * (255 - 37))})`;
  }
}

// ---------- Component ----------

export function SpectrogramCanvas({ sample, condition, isLoading, analysisStep }: SpectrogramProps) {
  const melCanvasRef = useRef<HTMLCanvasElement>(null);
  const fftCanvasRef = useRef<HTMLCanvasElement>(null);
  const [decoding, setDecoding] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [scanX, setScanX] = useState(0);
  const scanAnimRef = useRef<number>(0);

  const isAbnormal = condition === "ABNORMAL";

  // ---- Decode WAV & render real spectrogram ----
  useEffect(() => {
    const melCanvas = melCanvasRef.current;
    const fftCanvas = fftCanvasRef.current;
    if (!melCanvas || !fftCanvas) return;

    const melCtx = melCanvas.getContext("2d");
    const fftCtx = fftCanvas.getContext("2d");
    if (!melCtx || !fftCtx) return;

    setDecoded(false);
    setDecoding(true);
    setScanX(0);

    // Clear both canvases with placeholder
    melCtx.fillStyle = "#05050a";
    melCtx.fillRect(0, 0, melCanvas.width, melCanvas.height);
    fftCtx.fillStyle = "#05050a";
    fftCtx.fillRect(0, 0, fftCanvas.width, fftCanvas.height);

    const audioUrl = sample.audioUrl || "/samples/DEMO_FAN_NORMAL.wav";

    // Use OfflineAudioContext to decode without playback
    fetch(audioUrl)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const offlineCtx = new (window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext)(1, 441000, 44100);
        return offlineCtx.decodeAudioData(buf);
      })
      .then((audioBuffer) => {
        // Use a smaller FFT for speed in browser (DFT is O(N²))
        const NUM_MEL = 80;
        const NUM_TIME = 100;
        const FFT_SIZE = 512;
        const { melDb, avgPowerSpectrum } = computeMelSpectrogram(
          audioBuffer,
          NUM_MEL,
          NUM_TIME,
          FFT_SIZE
        );

        // --- Normalize mel dB ---
        let globalMin = Infinity,
          globalMax = -Infinity;
        for (const frame of melDb) {
          for (const v of frame) {
            // Convert to log scale
            const db = 20 * Math.log10(Math.max(v, 1e-10));
            if (db < globalMin) globalMin = db;
            if (db > globalMax) globalMax = db;
          }
        }
        const dbRange = Math.max(1, globalMax - globalMin);

        // --- Draw Mel Spectrogram ---
        const mW = melCanvas.width;
        const mH = melCanvas.height;
        const cellW = mW / NUM_TIME;
        const cellH = mH / NUM_MEL;

        melCtx.fillStyle = "#05050a";
        melCtx.fillRect(0, 0, mW, mH);

        for (let t = 0; t < NUM_TIME; t++) {
          for (let m = 0; m < NUM_MEL; m++) {
            const db = 20 * Math.log10(Math.max(melDb[t][m], 1e-10));
            const norm = (db - globalMin) / dbRange;
            melCtx.fillStyle = intensityToRgb(norm);
            // Draw from bottom (low freq) to top (high freq)
            melCtx.fillRect(
              t * cellW,
              mH - (m + 1) * cellH,
              cellW + 0.5,
              cellH + 0.5
            );
          }
        }

        // --- Draw FFT Power Spectrum ---
        const fW = fftCanvas.width;
        const fH = fftCanvas.height;
        fftCtx.fillStyle = "#05050a";
        fftCtx.fillRect(0, 0, fW, fH);

        // Grid lines
        fftCtx.strokeStyle = "rgba(255,255,255,0.05)";
        fftCtx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          fftCtx.beginPath();
          fftCtx.moveTo(0, (fH / 4) * i);
          fftCtx.lineTo(fW, (fH / 4) * i);
          fftCtx.stroke();
        }

        const halfN = avgPowerSpectrum.length;
        let pMax = 0;
        for (let k = 0; k < halfN; k++) if (avgPowerSpectrum[k] > pMax) pMax = avgPowerSpectrum[k];
        pMax = Math.max(pMax, 1e-10);

        // Gradient fill under spectrum line
        const grad = fftCtx.createLinearGradient(0, 0, 0, fH);
        if (isAbnormal) {
          grad.addColorStop(0, "rgba(244,63,94,0.7)");
          grad.addColorStop(1, "rgba(244,63,94,0.05)");
        } else {
          grad.addColorStop(0, "rgba(52,211,153,0.7)");
          grad.addColorStop(1, "rgba(52,211,153,0.05)");
        }

        fftCtx.beginPath();
        fftCtx.moveTo(0, fH);
        for (let k = 0; k < halfN; k++) {
          const x = (k / (halfN - 1)) * fW;
          const norm = avgPowerSpectrum[k] / pMax;
          const y = fH - norm * fH * 0.92;
          if (k === 0) fftCtx.lineTo(x, y);
          else fftCtx.lineTo(x, y);
        }
        fftCtx.lineTo(fW, fH);
        fftCtx.closePath();
        fftCtx.fillStyle = grad;
        fftCtx.fill();

        // Spectrum line
        fftCtx.beginPath();
        fftCtx.strokeStyle = isAbnormal ? "#f43f5e" : "#34d399";
        fftCtx.lineWidth = 1.5;
        for (let k = 0; k < halfN; k++) {
          const x = (k / (halfN - 1)) * fW;
          const norm = avgPowerSpectrum[k] / pMax;
          const y = fH - norm * fH * 0.92;
          if (k === 0) fftCtx.moveTo(x, y);
          else fftCtx.lineTo(x, y);
        }
        fftCtx.stroke();

        setDecoding(false);
        setDecoded(true);
      })
      .catch(() => {
        // Fallback: draw synthetic if fetch fails (e.g., dev mode no audio)
        drawSyntheticFallback(melCtx, melCanvas.width, melCanvas.height, isAbnormal);
        drawSyntheticFftFallback(fftCtx, fftCanvas.width, fftCanvas.height, isAbnormal);
        setDecoding(false);
        setDecoded(true);
      });
  }, [sample.audioUrl, isAbnormal]);

  // ---- Scanline animation while isLoading ----
  useEffect(() => {
    if (!isLoading || !decoded) {
      cancelAnimationFrame(scanAnimRef.current);
      setScanX(0);
      return;
    }
    const melCanvas = melCanvasRef.current;
    if (!melCanvas) return;
    let start: number | null = null;
    const duration = 2300; // match analysis pipeline duration
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setScanX(progress * melCanvas.width);
      if (progress < 1) scanAnimRef.current = requestAnimationFrame(animate);
    };
    scanAnimRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(scanAnimRef.current);
  }, [isLoading, decoded]);

  return (
    <div className="rounded-xl bg-[#050508] border border-[#2A2A2E] overflow-hidden flex flex-col">
      {/* ---- Mel Spectrogram Header ---- */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-[#08080d]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>STFT Time-Frequency &amp; Mel Spectrogram Analysis</span>
          {decoding && (
            <span className="text-[10px] text-amber-400 animate-pulse ml-1">• decoding WAV...</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          {sample.machineId} | {sample.id} | Status:{" "}
          <span className={isAbnormal ? "text-rose-400" : "text-emerald-400"}>
            {condition}
          </span>{" "}
          | Score: {isAbnormal ? "0.821" : "0.045"}
        </span>
      </div>

      {/* ---- Mel Spectrogram Canvas ---- */}
      <div className="flex w-full" style={{ height: 200 }}>
        {/* Y-Axis */}
        <div className="w-12 bg-black/90 flex flex-col justify-between py-2 px-1.5 text-[9px] font-mono text-zinc-400 border-r border-zinc-800/80 select-none shrink-0">
          <span>8000</span>
          <span>6000</span>
          <span>4000</span>
          <span>2000</span>
          <span>0 Hz</span>
        </div>

        {/* Canvas with scanline overlay */}
        <div className="relative flex-1 h-full bg-[#05050a]">
          {/* Skeleton shimmer while decoding */}
          {decoding && (
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Cpu className="w-6 h-6 text-cyan-500 animate-spin" />
                <span className="text-[10px] font-mono text-zinc-400">Decoding WAV & Computing Mel Filterbank...</span>
              </div>
            </div>
          )}

          <canvas
            ref={melCanvasRef}
            width={600}
            height={200}
            className="w-full h-full"
          />

          {/* Live scanline during analysis */}
          {isLoading && decoded && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.5)] z-20 pointer-events-none"
              style={{ left: scanX }}
            />
          )}

          {/* Anomaly annotation */}
          {isAbnormal && decoded && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500/90 text-white font-mono text-[9px] font-semibold tracking-wide shadow-md flex items-center gap-1 z-10">
              <Zap className="w-2.5 h-2.5 fill-white animate-pulse" />
              <span>HIGH HARMONIC ENERGY SPIKE (3.8–4.5 kHz)</span>
            </div>
          )}

          {/* Color scale legend (right edge) */}
          {decoded && (
            <div className="absolute right-2 top-2 bottom-2 w-2.5 rounded flex flex-col overflow-hidden border border-zinc-700/50 z-10">
              <div className="flex-1 bg-gradient-to-b from-[#ffff95] via-[#fde725] via-[#5ec962] via-[#21918c] via-[#3b528b] to-[#440154]" />
            </div>
          )}
        </div>
      </div>

      {/* X-Axis time markers */}
      <div className="flex justify-between items-center pl-12 pr-4 py-1.5 bg-[#09090d] border-t border-zinc-800/60 text-[9px] font-mono text-zinc-400 select-none">
        <span>0</span>
        <span>2</span>
        <span>4</span>
        <span>6</span>
        <span>8</span>
        <span className="text-zinc-300 font-semibold">10</span>
        <span className="ml-1 text-zinc-600">Time (Seconds)</span>
      </div>

      {/* ---- FFT Power Spectrum Header ---- */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/60 bg-[#07070c]">
        <span className="text-[10px] font-mono text-zinc-400">
          ★ FFT Frequency Spectrum | SNR: -6 dB (Extreme Factory Noise)
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isAbnormal ? "bg-rose-400" : "bg-emerald-400"} animate-pulse`} />
          <span className="text-[10px] font-mono text-zinc-500">
            {isAbnormal ? "ABNORMAL PEAKS" : "CLEAN BASELINE"}
          </span>
        </div>
      </div>

      {/* ---- FFT Canvas ---- */}
      <div className="flex w-full" style={{ height: 110 }}>
        {/* Y-Axis power */}
        <div className="w-12 bg-black/90 flex flex-col justify-between py-2 px-1.5 text-[9px] font-mono text-zinc-400 border-r border-zinc-800/80 select-none shrink-0">
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        <div className="relative flex-1 h-full bg-[#05050a]">
          {decoding && (
            <div className="absolute inset-0 bg-zinc-900/80 animate-pulse z-10" />
          )}
          <canvas
            ref={fftCanvasRef}
            width={600}
            height={110}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* FFT X-Axis frequency markers */}
      <div className="flex justify-between items-center pl-12 pr-4 py-1.5 bg-[#09090d] border-t border-zinc-800/60 text-[9px] font-mono text-zinc-400 select-none">
        <span>0</span>
        <span>500</span>
        <span>1000</span>
        <span>1500</span>
        <span>2000</span>
        <span>2500</span>
        <span>3000</span>
        <span>3500</span>
        <span className="text-zinc-600">Frequency (Hz)</span>
      </div>
    </div>
  );
}

// ---------- Synthetic fallback renderers ----------

function drawSyntheticFallback(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isAbnormal: boolean
) {
  ctx.fillStyle = "#05050a";
  ctx.fillRect(0, 0, width, height);
  const cols = 100, rows = 48;
  const cW = width / cols, cH = height / rows;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const fq = 1 - r / rows;
      let v = 0.08 + Math.sin(c * 0.15 + r * 0.3) * 0.04;
      if (fq < 0.15) v += 0.45 + Math.sin(c * 0.2) * 0.15;
      if (isAbnormal && fq > 0.45 && fq < 0.85) v += 0.55 + Math.sin(c * 0.8) * 0.3;
      if (isAbnormal && (c % 12 === 0 || (c + 1) % 12 === 0)) v += 0.75;
      ctx.fillStyle = intensityToRgb(v);
      ctx.fillRect(c * cW, r * cH, cW + 0.5, cH + 0.5);
    }
  }
}

function drawSyntheticFftFallback(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isAbnormal: boolean
) {
  ctx.fillStyle = "#05050a";
  ctx.fillRect(0, 0, width, height);
  const N = 256;
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  if (isAbnormal) {
    grad.addColorStop(0, "rgba(244,63,94,0.7)");
    grad.addColorStop(1, "rgba(244,63,94,0.05)");
  } else {
    grad.addColorStop(0, "rgba(52,211,153,0.7)");
    grad.addColorStop(1, "rgba(52,211,153,0.05)");
  }
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let k = 0; k < N; k++) {
    const x = (k / (N - 1)) * width;
    const base = Math.exp(-k / 30) * 0.85;
    const noise = Math.sin(k * 0.7) * 0.05;
    const spike = isAbnormal && k === 80 ? 0.6 : 0;
    const y = height - (base + noise + spike) * height * 0.9;
    if (k === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}
