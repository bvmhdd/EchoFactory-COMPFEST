"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Radio, Sparkles } from "lucide-react";
import { PresetSample } from "@/lib/audio-presets";

interface AudioPlayerWidgetProps {
  sample: PresetSample;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function AudioPlayerWidget({ sample, onTimeUpdate }: AudioPlayerWidgetProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // MIMII audio clips are 10 seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioUrl = sample.audioUrl || "/samples/DEMO_FAN_NORMAL.wav";

  // Reset audio state when sample changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoaded(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      } else {
        setDuration(10.0); // Fallback to standard 10s MIMII clip duration
      }
      setIsLoaded(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      setCurrentTime(cur);
      if (onTimeUpdate) {
        onTimeUpdate(cur, duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isAbnormal = sample.condition === "ABNORMAL";
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-4 rounded-xl bg-[#08080C] border border-[#1F1F23] space-y-3 shadow-2xl">
      {/* Hidden Native Audio Element with Preload & Events */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-zinc-200">
            Audio Stream Ingestion (WAV/10s)
          </span>
          <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">
            — {sample.machineId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            16 kHz PCM • 0 dB SNR
          </span>
          <a
            href={audioUrl}
            download
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Download 10s WAV Audio"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Animated Waveform Bar Representation */}
      <div className="relative h-12 bg-black/90 rounded-lg p-2 border border-zinc-800 flex items-center justify-between gap-1 overflow-hidden">
        {Array.from({ length: 42 }).map((_, idx) => {
          const barProgress = (idx / 42) * 100;
          const isPassed = barProgress <= progressPercent;
          const heightSeed = Math.sin(idx * 0.45 + (isAbnormal ? 1.2 : 0.2));
          const heightPct = isAbnormal
            ? idx % 4 === 0 ? 95 : 25 + Math.abs(heightSeed) * 55
            : 20 + Math.abs(heightSeed) * 45;

          return (
            <div
              key={idx}
              className={`flex-1 rounded-sm transition-all duration-150 ${
                isPassed
                  ? isAbnormal
                    ? "bg-rose-400 shadow-[0_0_8px_#f43f5e]"
                    : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                  : "bg-zinc-800/80"
              }`}
              style={{
                height: `${heightPct}%`,
                opacity: isPlaying && isPassed ? 1 : 0.65,
              }}
            />
          );
        })}

        {/* Live Playhead Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_#ffffff] transition-all duration-100 pointer-events-none"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Seek Progress Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 10}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
        />

        {/* Time Counters: Current Time / Total 10-second Duration */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">{formatTime(currentTime)}</span>
            <span className="text-zinc-600">/</span>
            <span>{formatTime(duration || 10)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-zinc-400">10s MIMII Industrial Clip</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              isPlaying
                ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "bg-[#18181B] hover:bg-[#27272A] border border-zinc-700 text-zinc-200 hover:text-white"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause Stream" : "Play 10s Audio"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Restart Audio (0:00)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-zinc-700 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{isMuted ? "Muted" : "Audio On"}</span>
        </button>
      </div>
    </div>
  );
}
