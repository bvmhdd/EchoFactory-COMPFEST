"use client";

import { useState, useRef, useEffect } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import {
  Mic,
  MicOff,
  UploadCloud,
  Zap,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wind,
  Droplet,
  SlidersHorizontal,
  Activity,
  Layers,
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
}

export function InputPanel({
  selectedMachine,
  onSelectMachine,
  selectedPreset,
  onSelectPreset,
  onRunDiagnosis,
  isLoading,
}: InputPanelProps) {
  const [ingestionTab, setIngestionTab] = useState<"preset" | "mic" | "upload">("preset");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    onSelectMachine(mType);
    const firstPreset = PRESET_SAMPLES.find((p) => p.machineType === mType);
    if (firstPreset) onSelectPreset(firstPreset);
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
    <div className="p-6 bg-[#09090B] border border-[#27272A] rounded-2xl flex flex-col justify-between space-y-6 h-full shadow-2xl">
      <div className="space-y-6">
        {/* Panel Header */}
        <div className="border-b border-[#27272A] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-200">
              Acoustic Ingestion Console
            </span>
          </div>
          <Badge variant="mono" className="text-[10px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
            16 kHz PCM
          </Badge>
        </div>

        {/* 1. Pilih Unit Mesin */}
        <div>
          <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 mb-3">
            1. Select Target Unit
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
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#18181B] border-sky-500/60 text-white shadow-[0_0_20px_rgba(56,189,248,0.12)] ring-1 ring-sky-500/30"
                      : "bg-[#111113] border-[#27272A] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-sky-500/15 text-sky-400" : "bg-zinc-800/80 text-zinc-400"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{m.label}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{m.id}</div>
                    </div>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "border-sky-400 bg-sky-400" : "border-zinc-600 bg-transparent"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Input Sampel Suara (10s) */}
        <div>
          <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 mb-3">
            2. Audio Signal Source
          </label>

          {/* Ingestion Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#111113] rounded-xl border border-[#27272A] mb-4">
            <button
              onClick={() => setIngestionTab("preset")}
              className={`py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "preset"
                  ? "bg-[#27272A] text-white font-medium shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
            <button
              onClick={() => setIngestionTab("mic")}
              className={`py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "mic"
                  ? "bg-[#27272A] text-white font-medium shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Live Mic</span>
            </button>
            <button
              onClick={() => setIngestionTab("upload")}
              className={`py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                ingestionTab === "upload"
                  ? "bg-[#27272A] text-white font-medium shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

          {/* Mode A: Quick Presets */}
          {ingestionTab === "preset" && (
            <div className="space-y-2.5">
              <span className="text-[11px] text-zinc-400 block font-mono">
                Acoustic baseline for {selectedMachine.toUpperCase()}:
              </span>
              <div className="space-y-2">
                {presetsForCurrentMachine.map((preset) => {
                  const isAbnormal = preset.condition === "ABNORMAL";
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset(preset)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? isAbnormal
                            ? "bg-rose-500/10 border-rose-500/60 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/30"
                            : "bg-emerald-500/10 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                          : "bg-[#111113] border-[#27272A] text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant={isAbnormal ? "danger" : "success"} className="text-[10px] uppercase font-mono">
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
                            {preset.name.split("(")[1]?.replace(")", "") || preset.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {preset.description}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>
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
              <div className="text-xs font-mono text-white">
                {isRecording
                  ? `Capturing Machine Sound: ${recordingSeconds} / 10s`
                  : recordingSeconds === 10
                  ? "10s Acoustic Buffer Ready (16kHz PCM)"
                  : "Point sensor/microphone at casing for 10 seconds"}
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
                className="w-full justify-center text-xs font-mono"
              >
                {isRecording ? "Stop Recording" : "Start Live Mic Acquisition (10s)"}
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
                {uploadedFileName ? uploadedFileName : "Click to select WAV/MP3 file"}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                Standard: 16,000 Hz, 16-bit Mono PCM (.wav)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Button */}
      <div className="pt-4 border-t border-[#27272A]">
        <Button
          type="button"
          onClick={() => onRunDiagnosis(selectedPreset)}
          disabled={isLoading}
          variant="secondary"
          size="lg"
          className="w-full justify-center text-xs font-mono font-semibold tracking-wider gap-2 py-4 shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              PROCESSING STGRAM-MFN V3...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-black fill-black" />
              EXECUTE AI DIAGNOSIS (&lt;50ms)
            </>
          )}
        </Button>
        <span className="text-[10px] text-zinc-400 text-center block mt-2 font-mono">
          Dual-Branch STgram-MFN v3 ONNX Edge • Latency: &lt; 50 ms
        </span>
      </div>
    </div>
  );
}
