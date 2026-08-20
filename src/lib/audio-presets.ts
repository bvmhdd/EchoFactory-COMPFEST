// Industrial Acoustic Machine Presets & WebAudio Sound Synthesis

export type MachineType = "fan" | "pump" | "slider" | "valve";

export interface PresetSample {
  id: string;
  name: string;
  machineType: MachineType;
  machineId: string;
  condition: "NORMAL" | "ABNORMAL";
  description: string;
  audioFrequency: number; // Base Hz
  noiseLevel: number;
  modulationSpeed: number;
  expectedScore: number;
  audioUrl?: string; // Path to real MIMII WAV file in /samples/
  faultDetails?: {
    faultType: string;
    isoStandard: string;
    recommendedAction: string;
    healthScore: number;
    riskLevel: "LOW_NORMAL" | "MEDIUM_WARNING" | "HIGH_CRITICAL";
    estimatedDowntimeMitigatedUsd: number;
  };
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "fan-normal-01",
    name: "Fan Industrial (Normal Baseline)",
    machineType: "fan",
    machineId: "FAN-LINE-01",
    condition: "NORMAL",
    description: "Operasi aerodinamis mulus, tanpa getaran aksial abnormal (0 dB SNR).",
    audioFrequency: 120, // 120 Hz smooth hum
    noiseLevel: 0.15,
    modulationSpeed: 2,
    expectedScore: 0.082,
    audioUrl: "/samples/DEMO_FAN_NORMAL.wav",
    faultDetails: {
      faultType: "Smooth Aerodynamic Flow (Healthy)",
      isoStandard: "ISO 10816-3 Class I (Good / Unrestricted)",
      recommendedAction: "Pertahankan jadwal inspeksi berkala per 500 jam kerja.",
      healthScore: 98.5,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "fan-abnormal-01",
    name: "Fan Industrial (Bearing Outer Race Defect)",
    machineType: "fan",
    machineId: "FAN-LINE-01",
    condition: "ABNORMAL",
    description: "Cacat jalur cincin luar bantalan dengan ketukan frekuensi tinggi 4.2 kHz.",
    audioFrequency: 120,
    noiseLevel: 0.78,
    modulationSpeed: 14,
    expectedScore: 0.887,
    audioUrl: "/samples/DEMO_FAN_ANOMALY.wav",
    faultDetails: {
      faultType: "Bearing Outer Race Degradation (SKF-6204)",
      isoStandard: "ISO 10816-3 Class II (Unacceptable Vibration > 4.5 mm/s)",
      recommendedAction: "Lumasi bearing dengan grease ISO VG 46 atau jadwalkan pergantian part #SKF-6204 dalam 48 jam.",
      healthScore: 62.0,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 4200,
    },
  },
  {
    id: "pump-normal-01",
    name: "Centrifugal Pump (Normal Flow)",
    machineType: "pump",
    machineId: "PUMP-STATION-02",
    condition: "NORMAL",
    description: "Tekanan hidrolik stabil, aliran laminar tanpa kavitasi cairan.",
    audioFrequency: 85,
    noiseLevel: 0.18,
    modulationSpeed: 3,
    expectedScore: 0.095,
    audioUrl: "/samples/DEMO_PUMP_NORMAL.wav",
    faultDetails: {
      faultType: "Laminar Fluid Circulation (Healthy)",
      isoStandard: "ISO 10816-3 Group 1 (Zone A - Good)",
      recommendedAction: "Lakukan pengecekan level oli impeller pada shift berikutnya.",
      healthScore: 96.0,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "pump-abnormal-01",
    name: "Centrifugal Pump (Impeller Cavitation)",
    machineType: "pump",
    machineId: "PUMP-STATION-02",
    condition: "ABNORMAL",
    description: "Kavitasi parah: gelembung uap meledak mengikis bilah impeller pompa.",
    audioFrequency: 85,
    noiseLevel: 0.85,
    modulationSpeed: 22,
    expectedScore: 0.912,
    audioUrl: "/samples/DEMO_PUMP_ANOMALY.wav",
    faultDetails: {
      faultType: "Impeller Blade Erosion & Fluid Cavitation",
      isoStandard: "ISO 10816-7 Category I (Alarm Threshold Exceeded)",
      recommendedAction: "Turunkan laju discharge valve segera dan cek NPSH (Net Positive Suction Head) inlet pipa.",
      healthScore: 48.5,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 8500,
    },
  },
  {
    id: "slider-normal-01",
    name: "Linear Slider Rail (Smooth Gantry)",
    machineType: "slider",
    machineId: "SLIDER-GANTRY-A",
    condition: "NORMAL",
    description: "Translasi linear mulus pada rel gantry CNC, pelumasan optimal.",
    audioFrequency: 240,
    noiseLevel: 0.12,
    modulationSpeed: 1,
    expectedScore: 0.045,
    audioUrl: "/samples/DEMO_SLIDER_NORMAL.wav",
    faultDetails: {
      faultType: "Precision Guideway Motion (Healthy)",
      isoStandard: "ISO 230-2 (Machine Tool Position Accuracy Compliant)",
      recommendedAction: "Bersihkan sisa serpihan debu rel pada akhir pekan.",
      healthScore: 99.1,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "slider-abnormal-01",
    name: "Linear Slider Rail (Ball Screw Friction)",
    machineType: "slider",
    machineId: "SLIDER-GANTRY-A",
    condition: "ABNORMAL",
    description: "Friksi kering & misalignment pada ball screw menyebabkan lonjakan harmonik.",
    audioFrequency: 240,
    noiseLevel: 0.72,
    modulationSpeed: 18,
    expectedScore: 0.864,
    audioUrl: "/samples/DEMO_SLIDER_ANOMALY.wav",
    faultDetails: {
      faultType: "Ball Screw Dry Friction & Rail Misalignment",
      isoStandard: "ISO 10816-3 Class III (Restricted Long-Term Operation)",
      recommendedAction: "Injeksi grease lithium NLGI 2 pada rel pandu gantry dan kalibrasi backlash sumbu X.",
      healthScore: 57.8,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 3800,
    },
  },
  {
    id: "valve-normal-01",
    name: "Solenoid Valve (Tight Seal Cycle)",
    machineType: "valve",
    machineId: "VALVE-HYDRO-08",
    condition: "NORMAL",
    description: "Siklus buka-tutup katup kedap udara, respons aktuator 18 ms.",
    audioFrequency: 360,
    noiseLevel: 0.10,
    modulationSpeed: 0.5,
    expectedScore: 0.038,
    audioUrl: "/samples/DEMO_VALVE_NORMAL.wav",
    faultDetails: {
      faultType: "Hermetic Valve Sealing (Healthy)",
      isoStandard: "ISO 5208 (Zero Seat Leakage Standard)",
      recommendedAction: "Tidak diperlukan tindakan. Siklus solenoid bekerja normal.",
      healthScore: 99.4,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "valve-abnormal-01",
    name: "Solenoid Valve (Internal Seat Leak)",
    machineType: "valve",
    machineId: "VALVE-HYDRO-08",
    condition: "ABNORMAL",
    description: "Kebocoran hisis mikro internal berfrekuensi tinggi (hissing turbulence).",
    audioFrequency: 360,
    noiseLevel: 0.81,
    modulationSpeed: 30,
    expectedScore: 0.899,
    audioUrl: "/samples/DEMO_VALVE_ANOMALY.wav",
    faultDetails: {
      faultType: "Internal Gasket Seal Leak & Solenoid Jitter",
      isoStandard: "ISO 5208 Rate D (High Risk Seat Degradation)",
      recommendedAction: "Isolasi jalur pneumatik sekunder dan ganti O-Ring fluoroelastomer Viton.",
      healthScore: 51.2,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 6100,
    },
  },
];

/**
 * Web Audio Synthesizer: Generates realistic industrial audio signals in browser
 */
export function playSyntheticIndustrialSound(
  preset: PresetSample,
  duration = 4
): { stop: () => void } {
  if (typeof window === "undefined") return { stop: () => {} };

  if (preset.audioUrl) {
    try {
      const audio = new Audio(preset.audioUrl);
      audio.play().catch(() => {});
      return {
        stop: () => {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch {
            // ignore
          }
        },
      };
    } catch {
      // fallback to synthesis below
    }
  }

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Noise node
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = preset.condition === "ABNORMAL" ? "bandpass" : "lowpass";
    noiseFilter.frequency.value =
      preset.condition === "ABNORMAL" ? 3500 : 450;
    noiseFilter.Q.value = preset.condition === "ABNORMAL" ? 4.0 : 1.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = preset.noiseLevel * 0.15;

    // Base motor hum
    osc.type = preset.condition === "ABNORMAL" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(preset.audioFrequency, ctx.currentTime);

    // Motor modulation for abnormal knocking
    if (preset.condition === "ABNORMAL") {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = preset.modulationSpeed;
      lfoGain.gain.value = 40;
      lfo.connect(osc.frequency);
      lfo.start();
    }

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    whiteNoise.start();

    osc.stop(ctx.currentTime + duration);
    whiteNoise.stop(ctx.currentTime + duration);

    return {
      stop: () => {
        try {
          osc.stop();
          whiteNoise.stop();
          ctx.close();
        } catch {
          // ignore
        }
      },
    };
  } catch {
    return { stop: () => {} };
  }
}
