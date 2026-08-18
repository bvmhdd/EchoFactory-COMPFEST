"use client";

import { useState } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import { DetectionResult, runInferenceSimulation } from "@/lib/inference-engine";
import { ConsoleHeader } from "@/components/dashboard/console-header";
import { InputPanel } from "@/components/dashboard/input-panel";
import { OperatorWidget } from "@/components/dashboard/operator-widget";
import { SupervisorWidget } from "@/components/dashboard/supervisor-widget";
import { ManagerWidget } from "@/components/dashboard/manager-widget";
import { AuditorWidget } from "@/components/dashboard/auditor-widget";

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState<MachineType>("fan");
  const [selectedPreset, setSelectedPreset] = useState<PresetSample>(
    PRESET_SAMPLES.find((p) => p.id === "fan-abnormal-01") || PRESET_SAMPLES[1]
  );
  const [detectionResult, setDetectionResult] = useState<DetectionResult>(() =>
    runInferenceSimulation("fan", "FAN-LINE-01", "fan-abnormal-01")
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleRunDiagnosis = async (preset: PresetSample) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/detect-acoustic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machine_type: preset.machineType,
          machine_id: preset.machineId,
          preset_id: preset.id,
          force_abnormal: preset.condition === "ABNORMAL",
        }),
      });

      if (res.ok) {
        const data: DetectionResult = await res.json();
        setTimeout(() => {
          setDetectionResult(data);
          setIsLoading(false);
        }, 100);
      } else {
        const fallback = runInferenceSimulation(preset.machineType, preset.machineId, preset.id);
        setDetectionResult(fallback);
        setIsLoading(false);
      }
    } catch {
      const fallback = runInferenceSimulation(preset.machineType, preset.machineId, preset.id);
      setDetectionResult(fallback);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Console Top Header */}
      <ConsoleHeader
        inferenceLatency={detectionResult?.inference_time_ms}
        status={isLoading ? "running" : "complete"}
      />

      {/* Main Split Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Input Configuration */}
          <div className="lg:col-span-4 h-full">
            <InputPanel
              selectedMachine={selectedMachine}
              onSelectMachine={(m) => {
                setSelectedMachine(m);
                const firstPreset = PRESET_SAMPLES.find((p) => p.machineType === m);
                if (firstPreset) setSelectedPreset(firstPreset);
              }}
              selectedPreset={selectedPreset}
              onSelectPreset={(p) => {
                setSelectedPreset(p);
                handleRunDiagnosis(p);
              }}
              onRunDiagnosis={handleRunDiagnosis}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel: Output Widgets */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            {/* Top Widget: Operator Acoustic & Spectrogram */}
            <OperatorWidget result={detectionResult} sample={selectedPreset} />

            {/* Bottom 3 Stakeholder Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SupervisorWidget result={detectionResult} />
              <ManagerWidget result={detectionResult} />
              <AuditorWidget result={detectionResult} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-[#27272A] bg-[#09090B] px-6 py-3 text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>STgram-MFN v3 Edge</span>
          <span className="text-zinc-700">•</span>
          <span>ISO 10816 Standard</span>
          <span className="text-zinc-700">•</span>
          <span>Polygon Amoy Testnet</span>
        </div>
        <div className="text-[11px] text-zinc-500">
          EchoFactory Industrial Intelligence
        </div>
      </footer>
    </div>
  );
}
