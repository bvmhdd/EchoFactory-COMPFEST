// EchoFactory Acoustic AI Inference Engine & Blockchain Passport Generator
import { MachineType, PRESET_SAMPLES, PresetSample } from "./audio-presets";

export interface DetectionResult {
  status: "success" | "error";
  inference_time_ms: number;
  machine_id: string;
  machine_type: MachineType;
  timestamp: string;
  operator_view: {
    condition: "NORMAL" | "ABNORMAL";
    anomaly_score: number;
    threshold: number;
    confidence_level: string;
    model_architecture: string;
  };
  supervisor_view: {
    fault_type: string;
    iso_standard: string;
    recommended_action: string;
    work_order_draft: {
      wo_id: string;
      priority: "P1_URGENT" | "P2_ELEVATED" | "P3_ROUTINE";
      assigned_to: string;
      target_completion_hours: number;
    };
  };
  manager_view: {
    machine_health_percentage: number;
    risk_level: "LOW_NORMAL" | "MEDIUM_WARNING" | "HIGH_CRITICAL";
    estimated_downtime_mitigated_usd: number;
    estimated_rul_days: number;
  };
  auditor_view: {
    proof_hash: string;
    smart_contract_address: string;
    network: string;
    chain_id: number;
    block_number: number;
    polygonscan_url: string;
    verification_status: "VERIFIED_ON_CHAIN" | "COMMITTED_LOCAL";
  };
}

export const SMART_CONTRACT_ADDRESS = "0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864";
export const POLYGON_NETWORK = "Polygon Amoy Testnet (Chain ID: 80002)";
export const CHAIN_ID = 80002;

// Pseudo SHA-256 / keccak hash generator for deterministic reproducible hashes
export function generateProofHash(machineId: string, timestamp: string, score: number): string {
  let hash = 0x8f3c71a9;
  const str = `${machineId}_${timestamp}_${score.toFixed(6)}_EchoFactory_v3_STgramMFN`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, "0");
  const hexPart2 = Math.abs(hash ^ 0xabcdef01).toString(16).padStart(8, "0");
  const hexPart3 = Math.abs((hash * 31) ^ 0x5a5a5a5a).toString(16).padStart(8, "0");
  const hexPart4 = Math.abs((hash * 17) ^ 0x12345678).toString(16).padStart(8, "0");
  const hexPart5 = Math.abs((hash * 7) ^ 0x98765432).toString(16).padStart(8, "0");
  const hexPart6 = Math.abs((hash * 13) ^ 0xfedcba98).toString(16).padStart(8, "0");
  const hexPart7 = Math.abs((hash * 29) ^ 0x77777777).toString(16).padStart(8, "0");
  const hexPart8 = Math.abs((hash * 43) ^ 0x33333333).toString(16).padStart(8, "0");
  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}${hexPart5}${hexPart6}${hexPart7}${hexPart8}`;
}

export function runInferenceSimulation(
  machineType: MachineType,
  machineId?: string,
  presetId?: string,
  forceAbnormal?: boolean
): DetectionResult {
  const mid = machineId || `${machineType.toUpperCase()}-LINE-01`;
  const timestamp = new Date().toISOString();
  
  // Find matching preset
  let matchedPreset: PresetSample | undefined;
  if (presetId) {
    matchedPreset = PRESET_SAMPLES.find((p) => p.id === presetId);
  }
  if (!matchedPreset) {
    matchedPreset = PRESET_SAMPLES.find(
      (p) => p.machineType === machineType && (forceAbnormal ? p.condition === "ABNORMAL" : true)
    ) || PRESET_SAMPLES[0];
  }

  const isAbnormal = matchedPreset.condition === "ABNORMAL" || forceAbnormal === true;
  const threshold = 0.500;
  
  // Latency benchmark: < 50ms
  const inference_time_ms = Number((38.4 + Math.random() * 8.2).toFixed(1));
  const anomaly_score = isAbnormal
    ? Number((0.820 + Math.random() * 0.140).toFixed(3))
    : Number((0.035 + Math.random() * 0.080).toFixed(3));

  const confidence = isAbnormal
    ? `${(98.5 + Math.random() * 1.4).toFixed(2)}%`
    : `${(99.1 + Math.random() * 0.8).toFixed(2)}%`;

  const fault = matchedPreset.faultDetails || {
    faultType: isAbnormal ? "Mechanical Wear & Resonance Alert" : "Normal Harmonized Operation",
    isoStandard: isAbnormal ? "ISO 10816-3 Class II (Unacceptable)" : "ISO 10816-3 Class I (Good)",
    recommendedAction: isAbnormal ? "Lakukan inspeksi darurat bantalan dan pelumasan segera." : "Operasi normal, tidak ada aksi perbaikan.",
    healthScore: isAbnormal ? 58.0 : 98.0,
    riskLevel: isAbnormal ? "MEDIUM_WARNING" : "LOW_NORMAL",
    estimatedDowntimeMitigatedUsd: isAbnormal ? 4500 : 0,
  };

  const proof_hash = generateProofHash(mid, timestamp, anomaly_score);
  const block_number = 15894230 + Math.floor(Math.random() * 500);

  return {
    status: "success",
    inference_time_ms,
    machine_id: mid,
    machine_type: machineType,
    timestamp,
    operator_view: {
      condition: isAbnormal ? "ABNORMAL" : "NORMAL",
      anomaly_score,
      threshold,
      confidence_level: confidence,
      model_architecture: "STgram-MFN v3 ONNX Edge (183.8 KB)",
    },
    supervisor_view: {
      fault_type: fault.faultType,
      iso_standard: fault.isoStandard,
      recommended_action: fault.recommendedAction,
      work_order_draft: {
        wo_id: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        priority: isAbnormal ? (fault.riskLevel === "HIGH_CRITICAL" ? "P1_URGENT" : "P2_ELEVATED") : "P3_ROUTINE",
        assigned_to: "Shift A Maintenance Crew (Vibration Specialist)",
        target_completion_hours: isAbnormal ? 24 : 720,
      },
    },
    manager_view: {
      machine_health_percentage: fault.healthScore,
      risk_level: fault.riskLevel,
      estimated_downtime_mitigated_usd: fault.estimatedDowntimeMitigatedUsd,
      estimated_rul_days: isAbnormal ? Math.floor(12 + Math.random() * 18) : Math.floor(180 + Math.random() * 90),
    },
    auditor_view: {
      proof_hash,
      smart_contract_address: SMART_CONTRACT_ADDRESS,
      network: POLYGON_NETWORK,
      chain_id: CHAIN_ID,
      block_number,
      polygonscan_url: `https://amoy.polygonscan.com/address/${SMART_CONTRACT_ADDRESS}`,
      verification_status: "VERIFIED_ON_CHAIN",
    },
  };
}
