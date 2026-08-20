"use client";

import { useState, useEffect } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import { DetectionResult, runInferenceSimulation } from "@/lib/inference-engine";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { ConsoleHeader } from "@/components/dashboard/console-header";
import { ConnectionStatusBar } from "@/components/dashboard/connection-status-bar";
import { InputPanel } from "@/components/dashboard/input-panel";
import { OperatorWidget } from "@/components/dashboard/operator-widget";
import { SupervisorWidget } from "@/components/dashboard/supervisor-widget";
import { ManagerWidget } from "@/components/dashboard/manager-widget";
import { AuditorWidget } from "@/components/dashboard/auditor-widget";
import KineticGrid from "@/components/ui/kinetic-grid";

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState<MachineType>("fan");
  const [selectedPreset, setSelectedPreset] = useState<PresetSample>(
    PRESET_SAMPLES.find((p) => p.id === "fan-abnormal-01") || PRESET_SAMPLES[1]
  );
  const [detectionResult, setDetectionResult] = useState<DetectionResult>(() =>
    runInferenceSimulation("fan", "FAN-LINE-01", "fan-abnormal-01")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [useLiveBackend, setUseLiveBackend] = useState(false);
  const [geminiDiagnosis, setGeminiDiagnosis] = useState<string | null>(null);

  const connectionStatus = useConnectionStatus();

  // Initial diagnosis on mount
  useEffect(() => {
    handleRunDiagnosis(selectedPreset);
  }, []);

  const handleRunDiagnosis = async (preset: PresetSample) => {
    setIsLoading(true);
    setGeminiDiagnosis(null);

    try {
      const res = await fetch("/api/v1/detect-acoustic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_type: preset.machineType,
          machine_id: preset.machineId,
          preset_id: preset.id,
          force_abnormal: preset.condition === "ABNORMAL",
          use_live_hf: useLiveBackend,
        }),
      });

      if (res.ok) {
        const data: DetectionResult & { gemini_diagnosis?: string } = await res.json();
        setTimeout(() => {
          setDetectionResult(data);
          if (data.gemini_diagnosis) setGeminiDiagnosis(data.gemini_diagnosis);
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
    <KineticGrid globalColor="monochrome" className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex flex-col min-h-screen">
        {/* Console Top Header */}
        <ConsoleHeader
          inferenceLatency={detectionResult?.inference_time_ms}
          status={isLoading ? "running" : "complete"}
        />

        {/* Connection Status Bar */}
        <ConnectionStatusBar
          status={connectionStatus}
          latencyMs={connectionStatus.latencyMs}
          useLiveBackend={useLiveBackend}
          onToggleLive={setUseLiveBackend}
          onRefresh={connectionStatus.refresh}
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
                useLiveBackend={useLiveBackend}
              />
            </div>

            {/* Right Panel: Output Widgets */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              {/* Top Widget: Operator Acoustic & Spectrogram */}
              <OperatorWidget result={detectionResult} sample={selectedPreset} />

              {/* Bottom 3 Stakeholder Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SupervisorWidget result={detectionResult} geminiDiagnosis={geminiDiagnosis} />
                <ManagerWidget result={detectionResult} />
                <AuditorWidget result={detectionResult} />
              </div>
            </div>
          </div>
        </main>

        {/* Footer Bar */}
        <footer className="border-t border-[#1F1F23] bg-[#050507] px-6 py-3 text-[10px] font-mono text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span>STgram-MFN v3 · ONNX FP32</span>
            <span className="text-zinc-800">·</span>
            <span>ISO 10816 Standard</span>
            <span className="text-zinc-800">·</span>
            <span>Polygon Amoy Testnet</span>
          </div>
          <div className="text-zinc-700">
            EchoFactory Industrial Intelligence
          </div>
        </footer>
      </div>
    </KineticGrid>
  );
}

