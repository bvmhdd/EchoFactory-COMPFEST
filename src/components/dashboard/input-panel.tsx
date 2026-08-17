"use client";

import { useState, useRef, useEffect } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import { Mic, MicOff, Upload, Zap, FileAudio, Check, AlertCircle, Play, Sparkles } from "lucide-react";
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

  const machines: { type: MachineType; id: string; label: string; icon: string }[] = [
    { type: "fan", id: "FAN-LINE-01", label: "Fan Industrial", icon: "🌀" },
    { type: "pump", id: "PUMP-STATION-02", label: "Centrifugal Pump", icon: "⛽" },
    { type: "slider", id: "SLIDER-GANTRY-A", label: "Linear Slider Rail", icon: "🎚️" },
    { type: "valve", id: "VALVE-HYDRO-08", label: "Solenoid Valve", icon: "🚰" },
  ];

  const presetsForCurrentMachine = PRESET_SAMPLES.filter(
    (p) => p.machineType === selectedMachine
  );

  const handleMachineChange = (mType: MachineType) => {
    onSelectMachine(mType);
    const firstPreset = PRESET_SAMPLES.find((p) => p.machineType === mType);
    if (firstPreset) onSelectPreset(firstPreset);
  };

  // Mic Recording Simulator with WebAudio countdown
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
    <div className="p-6 bg-[#0A0A0B] border border-[#2A2A2E] rounded-2xl flex flex-col justify-between space-y-6 h-full shadow-xl">
      <div className="space-y-6">
        {/* Panel Header */}
        <div className="border-b border-[#2A2A2E] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
              📥 PANEL INPUT TUNGGAL
            </span>
          </div>
          <Badge variant="mono" className="text-[10px] font-mono">
            SINKRON (P.15)
          </Badge>
        </div>

        {/* 1. Pilih Unit Mesin */}
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-3">
            1. Pilih Unit Mesin Pabrik:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {machines.map((m) => (
              <button
                key={m.type}
                type="button"
                onClick={() => handleMachineChange(m.type)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedMachine === m.type
                    ? "bg-[#18181B] border-white/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                    : "bg-[#111113] border-[#2A2A2E] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{m.label}</div>
                    <div className="text-[10px] font-mono text-zinc-400">{m.id}</div>
                  </div>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    selectedMachine === m.type
                      ? "border-white bg-white"
                      : "border-zinc-600 bg-transparent"
                  }`}
                >
                  {selectedMachine === m.type && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Input Sampel Suara (10s) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              2. Input Sampel Suara (10s 16kHz):
            </label>
          </div>

          {/* Ingestion Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#111113] rounded-xl border border-[#2A2A2E] mb-4">
            <button
              onClick={() => setIngestionTab("preset")}
              className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                ingestionTab === "preset"
                  ? "bg-[#27272A] text-white font-semibold shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              ⚡ Sampel Preset
            </button>
            <button
              onClick={() => setIngestionTab("mic")}
              className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                ingestionTab === "mic"
                  ? "bg-[#27272A] text-white font-semibold shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              🎙️ Rekam Mic
            </button>
            <button
              onClick={() => setIngestionTab("upload")}
              className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                ingestionTab === "upload"
                  ? "bg-[#27272A] text-white font-semibold shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              📁 Unggah File
            </button>
          </div>

          {/* Mode A: Quick Presets */}
          {ingestionTab === "preset" && (
            <div className="space-y-2.5">
              <span className="text-[11px] text-zinc-400 block font-mono">
                Pilih kondisi sampel akustik mesin {selectedMachine.toUpperCase()}:
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
                            ? "bg-rose-500/10 border-rose-500/60 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                            : "bg-emerald-500/10 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : "bg-[#111113] border-[#2A2A2E] text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant={isAbnormal ? "danger" : "success"} className="text-[10px]">
                            {isAbnormal ? "🔴 ABNORMAL" : "🟢 NORMAL"}
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
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-black border border-zinc-700 mx-auto flex items-center justify-center">
                {isRecording ? (
                  <Mic className="w-6 h-6 text-rose-400 animate-pulse" />
                ) : (
                  <MicOff className="w-6 h-6 text-zinc-400" />
                )}
              </div>
              <div className="text-xs font-mono text-white">
                {isRecording
                  ? `Merekam Suara Mesin: ${recordingSeconds} / 10s`
                  : recordingSeconds === 10
                  ? "✅ Rekaman 10s Berhasil Tersimpan (16kHz PCM)"
                  : "Arahkan mikrofon ke casing mesin 10 detik"}
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
                {isRecording ? "Hentikan Rekaman" : "Mulai Rekam Mikrofon (10s)"}
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
              <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
              <div className="text-xs text-white font-medium">
                {uploadedFileName ? uploadedFileName : "Klik untuk unggah berkas .wav"}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                Format Audio: 16,000 Hz, 16-bit Mono PCM (.wav)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Button */}
      <div className="pt-4 border-t border-[#2A2A2E]">
        <Button
          type="button"
          onClick={() => onRunDiagnosis(selectedPreset)}
          disabled={isLoading}
          variant="secondary"
          size="lg"
          className="w-full justify-center text-xs font-mono font-bold tracking-wider gap-2 py-4 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              MEMPROSES STGRAM-MFN V3...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-black fill-black" />
              ⚡ JALANKAN DIAGNOSIS AI (&lt;50ms)
            </>
          )}
        </Button>
        <span className="text-[10px] text-zinc-400 text-center block mt-2 font-mono">
          Model: STgram-MFN v3 ONNX Edge • Latensi Inferensi: &lt; 50 ms
        </span>
      </div>
    </div>
  );
}
