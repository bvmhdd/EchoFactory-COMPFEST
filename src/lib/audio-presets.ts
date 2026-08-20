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
  // ── FAN PRESETS ─────────────────────────────────────────────────────────────
  {
    id: "fan-normal-01",
    name: "Fan Industrial - ID_00 (Normal Baseline)",
    machineType: "fan",
    machineId: "FAN-ID-00",
    condition: "NORMAL",
    description: "Operasi aerodinamis mulus, tanpa getaran aksial abnormal (0 dB SNR).",
    audioFrequency: 120,
    noiseLevel: 0.15,
    modulationSpeed: 2,
    expectedScore: 0.082,
    audioUrl: "/samples/sample_bank/fan/id_00/normal/00000000.wav",
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
    name: "Fan Industrial - ID_00 (Bearing Outer Race Defect)",
    machineType: "fan",
    machineId: "FAN-ID-00",
    condition: "ABNORMAL",
    description: "Cacat jalur cincin luar bantalan dengan ketukan frekuensi tinggi 4.2 kHz.",
    audioFrequency: 120,
    noiseLevel: 0.78,
    modulationSpeed: 14,
    expectedScore: 0.887,
    audioUrl: "/samples/sample_bank/fan/id_00/abnormal/00000000.wav",
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
    id: "fan-normal-02",
    name: "Fan Industrial - ID_02 (Normal Baseline)",
    machineType: "fan",
    machineId: "FAN-ID-02",
    condition: "NORMAL",
    description: "Rotasi kipas pendingin stabil pada 1800 RPM tanpa riak akustik.",
    audioFrequency: 125,
    noiseLevel: 0.14,
    modulationSpeed: 2,
    expectedScore: 0.075,
    audioUrl: "/samples/sample_bank/fan/id_02/normal/00000000.wav",
    faultDetails: {
      faultType: "Nominal Cooling Rotor Operation",
      isoStandard: "ISO 10816-3 Class I (Good)",
      recommendedAction: "Kondisi sangat baik, lanjutkan pemantauan IoT standar.",
      healthScore: 99.0,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "fan-abnormal-02",
    name: "Fan Industrial - ID_02 (Rotor Imbalance Fault)",
    machineType: "fan",
    machineId: "FAN-ID-02",
    condition: "ABNORMAL",
    description: "Ketidakseimbangan massa bilah kipas menyebabkan amplitudo harmonik ke-1 tinggi.",
    audioFrequency: 125,
    noiseLevel: 0.75,
    modulationSpeed: 12,
    expectedScore: 0.865,
    audioUrl: "/samples/sample_bank/fan/id_02/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Rotor Dynamic Unbalance (Mass Eccentricity)",
      isoStandard: "ISO 1940-1 Grade G 6.3 (Alert Threshold Exceeded)",
      recommendedAction: "Lakukan dynamic balancing pada bilah kipas dan periksa baut mounting.",
      healthScore: 59.2,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 3600,
    },
  },
  {
    id: "fan-normal-04",
    name: "Fan Industrial - ID_04 (Normal Baseline)",
    machineType: "fan",
    machineId: "FAN-ID-04",
    condition: "NORMAL",
    description: "Aliran udara aksial konstan tanpa turbulensi rumah kipas.",
    audioFrequency: 118,
    noiseLevel: 0.16,
    modulationSpeed: 2,
    expectedScore: 0.080,
    audioUrl: "/samples/sample_bank/fan/id_04/normal/00000000.wav",
    faultDetails: {
      faultType: "Axial Ventilation Flow (Healthy)",
      isoStandard: "ISO 10816-3 Class I (Good)",
      recommendedAction: "Pembersihan debu rutin pada filter intake.",
      healthScore: 98.0,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "fan-abnormal-04",
    name: "Fan Industrial - ID_04 (Shaft Misalignment)",
    machineType: "fan",
    machineId: "FAN-ID-04",
    condition: "ABNORMAL",
    description: "Misalignment poros motor-kipas menghasilkan sinyal akustik 2X RPM tinggi.",
    audioFrequency: 118,
    noiseLevel: 0.82,
    modulationSpeed: 16,
    expectedScore: 0.902,
    audioUrl: "/samples/sample_bank/fan/id_04/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Angular & Parallel Shaft Misalignment",
      isoStandard: "ISO 10816-3 Class II (Critical Misalignment > 5.2 mm/s)",
      recommendedAction: "Lakukan laser alignment poros motor dan kencangkan fleksibel kopling.",
      healthScore: 51.0,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 5800,
    },
  },
  {
    id: "fan-normal-06",
    name: "Fan Industrial - ID_06 (Normal Baseline)",
    machineType: "fan",
    machineId: "FAN-ID-06",
    condition: "NORMAL",
    description: "Operasi ventilasi industri dengan profil spektral stabil.",
    audioFrequency: 122,
    noiseLevel: 0.13,
    modulationSpeed: 2,
    expectedScore: 0.068,
    audioUrl: "/samples/sample_bank/fan/id_06/normal/00000000.wav",
    faultDetails: {
      faultType: "Industrial Blower Circulation (Healthy)",
      isoStandard: "ISO 10816-3 Class I (Good)",
      recommendedAction: "Pemeriksaan berkala.",
      healthScore: 99.2,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "fan-abnormal-06",
    name: "Fan Industrial - ID_06 (Blade Friction & Damage)",
    machineType: "fan",
    machineId: "FAN-ID-06",
    condition: "ABNORMAL",
    description: "Gesekan bilah pada shroud rumah kipas menimbulkan lonjakan akustik periodik.",
    audioFrequency: 122,
    noiseLevel: 0.88,
    modulationSpeed: 20,
    expectedScore: 0.935,
    audioUrl: "/samples/sample_bank/fan/id_06/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Blade Mechanical Rubbing & Shroud Contact",
      isoStandard: "ISO 10816-3 Class III (Immediate Inspection Required)",
      recommendedAction: "Hentikan unit segera untuk mencegah kerusakan struktural bilah kipas.",
      healthScore: 42.5,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 9200,
    },
  },

  // ── PUMP PRESETS ────────────────────────────────────────────────────────────
  {
    id: "pump-normal-01",
    name: "Centrifugal Pump - ID_00 (Normal Flow)",
    machineType: "pump",
    machineId: "PUMP-ID-00",
    condition: "NORMAL",
    description: "Tekanan hidrolik stabil, aliran laminar tanpa kavitasi cairan.",
    audioFrequency: 85,
    noiseLevel: 0.18,
    modulationSpeed: 3,
    expectedScore: 0.095,
    audioUrl: "/samples/sample_bank/pump/id_00/normal/00000000.wav",
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
    name: "Centrifugal Pump - ID_00 (Impeller Cavitation)",
    machineType: "pump",
    machineId: "PUMP-ID-00",
    condition: "ABNORMAL",
    description: "Kavitasi parah: gelembung uap meledak mengikis bilah impeller pompa.",
    audioFrequency: 85,
    noiseLevel: 0.85,
    modulationSpeed: 22,
    expectedScore: 0.912,
    audioUrl: "/samples/sample_bank/pump/id_00/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Impeller Blade Erosion & Fluid Cavitation",
      isoStandard: "ISO 10816-7 Category I (Alarm Threshold Exceeded)",
      recommendedAction: "Turunkan laju discharge valve segera dan cek NPSH inlet pipa.",
      healthScore: 48.5,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 8500,
    },
  },
  {
    id: "pump-normal-02",
    name: "Centrifugal Pump - ID_02 (Normal Flow)",
    machineType: "pump",
    machineId: "PUMP-ID-02",
    condition: "NORMAL",
    description: "Sirkulasi fluida pendingin tekanan rendah operasi normal.",
    audioFrequency: 90,
    noiseLevel: 0.16,
    modulationSpeed: 3,
    expectedScore: 0.082,
    audioUrl: "/samples/sample_bank/pump/id_02/normal/00000000.wav",
    faultDetails: {
      faultType: "Coolant Pumping Baseline (Healthy)",
      isoStandard: "ISO 10816-3 Group 1 (Zone A)",
      recommendedAction: "Inspeksi rutin bulanan.",
      healthScore: 97.5,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "pump-abnormal-02",
    name: "Centrifugal Pump - ID_02 (Seal Degradation)",
    machineType: "pump",
    machineId: "PUMP-ID-02",
    condition: "ABNORMAL",
    description: "Kerusakan mechanical seal menimbulkan kebocoran tekanan & gesekan akustik.",
    audioFrequency: 90,
    noiseLevel: 0.79,
    modulationSpeed: 18,
    expectedScore: 0.878,
    audioUrl: "/samples/sample_bank/pump/id_02/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Mechanical Face Seal Wear & Dry Rub",
      isoStandard: "ISO 21049 / API 682 (Seal Piping Failure)",
      recommendedAction: "Ganti cartridge seal kit #M7N dan cek tekanan flushing seal plan 11.",
      healthScore: 55.4,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 4900,
    },
  },
  {
    id: "pump-normal-04",
    name: "Centrifugal Pump - ID_04 (Normal Flow)",
    machineType: "pump",
    machineId: "PUMP-ID-04",
    condition: "NORMAL",
    description: "Pompa umpan boile fluida panas beroperasi stabil.",
    audioFrequency: 88,
    noiseLevel: 0.17,
    modulationSpeed: 3,
    expectedScore: 0.088,
    audioUrl: "/samples/sample_bank/pump/id_04/normal/00000000.wav",
    faultDetails: {
      faultType: "Boiler Feed Pumping (Healthy)",
      isoStandard: "ISO 10816-3 Group 1 (Zone A)",
      recommendedAction: "Pertahankan jadwal oli.",
      healthScore: 97.0,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "pump-abnormal-04",
    name: "Centrifugal Pump - ID_04 (Suction Line Blockage)",
    machineType: "pump",
    machineId: "PUMP-ID-04",
    condition: "ABNORMAL",
    description: "Penyumbatan strainer inlet menghasilkan pusaran kavitasi vakum.",
    audioFrequency: 88,
    noiseLevel: 0.83,
    modulationSpeed: 21,
    expectedScore: 0.895,
    audioUrl: "/samples/sample_bank/pump/id_04/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Suction Strainer Partial Clogging",
      isoStandard: "ISO 10816-7 Category II (Vibration Elevation)",
      recommendedAction: "Bersihkan Y-strainer inlet dan verifikasi differential pressure gauge.",
      healthScore: 50.8,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 6300,
    },
  },
  {
    id: "pump-normal-06",
    name: "Centrifugal Pump - ID_06 (Normal Flow)",
    machineType: "pump",
    machineId: "PUMP-ID-06",
    condition: "NORMAL",
    description: "Operasi pompa transfer minyak cair dengan respon getaran rendah.",
    audioFrequency: 82,
    noiseLevel: 0.15,
    modulationSpeed: 3,
    expectedScore: 0.078,
    audioUrl: "/samples/sample_bank/pump/id_06/normal/00000000.wav",
    faultDetails: {
      faultType: "Oil Transfer Pumping (Healthy)",
      isoStandard: "ISO 10816-3 Group 1 (Zone A)",
      recommendedAction: "Kondisi nominal.",
      healthScore: 98.8,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "pump-abnormal-06",
    name: "Centrifugal Pump - ID_06 (Bearing Dry Friction)",
    machineType: "pump",
    machineId: "PUMP-ID-06",
    condition: "ABNORMAL",
    description: "Depresi pelumas bearing pompa menyebabkan lonjakan frekuensi tinggi.",
    audioFrequency: 82,
    noiseLevel: 0.86,
    modulationSpeed: 24,
    expectedScore: 0.920,
    audioUrl: "/samples/sample_bank/pump/id_06/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Bearing Lubrication Starvation (Dry Friction)",
      isoStandard: "ISO 10816-3 Class III (Unacceptable Wear)",
      recommendedAction: "Injeksi oli sintetis ISO VG 68 dan periksa suhu rumah bearing.",
      healthScore: 44.0,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 7800,
    },
  },

  // ── SLIDER PRESETS ──────────────────────────────────────────────────────────
  {
    id: "slider-normal-01",
    name: "Linear Slider Rail - ID_00 (Smooth Gantry)",
    machineType: "slider",
    machineId: "SLIDER-ID-00",
    condition: "NORMAL",
    description: "Translasi linear mulus pada rel gantry CNC, pelumasan optimal.",
    audioFrequency: 240,
    noiseLevel: 0.12,
    modulationSpeed: 1,
    expectedScore: 0.045,
    audioUrl: "/samples/sample_bank/slider/id_00/normal/00000000.wav",
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
    name: "Linear Slider Rail - ID_00 (Ball Screw Friction)",
    machineType: "slider",
    machineId: "SLIDER-ID-00",
    condition: "ABNORMAL",
    description: "Friksi kering & misalignment pada ball screw menyebabkan lonjakan harmonik.",
    audioFrequency: 240,
    noiseLevel: 0.72,
    modulationSpeed: 18,
    expectedScore: 0.864,
    audioUrl: "/samples/sample_bank/slider/id_00/abnormal/00000000.wav",
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
    id: "slider-normal-02",
    name: "Linear Slider Rail - ID_02 (Smooth Gantry)",
    machineType: "slider",
    machineId: "SLIDER-ID-02",
    condition: "NORMAL",
    description: "Gerakan slider pneumatis linear halus tanpa getaran abnormal.",
    audioFrequency: 235,
    noiseLevel: 0.11,
    modulationSpeed: 1,
    expectedScore: 0.040,
    audioUrl: "/samples/sample_bank/slider/id_02/normal/00000000.wav",
    faultDetails: {
      faultType: "Linear Actuator Motion (Healthy)",
      isoStandard: "ISO 230-2 Compliant",
      recommendedAction: "Pelumasan rutin per 1000 siklus.",
      healthScore: 99.4,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "slider-abnormal-02",
    name: "Linear Slider Rail - ID_02 (Guideway Contamination)",
    machineType: "slider",
    machineId: "SLIDER-ID-02",
    condition: "ABNORMAL",
    description: "Kontaminasi serbuk logam pada jalur rel slider memicu gesekan abrasive.",
    audioFrequency: 235,
    noiseLevel: 0.76,
    modulationSpeed: 15,
    expectedScore: 0.872,
    audioUrl: "/samples/sample_bank/slider/id_02/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Guideway Metal Debris Contamination",
      isoStandard: "ISO 10816-3 Class II (Elevated Friction)",
      recommendedAction: "Bersihkan wiper seal rel slider dan ganti pelindung bellows.",
      healthScore: 56.0,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 4100,
    },
  },
  {
    id: "slider-normal-04",
    name: "Linear Slider Rail - ID_04 (Smooth Gantry)",
    machineType: "slider",
    machineId: "SLIDER-ID-04",
    condition: "NORMAL",
    description: "Rel gantry robotik berkecepatan tinggi beroperasi presisi.",
    audioFrequency: 245,
    noiseLevel: 0.13,
    modulationSpeed: 1,
    expectedScore: 0.048,
    audioUrl: "/samples/sample_bank/slider/id_04/normal/00000000.wav",
    faultDetails: {
      faultType: "Robotic Gantry Motion (Healthy)",
      isoStandard: "ISO 230-2 Compliant",
      recommendedAction: "Kondisi optimal.",
      healthScore: 98.9,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "slider-abnormal-04",
    name: "Linear Slider Rail - ID_04 (Linear Block Degradation)",
    machineType: "slider",
    machineId: "SLIDER-ID-04",
    condition: "ABNORMAL",
    description: "Degradasi bola baja recirculating pada linear block memicu micro-spalling.",
    audioFrequency: 245,
    noiseLevel: 0.81,
    modulationSpeed: 19,
    expectedScore: 0.890,
    audioUrl: "/samples/sample_bank/slider/id_04/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Recirculating Ball Block Spalling Fault",
      isoStandard: "ISO 10816-3 Class III (Vibration Spike)",
      recommendedAction: "Ganti carriage block linear #THK-HSR25 dalam 24 jam kerja.",
      healthScore: 52.1,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 5500,
    },
  },
  {
    id: "slider-normal-06",
    name: "Linear Slider Rail - ID_06 (Smooth Gantry)",
    machineType: "slider",
    machineId: "SLIDER-ID-06",
    condition: "NORMAL",
    description: "Sistem positioning linier tahap akhir kerja nominal.",
    audioFrequency: 250,
    noiseLevel: 0.10,
    modulationSpeed: 1,
    expectedScore: 0.039,
    audioUrl: "/samples/sample_bank/slider/id_06/normal/00000000.wav",
    faultDetails: {
      faultType: "Linear Stage Positioning (Healthy)",
      isoStandard: "ISO 230-2 Compliant",
      recommendedAction: "Jadwal pemeliharaan biasa.",
      healthScore: 99.5,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "slider-abnormal-06",
    name: "Linear Slider Rail - ID_06 (Gantry Backlash Spike)",
    machineType: "slider",
    machineId: "SLIDER-ID-06",
    condition: "ABNORMAL",
    description: "Kelonggaran mur ball screw menimbulkan lonjakan getaran ketukan gantry.",
    audioFrequency: 250,
    noiseLevel: 0.84,
    modulationSpeed: 21,
    expectedScore: 0.915,
    audioUrl: "/samples/sample_bank/slider/id_06/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Ball Nut Preload Loss & Mechanical Backlash",
      isoStandard: "ISO 230-2 (Tolerance Exceeded)",
      recommendedAction: "Setel ulang preload ball nut dan kencangkan locknut bantalan aksial.",
      healthScore: 47.2,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 6700,
    },
  },

  // ── VALVE PRESETS ───────────────────────────────────────────────────────────
  {
    id: "valve-normal-01",
    name: "Solenoid Valve - ID_00 (Tight Seal Cycle)",
    machineType: "valve",
    machineId: "VALVE-ID-00",
    condition: "NORMAL",
    description: "Siklus buka-tutup katup kedap udara, respons aktuator 18 ms.",
    audioFrequency: 360,
    noiseLevel: 0.10,
    modulationSpeed: 0.5,
    expectedScore: 0.038,
    audioUrl: "/samples/sample_bank/valve/id_00/normal/00000000.wav",
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
    name: "Solenoid Valve - ID_00 (Internal Seat Leak)",
    machineType: "valve",
    machineId: "VALVE-ID-00",
    condition: "ABNORMAL",
    description: "Kebocoran hisis mikro internal berfrekuensi tinggi (hissing turbulence).",
    audioFrequency: 360,
    noiseLevel: 0.81,
    modulationSpeed: 30,
    expectedScore: 0.899,
    audioUrl: "/samples/sample_bank/valve/id_00/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Internal Gasket Seal Leak & Solenoid Jitter",
      isoStandard: "ISO 5208 Rate D (High Risk Seat Degradation)",
      recommendedAction: "Isolasi jalur pneumatik sekunder dan ganti O-Ring fluoroelastomer Viton.",
      healthScore: 51.2,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 6100,
    },
  },
  {
    id: "valve-normal-02",
    name: "Solenoid Valve - ID_02 (Tight Seal Cycle)",
    machineType: "valve",
    machineId: "VALVE-ID-02",
    condition: "NORMAL",
    description: "Respons solenoid pengatur laju alir stabil tanpa penurunan tekanan.",
    audioFrequency: 350,
    noiseLevel: 0.09,
    modulationSpeed: 0.5,
    expectedScore: 0.035,
    audioUrl: "/samples/sample_bank/valve/id_02/normal/00000000.wav",
    faultDetails: {
      faultType: "Flow Control Solenoid Sealing (Healthy)",
      isoStandard: "ISO 5208 Zero Leakage",
      recommendedAction: "Operasi nominal.",
      healthScore: 99.6,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "valve-abnormal-02",
    name: "Solenoid Valve - ID_02 (Solenoid Plunger Hesitation)",
    machineType: "valve",
    machineId: "VALVE-ID-02",
    condition: "ABNORMAL",
    description: "Hambatan mekanis plunger solenoid menyebabkan hambatan siklus respon buka katup.",
    audioFrequency: 350,
    noiseLevel: 0.78,
    modulationSpeed: 25,
    expectedScore: 0.880,
    audioUrl: "/samples/sample_bank/valve/id_02/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Plunger Friction Stick-Slip & Coil Under-voltage",
      isoStandard: "ISO 5208 Rate C (Actuator Lag Alert)",
      recommendedAction: "Bersihkan sisa residu minyak pada plunger armature & cek kumparan 24V DC.",
      healthScore: 54.0,
      riskLevel: "MEDIUM_WARNING",
      estimatedDowntimeMitigatedUsd: 4600,
    },
  },
  {
    id: "valve-normal-04",
    name: "Solenoid Valve - ID_04 (Tight Seal Cycle)",
    machineType: "valve",
    machineId: "VALVE-ID-04",
    condition: "NORMAL",
    description: "Katup pelepas tekanan keselamatan beroperasi presisi tinggi.",
    audioFrequency: 365,
    noiseLevel: 0.11,
    modulationSpeed: 0.5,
    expectedScore: 0.042,
    audioUrl: "/samples/sample_bank/valve/id_04/normal/00000000.wav",
    faultDetails: {
      faultType: "Safety Relief Valve Closure (Healthy)",
      isoStandard: "ISO 5208 Zero Leakage",
      recommendedAction: "Uji kalibrasi tekanan tahunan.",
      healthScore: 99.1,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "valve-abnormal-04",
    name: "Solenoid Valve - ID_04 (Pressure Relief Leak)",
    machineType: "valve",
    machineId: "VALVE-ID-04",
    condition: "ABNORMAL",
    description: "Kebocoran dudukan katup pelepas tekanan memicu desis akustik kontinu.",
    audioFrequency: 365,
    noiseLevel: 0.83,
    modulationSpeed: 28,
    expectedScore: 0.905,
    audioUrl: "/samples/sample_bank/valve/id_04/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Relief Valve Seat Orifice Erosion",
      isoStandard: "ISO 5208 Rate D (Pressure Relief Leakage)",
      recommendedAction: "Lap ulang dudukan katup (valve seat lapping) atau ganti inti katup.",
      healthScore: 49.0,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 6800,
    },
  },
  {
    id: "valve-normal-06",
    name: "Solenoid Valve - ID_06 (Tight Seal Cycle)",
    machineType: "valve",
    machineId: "VALVE-ID-06",
    condition: "NORMAL",
    description: "Katup aktuasi pneumatik proses industri bebas kebocoran.",
    audioFrequency: 355,
    noiseLevel: 0.08,
    modulationSpeed: 0.5,
    expectedScore: 0.034,
    audioUrl: "/samples/sample_bank/valve/id_06/normal/00000000.wav",
    faultDetails: {
      faultType: "Process Pneumatic Actuation (Healthy)",
      isoStandard: "ISO 5208 Zero Leakage",
      recommendedAction: "Kondisi sangat baik.",
      healthScore: 99.7,
      riskLevel: "LOW_NORMAL",
      estimatedDowntimeMitigatedUsd: 0,
    },
  },
  {
    id: "valve-abnormal-06",
    name: "Solenoid Valve - ID_06 (Diaphragm Micro-Crack)",
    machineType: "valve",
    machineId: "VALVE-ID-06",
    condition: "ABNORMAL",
    description: "Retak mikro diafragma katup menimbulkan getaran pulsasi desis pneumatik.",
    audioFrequency: 355,
    noiseLevel: 0.87,
    modulationSpeed: 32,
    expectedScore: 0.928,
    audioUrl: "/samples/sample_bank/valve/id_06/abnormal/00000000.wav",
    faultDetails: {
      faultType: "Diaphragm Rubber Fatigue Micro-Pores",
      isoStandard: "ISO 5208 Rate D (Critical Leak Threshold)",
      recommendedAction: "Ganti diafragma EPDM katup pneumatik sebelum kegagalan total.",
      healthScore: 43.1,
      riskLevel: "HIGH_CRITICAL",
      estimatedDowntimeMitigatedUsd: 7900,
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
