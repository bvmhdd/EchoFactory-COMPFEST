"use client";

import { useState, useRef, useEffect } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample, playSyntheticIndustrialSound } from "@/lib/audio-presets";
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioStopRef = useRef<(() => void) | null>(null);

  const machines = [
    { type: "fan" as MachineType, id: "FAN-LINE-01", label: "Industrial Fan", icon: Wind },
    { type: "pump" as MachineType, id: "PUMP-STATION-02", label: "Centrifugal Pump", icon: Droplet },
    { type: "slider" as MachineType, id: "SLIDER-GANTRY-A", label: "Linear Slider Rail", icon: SlidersHorizontal },
    { type: "valve" as MachineType, id: "VALVE-HYDRO-08", label: "Solenoid Valve", icon: Activity },
  ];

  const presetsForCurrentMachine = PRESET_SAMPLES.filter(
    (p) => p.machineType === selectedMachine
  );

  const handleMachineChange = (mType: MachineType) => {
    // Stop any playing audio when switching machine
    if (audioStopRef.current) { audioStopRef.current(); audioStopRef.current = null; }
    setPlayingPresetId(null);
    onSelectMachine(mType);
    const firstPreset = PRESET_SAMPLES.find((p) => p.machineType === mType);
    if (firstPreset) onSelectPreset(firstPreset);
  };

  const handlePlayPreset = (e: React.MouseEvent, preset: PresetSample) => {
    e.stopPropagation();
    // Stop currently playing audio
    if (audioStopRef.current) { audioStopRef.current(); audioStopRef.current = null; }
    if (playingPresetId === preset.id) {
      // Toggle off
      setPlayingPresetId(null);
      return;
    }
    setPlayingPresetId(preset.id);
    const { stop } = playSyntheticIndustrialSound(preset);
    audioStopRef.current = () => {
      stop();
      setPlayingPresetId(null);
    };
    // Auto-stop after ~10s
    setTimeout(() => {
      if (audioStopRef.current) { audioStopRef.current(); audioStopRef.current = null; }
    }, 10000);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);

      const interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 9) {
            clearInterval(interval);
            setIsRecording(false);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
      recordIntervalRef.current = interval;
    }
  };

  useEffect(() => {
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  return (
    <div className="p-6 bg-[#050508] border border-[#1F1F23] rounded-2xl flex flex-col justify-between space-y-6 h-full shadow-2xl">
      <div className="space-y-6">
        {/* Panel Header */}
        <div className="border-b border-[#1F1F23] pb-3 flex items-center justify-between">
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
          <label className="block text-xs font-medium text-zinc-400 mb-2.5">
            Mesin Target
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {machines.map((m) => {
              const IconComp = m.icon;
              const isSelected = selectedMachine === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => handleMachineChange(m.type)}
                   className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
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
              onClick={() => setIngestionTab("preset")}
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
              onClick={() => setIngestionTab("mic")}
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
              onClick={() => setIngestionTab("upload")}
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
            <div className="space-y-2">
              {presetsForCurrentMachine.map((preset) => {
                const isAbnormal = preset.condition === "ABNORMAL";
                const isSelected = selectedPreset.id === preset.id;
                const isPlaying = playingPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
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
                        <span className="text-xs font-medium text-white truncate">
                          {preset.name.split("(")[1]?.replace(")", "") || preset.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5 font-mono">
                        {preset.description}
                      </span>
                    </div>

                    {/* Play button + Waveform */}
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      {isPlaying && (
                        <div className="flex items-end gap-[2px] h-5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-[2px] bg-white rounded-full animate-waveform-bar"
                              style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${0.55 + i * 0.07}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={(e) => handlePlayPreset(e, preset)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isPlaying
                            ? "bg-white text-black"
                            : "bg-white/8 hover:bg-white/18 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {isPlaying
                          ? <Square className="w-3 h-3" />
                          : <Play className="w-3 h-3" />}
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode B: Mic Recording */}
          {ingestionTab === "mic" && (
            <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-black border border-zinc-700 mx-auto flex items-center justify-center">
                {isRecording ? (
                  <Mic className="w-6 h-6 text-rose-400 animate-pulse" />
                ) : (
                  <MicOff className="w-6 h-6 text-zinc-400" />
                )}
              </div>
              <div className="text-xs text-white">
                {isRecording
                  ? `Merekam: ${recordingSeconds} / 10s`
                  : recordingSeconds === 10
                  ? "Rekaman 10 detik siap diproses"
                  : "Arahkan mikrofon ke mesin selama 10 detik"}
              </div>

              {/* Volume Meter Wave */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1 h-8">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rose-400 rounded-full animate-waveform"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant={isRecording ? "danger" : "outline"}
                size="sm"
                onClick={handleToggleRecord}
                className="w-full justify-center text-xs"
              >
                {isRecording ? "Hentikan Rekaman" : "Mulai Rekam (10s)"}
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
