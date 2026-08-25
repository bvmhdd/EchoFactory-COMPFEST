"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import {
  Mic,
  MicOff,
  UploadCloud,
  Zap,
  Radio,
  CheckCircle2,
  AlertCircle,
  Wind,
  Droplet,
  SlidersHorizontal,
  Activity,
  Sliders,
  Play,
  Square,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InputPanelProps {
  selectedMachine: MachineType;
  onSelectMachine: (m: MachineType) => void;
  selectedPreset: PresetSample;
  onSelectPreset: (preset: PresetSample) => void;
  onRunDiagnosis: (preset: PresetSample, isCustomAudio?: boolean) => void;
  isLoading: boolean;
  useLiveBackend?: boolean;
}

export function InputPanel({
  selectedMachine,
  onSelectMachine,
  selectedPreset,
  onSelectPreset,
  onRunDiagnosis,
  isLoading,
  useLiveBackend = false,
}: InputPanelProps) {
  const [ingestionTab, setIngestionTab] = useState<"preset" | "mic" | "upload">("preset");
  
  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micFrequencyBars, setMicFrequencyBars] = useState<number[]>(new Array(16).fill(10));
  const [micVolumeLevel, setMicVolumeLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
  
  // Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // Preset playback & live waveform state
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
  const [presetFrequencyBars, setPresetFrequencyBars] = useState<number[]>(new Array(8).fill(15));
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const presetAudioStopRef = useRef<(() => void) | null>(null);
  const presetRafRef = useRef<number | null>(null);
  const micRafRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedAudioElRef = useRef<HTMLAudioElement | null>(null);

  const machines = [
    { type: "fan" as MachineType, id: "FAN-LINE-01", label: "Industrial Fan", icon: Wind },
    { type: "pump" as MachineType, id: "PUMP-STATION-02", label: "Centrifugal Pump", icon: Droplet },
    { type: "slider" as MachineType, id: "SLIDER-GANTRY-A", label: "Linear Slider Rail", icon: SlidersHorizontal },
    { type: "valve" as MachineType, id: "VALVE-HYDRO-08", label: "Solenoid Valve", icon: Activity },
  ];

  const presetsForCurrentMachine = PRESET_SAMPLES.filter(
    (p) => p.machineType === selectedMachine
  );

  // ── Stop all active audio sessions ──────────────────────────────────────────
  const stopPresetAudio = useCallback(() => {
    if (presetRafRef.current) {
      cancelAnimationFrame(presetRafRef.current);
      presetRafRef.current = null;
    }
    if (presetAudioStopRef.current) {
      presetAudioStopRef.current();
      presetAudioStopRef.current = null;
    }
    setPlayingPresetId(null);
    setPresetFrequencyBars(new Array(8).fill(15));
  }, []);

  const stopMicrophoneSession = useCallback(() => {
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
    if (micRafRef.current) {
      cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micAudioCtxRef.current) {
      try {
        micAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      micAudioCtxRef.current = null;
    }
    setIsRecording(false);
    setMicFrequencyBars(new Array(16).fill(10));
    setMicVolumeLevel(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPresetAudio();
      stopMicrophoneSession();
      if (recordedAudioElRef.current) {
        recordedAudioElRef.current.pause();
      }
    };
  }, [stopPresetAudio, stopMicrophoneSession]);

  const handleMachineChange = (mType: MachineType) => {
    stopPresetAudio();
    onSelectMachine(mType);
    const firstPreset = PRESET_SAMPLES.find((p) => p.machineType === mType);
    if (firstPreset) onSelectPreset(firstPreset);
  };

  // ── Real-time Audio Playback with AnalyserNode for Presets ───────────────────
  const handlePlayPreset = async (e: React.MouseEvent, preset: PresetSample) => {
    e.stopPropagation();

    // If currently playing the same preset, toggle stop
    if (playingPresetId === preset.id) {
      stopPresetAudio();
      return;
    }

    // Stop any other currently playing preset
    stopPresetAudio();
    setPlayingPresetId(preset.id);

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.68;

      let cleanupFn = () => {};

      // Try playing real decoded audio file
      let usedRealFile = false;
      if (preset.audioUrl) {
        try {
          const resp = await fetch(preset.audioUrl);
          if (resp.ok) {
            const arrayBuffer = await resp.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;

            source.connect(analyser);
            analyser.connect(ctx.destination);
            source.start(0);
            usedRealFile = true;

            cleanupFn = () => {
              try {
                source.stop();
                source.disconnect();
                analyser.disconnect();
                ctx.close();
              } catch {
                // ignore
              }
            };
          }
        } catch {
          usedRealFile = false;
        }
      }

      // Fallback: Real-time Web Audio Synthesizer routed into AnalyserNode
      if (!usedRealFile) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = preset.condition === "ABNORMAL" ? "bandpass" : "lowpass";
        noiseFilter.frequency.value = preset.condition === "ABNORMAL" ? 3500 : 450;
        noiseFilter.Q.value = preset.condition === "ABNORMAL" ? 4.0 : 1.0;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = preset.noiseLevel * 0.15;

        osc.type = preset.condition === "ABNORMAL" ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(preset.audioFrequency, ctx.currentTime);

        if (preset.condition === "ABNORMAL") {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = preset.modulationSpeed;
          lfoGain.gain.value = 40;
          lfo.connect(osc.frequency);
          lfo.start();
        }

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);

        osc.start();
        whiteNoise.start();

        cleanupFn = () => {
          try {
            osc.stop();
            whiteNoise.stop();
            gain.disconnect();
            analyser.disconnect();
            ctx.close();
          } catch {
            // ignore
          }
        };
      }

      presetAudioStopRef.current = cleanupFn;

      // Start Real-Time Frequency Animation Loop (8 frequency bins)
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const binIndices = [1, 3, 6, 11, 18, 28, 40, 54];

      const renderPresetWaveform = () => {
        analyser.getByteFrequencyData(dataArray);

        const bars = binIndices.map((bin) => {
          const val = dataArray[bin] || 0;
          // Scale 0..255 to percentage 15..100
          return Math.max(15, Math.min(100, Math.round((val / 255) * 85 + 15)));
        });

        setPresetFrequencyBars(bars);
        presetRafRef.current = requestAnimationFrame(renderPresetWaveform);
      };

      presetRafRef.current = requestAnimationFrame(renderPresetWaveform);

      // Auto-stop after 10s
      setTimeout(() => {
        if (playingPresetId === preset.id) {
          stopPresetAudio();
        }
      }, 10000);
    } catch {
      stopPresetAudio();
    }
  };

  // ── Real-time Microphone Recording with Live Voice & Frequency Reaction ─────
  const startRecording = async () => {
    setMicError(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecordedAudio(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      micStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      micAudioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);

      // MediaRecorder for capturing the 10s audio
      const chunks: Blob[] = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/wav" });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      recorder.start(200);
      mediaRecorderRef.current = recorder;

      setIsRecording(true);
      setRecordingSeconds(0);

      // 10s Timer
      const interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 9) {
            clearInterval(interval);
            stopMicrophoneSession();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
      recordIntervalRef.current = interval;

      // Real-Time Frequency Animation Loop (16 frequency bands across speech/audio spectrum)
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const binIndices = [2, 4, 7, 10, 14, 19, 25, 32, 40, 50, 62, 75, 89, 103, 116, 126];

      const renderMicVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        const bars = binIndices.map((bin) => {
          const val = dataArray[bin] || 0;
          sum += val;
          // Scale 0..255 to percentage 8..100
          return Math.max(8, Math.min(100, Math.round((val / 255) * 92 + 8)));
        });

        const avg = sum / binIndices.length;
        setMicVolumeLevel(Math.min(100, Math.round((avg / 255) * 100)));
        setMicFrequencyBars(bars);

        micRafRef.current = requestAnimationFrame(renderMicVisualizer);
      };

      micRafRef.current = requestAnimationFrame(renderMicVisualizer);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Tidak dapat mengakses mikrofon";
      setMicError("Izin mikrofon diperlukan. Pastikan browser mengizinkan akses mikrofon (" + errorMsg + ")");
      setIsRecording(false);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopMicrophoneSession();
    } else {
      startRecording();
    }
  };

  const handleTogglePlayRecordedAudio = () => {
    if (!recordedAudioUrl) return;

    if (!recordedAudioElRef.current) {
      const audio = new Audio(recordedAudioUrl);
      audio.onended = () => setIsPlayingRecordedAudio(false);
      recordedAudioElRef.current = audio;
    }

    if (isPlayingRecordedAudio) {
      recordedAudioElRef.current.pause();
      setIsPlayingRecordedAudio(false);
    } else {
      recordedAudioElRef.current.src = recordedAudioUrl;
      recordedAudioElRef.current.play().then(() => {
        setIsPlayingRecordedAudio(true);
      }).catch(() => {});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-[#050508] border border-[#1F1F23] rounded-2xl flex flex-col justify-between space-y-5 min-h-full shadow-2xl">
      <div className="space-y-4.5 flex-1">
        {/* Panel Header */}
        <div className="border-b border-[#1F1F23] pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold tracking-wide text-white">
              Konfigurasi Input
            </span>
          </div>
          <Badge variant="mono" className="text-[10px] font-mono border-zinc-800 bg-black text-zinc-400">
            16 kHz PCM
          </Badge>
        </div>

        {/* 1. Pilih Unit Mesin */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Mesin Target
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {machines.map((m) => {
              const IconComp = m.icon;
              const isSelected = selectedMachine === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => handleMachineChange(m.type)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#18181B] border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-white/20"
                      : "bg-[#0d0d10] border-[#1F1F23] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-white/10 text-white" : "bg-zinc-900 text-zinc-500"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">{m.label}</div>
                      <div className="text-[10px] font-mono text-zinc-500">{m.id}</div>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "border-white bg-white" : "border-zinc-700 bg-transparent"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Input Sampel Suara */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2.5">
            Sumber Audio
          </label>

          {/* Ingestion Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black rounded-xl border border-[#1F1F23] mb-3">
            <button
              onClick={() => {
                stopPresetAudio();
                stopMicrophoneSession();
                setIngestionTab("preset");
              }}
              className={`py-1.5 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "preset"
                  ? "bg-[#1a1a1e] text-white font-medium shadow border border-white/10"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Sampel Preset</span>
            </button>
            <button
              onClick={() => {
                stopPresetAudio();
                setIngestionTab("mic");
              }}
              className={`py-1.5 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "mic"
                  ? "bg-[#1a1a1e] text-white font-medium shadow border border-white/10"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Mikrofon</span>
            </button>
            <button
              onClick={() => {
                stopPresetAudio();
                stopMicrophoneSession();
                setIngestionTab("upload");
              }}
              className={`py-1.5 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "upload"
                  ? "bg-[#1a1a1e] text-white font-medium shadow border border-white/10"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Unggah File</span>
            </button>
          </div>

          {/* Mode A: Quick Presets */}
          {ingestionTab === "preset" && (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 font-sans scrollbar-thin">
              {presetsForCurrentMachine.map((preset) => {
                const isAbnormal = preset.condition === "ABNORMAL";
                const isSelected = selectedPreset.id === preset.id;
                const isPlaying = playingPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectPreset(preset)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectPreset(preset);
                      }
                    }}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer select-none ${
                      isSelected
                        ? isAbnormal
                          ? "bg-rose-500/8 border-rose-500/40 text-white animate-glow-abnormal"
                          : "bg-white/5 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                        : "bg-[#0a0a0d] border-[#1F1F23] text-zinc-300 hover:border-zinc-600 hover:bg-[#111113]"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={isAbnormal ? "danger" : "success"} className="text-[10px] font-medium shrink-0">
                          {isAbnormal ? (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Abnormal
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Normal
                            </span>
                          )}
                        </Badge>
                        <span className="text-xs font-semibold text-white truncate">
                          {preset.machineId}: {preset.name.split("(")[1]?.replace(")", "") || preset.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-mono">
                        {preset.description}
                      </span>
                    </div>

                    {/* Real-time Frequency Waveform Visualizer & Play Button */}
                    <div className="flex items-center gap-2.5 ml-3 shrink-0">
                      {isPlaying && (
                        <div className="flex items-end gap-[2px] h-6 px-1.5 py-0.5 rounded-lg bg-black/40 border border-white/10">
                          {presetFrequencyBars.map((height, i) => (
                            <div
                              key={i}
                              className={`w-[2.5px] rounded-full transition-all duration-75 ${
                                isAbnormal
                                  ? "bg-gradient-to-t from-rose-500 to-amber-400"
                                  : "bg-gradient-to-t from-cyan-500 to-emerald-400"
                              }`}
                              style={{
                                height: `${height}%`,
                                minHeight: "15%",
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handlePlayPreset(e, preset)}
                        aria-label={isPlaying ? "Hentikan audio" : "Putar audio sampel"}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isPlaying
                            ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                            : "bg-white/8 hover:bg-white/18 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {isPlaying
                          ? <Square className="w-3 h-3 fill-black" />
                          : <Play className="w-3 h-3 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode B: Mic Recording with Live Voice & Noise Reaction */}
          {ingestionTab === "mic" && (
            <div className="p-4 rounded-xl bg-[#09090d] border border-[#27272A] text-center space-y-3.5">
              {/* Mic Icon Status */}
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-rose-500/20 border-2 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105"
                    : "bg-black border border-zinc-700 text-zinc-400"
                }`}
              >
                {isRecording ? (
                  <Mic className="w-6 h-6 animate-pulse" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </div>

              {/* Status Text & Dynamic Sensitivity Meter */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">
                  {isRecording
                    ? `Merekam Suara: ${recordingSeconds} / 10s`
                    : recordedAudioUrl
                    ? "Rekaman 10 Detik Berhasil Ditangkap"
                    : "Siap Merekam Suara Mesin / Suara Langsung"}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {isRecording
                    ? micVolumeLevel > 3
                      ? `Sinyal Terdeteksi · Sensitivitas Suara: ${micVolumeLevel}%`
                      : "Bicara atau ketuk benda untuk menguji respons gelombang suara"
                    : recordedAudioUrl
                    ? "Audio siap diproses oleh model STgram-MFN v3"
                    : "Arahkan mikrofon ke mesin selama 10 detik"}
                </p>
              </div>

              {/* Error Message if Mic Access Fails */}
              {micError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] text-left">
                  {micError}
                </div>
              )}

              {/* Real-time 16-Band Responsive Soundwave Spectrum */}
              {isRecording && (
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 shadow-inner">
                  <div className="flex items-end justify-center gap-1 h-12 px-2">
                    {micFrequencyBars.map((height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          micVolumeLevel > 50
                            ? "bg-gradient-to-t from-cyan-400 via-emerald-400 to-rose-500"
                            : micVolumeLevel > 20
                            ? "bg-gradient-to-t from-cyan-500 to-emerald-400"
                            : "bg-gradient-to-t from-zinc-600 to-cyan-500"
                        }`}
                        style={{
                          height: `${height}%`,
                          minHeight: "8%",
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-2 px-1">
                    <span>80 Hz (Bass/Rumble)</span>
                    <span className="text-cyan-400 font-semibold">Real-Time FFT</span>
                    <span>6.0 kHz (Treble)</span>
                  </div>
                </div>
              )}

              {/* Recorded Audio Preview Bar */}
              {recordedAudioUrl && !isRecording && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] font-medium text-emerald-300">Hasil Rekaman Suara</div>
                      <div className="text-[9px] font-mono text-zinc-400">16 kHz PCM · 10.0 Detik</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleTogglePlayRecordedAudio}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-all flex items-center gap-1 border border-emerald-500/30"
                    >
                      {isPlayingRecordedAudio ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingRecordedAudio ? "Stop" : "Dengarkan"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={startRecording}
                      title="Rekam Ulang"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mic Action Button */}
              <Button
                type="button"
                variant={isRecording ? "danger" : recordedAudioUrl ? "outline" : "outline"}
                size="sm"
                onClick={handleToggleRecord}
                className="w-full justify-center text-xs gap-1.5 py-2 font-medium"
              >
                {isRecording ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Hentikan Rekaman</span>
                  </>
                ) : recordedAudioUrl ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rekam Ulang Audio</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mulai Rekam (10s)</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Mode C: File Upload */}
          {ingestionTab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-xl bg-[#111113] border border-dashed border-zinc-700 hover:border-zinc-500 cursor-pointer text-center space-y-2 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto" />
              <div className="text-xs text-white font-medium">
                {uploadedFileName ? uploadedFileName : "Pilih file audio (.WAV)"}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Format standar: 16 kHz Mono PCM
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Button */}
      <div className="pt-4 border-t border-[#1F1F23] space-y-2">
        {/* Live mode indicator */}
        <div className="text-[10px] font-mono text-zinc-600 text-center tracking-wider">
          {useLiveBackend ? "→ HF SPACE BACKEND" : "→ LOCAL ENGINE (ONNX)"}
        </div>
        <Button
          type="button"
          onClick={() => onRunDiagnosis(selectedPreset)}
          disabled={isLoading}
          variant="secondary"
          size="lg"
          className="w-full justify-center text-xs font-semibold tracking-wide gap-2 py-3.5 shadow-md hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Memproses Inferensi...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-black fill-black" />
              Jalankan Analisis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
