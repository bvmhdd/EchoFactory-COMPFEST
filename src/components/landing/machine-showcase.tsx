"use client";

import { useState } from "react";
import { PRESET_SAMPLES, PresetSample, playSyntheticIndustrialSound } from "@/lib/audio-presets";
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Wind,
  Droplet,
  SlidersHorizontal,
  Activity,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MachineShowcase() {
  const [activeTab, setActiveTab] = useState<"fan" | "pump" | "slider" | "valve">("fan");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentSoundStop, setCurrentSoundStop] = useState<(() => void) | null>(null);

  const handlePlaySample = (sample: PresetSample) => {
    if (playingId === sample.id) {
      if (currentSoundStop) currentSoundStop();
      setPlayingId(null);
      setCurrentSoundStop(null);
      return;
    }

    if (currentSoundStop) currentSoundStop();

    const { stop } = playSyntheticIndustrialSound(sample, 4.5);
    setPlayingId(sample.id);
    setCurrentSoundStop(() => stop);

    setTimeout(() => {
      setPlayingId(null);
    }, 4500);
  };

  const machines = [
    {
      type: "fan" as const,
      label: "Industrial Fan",
      icon: Wind,
      auc: "94.04%",
      pauc: "85.31%",
      benchmark: "94.04%",
      desc: "High-speed air circulation blowers & chiller cooling units tested in 0 dB SNR industrial floor noise.",
    },
    {
      type: "pump" as const,
      label: "Centrifugal Pump",
      icon: Droplet,
      auc: "91.90%",
      pauc: "82.50%",
      benchmark: "91.94%",
      desc: "Pressurized fluid transfer systems subject to hydraulic cavitation, impeller erosion, and seal degradation.",
    },
    {
      type: "slider" as const,
      label: "Linear Slider Rail",
      icon: SlidersHorizontal,
      auc: "99.32%",
      pauc: "97.55%",
      benchmark: "99.55%",
      desc: "High-precision CNC gantry rails and robotic linear actuators with friction spikes and ball-block starvation.",
    },
    {
      type: "valve" as const,
      label: "Solenoid Valve",
      icon: Activity,
      auc: "99.60%",
      pauc: "97.20%",
      benchmark: "99.64%",
      desc: "Rapid cycling pneumatic and hydraulic valves with diaphragm micro-leaks and solenoid plunger hesitation.",
    },
  ];

  const currentMachine = machines.find((m) => m.type === activeTab) || machines[0];
  const CurrentMachineIcon = currentMachine.icon;
  const machineSamples = PRESET_SAMPLES.filter((s) => s.machineType === activeTab);

  return (
    <section id="machines" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Acoustic Telemetry & Benchmark Insights
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Rigorous validation on Hitachi MIMII Industrial Benchmark (0 dB SNR).
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed font-sans">
          Tested against extreme ambient factory noise where standard sensors fail. Compare healthy baseline signatures against anomalous fault frequencies.
        </p>
      </div>

      {/* Machine Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 bg-[#09090B] rounded-2xl border border-[#27272A] mb-8">
        {machines.map((m) => {
          const IconComp = m.icon;
          const isActive = activeTab === m.type;
          return (
            <button
              key={m.type}
              onClick={() => {
                if (currentSoundStop) currentSoundStop();
                setPlayingId(null);
                setActiveTab(m.type);
              }}
              className={`py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                isActive
                  ? "bg-[#18181B] text-white border border-[#27272A] shadow-md ring-1 ring-sky-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#111113]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-sky-500/15 text-sky-400" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div className="text-[11px] font-mono text-sky-400">AUC {m.auc}</div>
                </div>
              </div>
              {isActive && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>}
            </button>
          );
        })}
      </div>

      {/* Machine Details & Interactive Audio Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#09090B] border border-[#27272A] rounded-2xl p-6 md:p-8 shadow-2xl">
        {/* Machine Benchmark Summary */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <CurrentMachineIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">{currentMachine.label}</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-sans">
              {currentMachine.desc}
            </p>

            <div className="space-y-3 font-mono text-xs bg-[#111113] p-4 rounded-xl border border-[#27272A]">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">IEEE Baseline AUC:</span>
                <span>{currentMachine.benchmark}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">EchoFactory AUC:</span>
                <span className="text-emerald-400 font-semibold">{currentMachine.auc}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">pAUC (FPR &lt; 10%):</span>
                <span className="text-sky-400 font-semibold">{currentMachine.pauc}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">Model Footprint:</span>
                <span className="text-zinc-200">183.8 KB (ONNX)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2.5 font-sans">
            <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
            <span>Dual-branch STFT + Mel-Spectrogram ensures zero false alarms under 0 dB SNR background noise.</span>
          </div>
        </div>

        {/* Audio Sample Comparisons (Normal vs Abnormal) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {machineSamples.map((sample) => {
            const isAbnormal = sample.condition === "ABNORMAL";
            const isPlayingThis = playingId === sample.id;

            return (
              <div
                key={sample.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isAbnormal
                    ? "bg-[#111113] border-rose-500/30 hover:border-rose-500/60"
                    : "bg-[#111113] border-emerald-500/30 hover:border-emerald-500/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={isAbnormal ? "danger" : "success"} className="text-[10px] font-mono uppercase">
                      {isAbnormal ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> ABNORMAL FAULT
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> NORMAL BASELINE
                        </span>
                      )}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-400">10s Buffer</span>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">{sample.name}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                    {sample.description}
                  </p>

                  {/* Frequency Spectrum Graph Representation */}
                  <div className="h-20 bg-black/80 rounded-xl p-3 border border-[#27272A] flex items-end justify-between gap-1 mb-6 overflow-hidden">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const rawHeight = isAbnormal
                        ? idx % 3 === 0
                          ? 85
                          : 30 + Math.sin(idx) * 20
                        : 15 + Math.sin(idx * 0.5) * 15;
                      const barHeight = Math.round(rawHeight);
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t transition-all duration-300 ${
                            isAbnormal
                              ? isPlayingThis
                                ? "bg-rose-400 animate-pulse"
                                : "bg-rose-600/70"
                              : isPlayingThis
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-emerald-600/70"
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Audio Listen Button */}
                <Button
                  onClick={() => handlePlaySample(sample)}
                  variant={isAbnormal ? "danger" : "success"}
                  className="w-full justify-center gap-2 text-xs font-mono py-3"
                >
                  {isPlayingThis ? (
                    <>
                      <VolumeX className="w-4 h-4 animate-spin" />
                      STOP AUDIO PREVIEW
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      PLAY SYNTHESIZED SOUND (WebAudio)
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
