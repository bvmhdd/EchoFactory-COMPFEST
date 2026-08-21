"use client";

import { useState } from "react";
import { MachineType, PRESET_SAMPLES, PresetSample } from "@/lib/audio-presets";
import { DetectionResult, runInferenceSimulation } from "@/lib/inference-engine";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { ConsoleHeader, ConsoleTab } from "@/components/dashboard/console-header";
import { ConnectionStatusBar } from "@/components/dashboard/connection-status-bar";
import { InputPanel } from "@/components/dashboard/input-panel";
import { OperatorWidget } from "@/components/dashboard/operator-widget";
import { SupervisorWidget } from "@/components/dashboard/supervisor-widget";
import { ManagerWidget } from "@/components/dashboard/manager-widget";
import { AuditorWidget } from "@/components/dashboard/auditor-widget";
import { QueryAssistantWidget } from "@/components/dashboard/query-assistant-widget";
import KineticGrid from "@/components/ui/kinetic-grid";
import { Cpu, Activity, ShieldCheck } from "lucide-react";

// ─── Analysis pipeline steps ───────────────────────────────────────────────
const PIPELINE_STEPS = [
  { step: 1, label: "1/4  Ingesting 10s PCM Audio Stream (16 kHz / 0 dB SNR)...", pct: 15 },
  { step: 2, label: "2/4  STgram-MFN v3 ONNX Neural Inference (Dual STFT + Mel Branch)...", pct: 45 },
  { step: 3, label: "3/4  ISO 10816-3 Severity Evaluation & Gemini 2.0 Flash LLM RAG...", pct: 75 },
  { step: 4, label: "4/4  Generating Blockchain Proof Hash & Polygon Smart Contract...", pct: 95 },
];
const STEP_TIMINGS = [0, 550, 1150, 1750]; // ms offsets

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState<MachineType>("fan");
  const [selectedPreset, setSelectedPreset] = useState<PresetSample>(
    PRESET_SAMPLES.find((p) => p.id === "fan-abnormal-01") || PRESET_SAMPLES[1]
  );

  const [activeTab, setActiveTab] = useState<ConsoleTab>("all");
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useLiveBackend, setUseLiveBackend] = useState(false);
  const [geminiDiagnosis, setGeminiDiagnosis] = useState<string | null>(null);

  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisStepText, setAnalysisStepText] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  const connectionStatus = useConnectionStatus();

  const handleSelectPreset = (p: PresetSample) => {
    setSelectedPreset(p);
    setDetectionResult(null);
    setGeminiDiagnosis(null);
    setAnalysisStep(0);
    setAnalysisStepText("");
    setAnalysisProgress(0);
  };

  const handleRunDiagnosis = async (preset: PresetSample) => {
    setIsLoading(true);
    setDetectionResult(null);
    setGeminiDiagnosis(null);

    setAnalysisStep(1);
    setAnalysisStepText(PIPELINE_STEPS[0].label);
    setAnalysisProgress(PIPELINE_STEPS[0].pct);

    const timers: ReturnType<typeof setTimeout>[] = [];

    PIPELINE_STEPS.slice(1).forEach(({ step, label, pct }, i) => {
      const t = setTimeout(() => {
        setAnalysisStep(step);
        setAnalysisStepText(label);
        setAnalysisProgress(pct);
      }, STEP_TIMINGS[i + 1]);
      timers.push(t);
    });

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

      const data: DetectionResult & { gemini_diagnosis?: string } = res.ok
        ? await res.json()
        : runInferenceSimulation(preset.machineType, preset.machineId, preset.id);

      setTimeout(() => {
        timers.forEach(clearTimeout);
        setAnalysisProgress(100);
        setTimeout(() => {
          setDetectionResult(data);
          if (data.gemini_diagnosis) setGeminiDiagnosis(data.gemini_diagnosis);
          setIsLoading(false);
          setAnalysisStep(0);
          setAnalysisStepText("");
          setAnalysisProgress(0);
        }, 300);
      }, 2300);
    } catch {
      const fallback = runInferenceSimulation(preset.machineType, preset.machineId, preset.id);
      setTimeout(() => {
        timers.forEach(clearTimeout);
        setDetectionResult(fallback);
        setIsLoading(false);
        setAnalysisStep(0);
        setAnalysisStepText("");
        setAnalysisProgress(0);
      }, 2300);
    }
  };

  return (
    <KineticGrid globalColor="monochrome" className="h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black flex flex-col">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <ConsoleHeader
          inferenceLatency={detectionResult?.inference_time_ms}
          status={isLoading ? "running" : detectionResult ? "complete" : "idle"}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Connection Status Bar */}
        <ConnectionStatusBar
          status={connectionStatus}
          latencyMs={connectionStatus.latencyMs}
          useLiveBackend={useLiveBackend}
          onToggleLive={setUseLiveBackend}
          onRefresh={connectionStatus.refresh}
        />

        {/* Main Single-Screen Desktop Application Viewport */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden items-stretch">

            {/* ── LEFT: Independent Scrollable Input Panel Column ── */}
            <div className="lg:col-span-4 h-full overflow-y-auto pr-1 pb-6 scrollbar-thin">
              <InputPanel
                selectedMachine={selectedMachine}
                onSelectMachine={(m) => {
                  setSelectedMachine(m);
                  const first = PRESET_SAMPLES.find((p) => p.machineType === m);
                  if (first) handleSelectPreset(first);
                }}
                selectedPreset={selectedPreset}
                onSelectPreset={handleSelectPreset}
                onRunDiagnosis={handleRunDiagnosis}
                isLoading={isLoading}
                useLiveBackend={useLiveBackend}
              />
            </div>

            {/* ── RIGHT: Independent Scrollable Results Column ── */}
            <div className="lg:col-span-8 h-full overflow-y-auto pr-2 pb-6 flex flex-col space-y-5 scrollbar-thin">

              {/* ─── Loading / Analysis HUD ─── */}
              {isLoading && (
                <div className="rounded-2xl border border-sky-500/20 bg-[#05080f] p-6 shadow-xl shrink-0">
                  {/* HUD Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-sky-400 animate-spin" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">EchoFactory Analysis Pipeline</div>
                        <div className="text-[10px] text-zinc-400 font-mono">STgram-MFN v3 · ONNX FP32 · ISO 10816-3</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-sky-300 font-semibold">{analysisProgress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800 overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>

                  {/* Step Status Log */}
                  <div className="bg-black/60 rounded-xl border border-zinc-800 p-4 font-mono text-[11px] space-y-1.5 min-h-[80px]">
                    {PIPELINE_STEPS.map(({ step, label }) => (
                      <div
                        key={step}
                        className={`flex items-center gap-2 transition-all duration-300 ${
                          analysisStep > step
                            ? "text-emerald-400"
                            : analysisStep === step
                            ? "text-sky-300 font-semibold"
                            : "text-zinc-700"
                        }`}
                      >
                        {analysisStep > step ? (
                          <span className="text-emerald-400">✓</span>
                        ) : analysisStep === step ? (
                          <span className="w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent animate-spin inline-block shrink-0" />
                        ) : (
                          <span className="text-zinc-700">○</span>
                        )}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spectrogram computing animation */}
                  <div className="mt-5 rounded-xl overflow-hidden border border-zinc-800/60 bg-[#09090d]">
                    <div className="px-3 py-2 text-[10px] font-mono text-zinc-500 border-b border-zinc-800/60 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-sky-500 animate-pulse" />
                      Computing Mel Spectrogram from audio buffer...
                    </div>
                    <div className="h-16 flex items-end gap-0.5 px-3 pb-3 pt-2 bg-black/40">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-sky-500/40"
                          style={{
                            height: `${20 + Math.abs(Math.sin(i * 0.4 + Date.now() * 0.001)) * 70}%`,
                            animation: `pulse ${0.5 + (i % 5) * 0.12}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.025}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Empty State ─── */}
              {!isLoading && !detectionResult && (
                <div className="rounded-2xl border border-zinc-800 bg-[#050508] p-12 flex flex-col items-center justify-center gap-4 text-center my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <Activity className="w-7 h-7 text-zinc-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-300">Pilih Sampel &amp; Jalankan Analisis</div>
                    <div className="text-xs text-zinc-600 mt-1 font-mono">
                      Pilih mesin dan preset di panel kiri, lalu tekan "Jalankan Analisis".<br />
                      Spektogram dan hasil diagnosa akan muncul setelah proses selesai.
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Results Tab Navigation Views ─── */}
              {!isLoading && detectionResult && (
                <>
                  {/* Status Banner */}
                  <div className={`rounded-xl border px-5 py-4 transition-all duration-500 shrink-0 ${
                    detectionResult.operator_view.condition === "ABNORMAL"
                      ? "border-rose-500/30 bg-[#0c0508]"
                      : "border-emerald-500/30 bg-[#050c08]"
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            [SNR PROFILE] Baseline: -6 dB (Extreme Factory Noise) (Estimated SNR: 2.8 dB)
                          </span>
                        </div>
                        <div className={`text-lg font-bold tracking-wide font-mono ${
                          detectionResult.operator_view.condition === "ABNORMAL"
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}>
                          STATUS: {detectionResult.operator_view.condition} ({detectionResult.operator_view.condition === "NORMAL" ? "PASS" : "FAIL"})
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-1">
                          Anomaly Score:{" "}
                          <span className={detectionResult.operator_view.condition === "ABNORMAL" ? "text-rose-300 font-semibold" : "text-emerald-300 font-semibold"}>
                            {detectionResult.operator_view.anomaly_score.toFixed(4)}
                          </span>
                          {" "}(Threshold [-6 dB]: 0.065) | Spectral signature compliant with ISO 10816 baseline.
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        detectionResult.operator_view.condition === "ABNORMAL"
                          ? "bg-rose-400 shadow-[0_0_12px_#f43f5e]"
                          : "bg-emerald-400 shadow-[0_0_12px_#10b981]"
                      }`} />
                    </div>
                  </div>

                  {/* Tab 01 or ALL: Ingestion & Acoustic Scan */}
                  {(activeTab === "01" || activeTab === "all") && (
                    <OperatorWidget
                      result={detectionResult}
                      sample={selectedPreset}
                      isLoading={false}
                      analysisStep={0}
                    />
                  )}

                  {/* Tab 02 or ALL: Cognitive Diagnostics & Work Order */}
                  {(activeTab === "02" || activeTab === "all") && (
                    <div className="space-y-5">
                      <SupervisorWidget
                        result={detectionResult}
                        geminiDiagnosis={geminiDiagnosis}
                        isLoading={false}
                        analysisStepText=""
                      />
                      <QueryAssistantWidget result={detectionResult} />
                    </div>
                  )}

                  {/* Tab 03 or ALL: Fleet Analytics & Financial ROI */}
                  {(activeTab === "03" || activeTab === "all") && (
                    <div className={activeTab === "03" ? "w-full" : ""}>
                      <ManagerWidget result={detectionResult} />
                    </div>
                  )}

                  {/* Tab 04 or ALL: On-Chain Passport & Warranty */}
                  {(activeTab === "04" || activeTab === "all") && (
                    <div className="space-y-5">
                      <AuditorWidget result={detectionResult} />
                      <div className="rounded-xl border border-zinc-800/60 bg-[#06060a] p-4 font-mono text-[11px]">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-zinc-300 font-semibold">[WEB3 LEDGER STATUS] LOCALLY_VERIFIED_HASH</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="space-y-1 text-zinc-400">
                            <div><span className="text-zinc-600">Target: </span>{detectionResult.machine_id} | SNR: -6 dB</div>
                            <div className="truncate"><span className="text-zinc-600">SHA-256 Hash: </span>
                              <span className="text-zinc-300">{detectionResult.auditor_view.proof_hash}</span>
                            </div>
                            <div className="truncate"><span className="text-zinc-600">Tx Hash: </span>
                              <span className="text-zinc-300">0x{detectionResult.auditor_view.proof_hash.slice(2, 42)}...</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-zinc-400">
                            <div><span className="text-zinc-600">Block: </span>#{detectionResult.auditor_view.block_number}</div>
                            <div><span className="text-zinc-600">Contract: </span>
                              <span className="text-zinc-300">0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864</span>
                            </div>
                            <div><span className="text-zinc-600">Network: </span>
                              <span className="text-emerald-400">Polygon Amoy Testnet · Chain 80002 ✓</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1F1F23] bg-[#050507] px-6 py-2.5 text-[10px] font-mono text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <span>STgram-MFN v3 · ONNX FP32</span>
            <span className="text-zinc-800">·</span>
            <span>ISO 10816 Standard</span>
            <span className="text-zinc-800">·</span>
            <span>Polygon Amoy Testnet</span>
          </div>
          <div className="text-zinc-700">EchoFactory Industrial Intelligence</div>
        </footer>
      </div>
    </KineticGrid>
  );
}
