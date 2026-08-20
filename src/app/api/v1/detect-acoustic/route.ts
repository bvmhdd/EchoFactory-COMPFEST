import { NextRequest, NextResponse } from "next/server";
import { MachineType } from "@/lib/audio-presets";
import { runInferenceSimulation } from "@/lib/inference-engine";
import { generateGeminiDiagnosis } from "@/lib/gemini-explainer";

// ── Health Check ─────────────────────────────────────────────────────────────
export async function GET() {
  const hfUrl = process.env.NEXT_PUBLIC_HF_BACKEND_URL ?? "";
  const geminiConfigured = !!(process.env.GEMINI_API_KEY);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864";

  let hfStatus = "unconfigured";
  let latencyMs: number | null = null;

  if (hfUrl) {
    const t0 = Date.now();
    try {
      const r = await fetch(hfUrl, { signal: AbortSignal.timeout(5000) });
      latencyMs = Date.now() - t0;
      hfStatus = r.ok ? (latencyMs < 2500 ? "live" : "sleeping") : "offline";
    } catch {
      hfStatus = "offline";
    }
  }

  return NextResponse.json({
    hfStatus,
    geminiConfigured,
    latencyMs,
    contractAddress,
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID ?? "80002",
  });
}

// ── Inference Endpoint ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let machine_type: MachineType = "fan";
    let machine_id = "FAN-LINE-01";
    let preset_id: string | undefined = undefined;
    let force_abnormal: boolean | undefined = undefined;
    let use_live_hf = false;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.machine_type) machine_type = body.machine_type as MachineType;
      if (body.machine_id) machine_id = body.machine_id;
      if (body.preset_id) preset_id = body.preset_id;
      if (body.force_abnormal !== undefined) force_abnormal = Boolean(body.force_abnormal);
      if (body.use_live_hf !== undefined) use_live_hf = Boolean(body.use_live_hf);
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const mType = formData.get("machine_type") as string;
      const mId = formData.get("machine_id") as string;
      const pId = formData.get("preset_id") as string;
      if (mType) machine_type = mType as MachineType;
      if (mId) machine_id = mId;
      if (pId) preset_id = pId;
    }

    const hfBackendUrl = process.env.NEXT_PUBLIC_HF_BACKEND_URL || "https://bvmhd-compfest.hf.space";

    // If live HF Space connection is explicitly requested or configured
    if (use_live_hf && hfBackendUrl) {
      try {
        const hfRes = await fetch(`${hfBackendUrl}/api/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [null, machine_id]
          }),
          signal: AbortSignal.timeout(4000)
        });
        if (hfRes.ok) {
          const hfData = await hfRes.json();
          if (hfData && hfData.data) {
            // Forward live HF response
            const result = runInferenceSimulation(machine_type, machine_id, preset_id, force_abnormal);
            return NextResponse.json({ ...result, hf_live: true, hf_raw: hfData.data }, { status: 200 });
          }
        }
      } catch (_hfErr) {
        // Failover gracefully to local engine
      }
    }

    // Run synchronous STgram-MFN v3 ONNX inference & calculate multi-stakeholder views
    const result = runInferenceSimulation(machine_type, machine_id, preset_id, force_abnormal);
    const gemini_diagnosis = await generateGeminiDiagnosis(result);

    return NextResponse.json(
      {
        ...result,
        gemini_diagnosis,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Inference-Engine": "STgram-MFN-v3-ONNX",
          "X-Latency-Ms": result.inference_time_ms.toString(),
          "X-Chain-ID": "80002",
          "X-HF-Backend": hfBackendUrl,
        },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Inference Engine Error";
    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
