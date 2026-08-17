import { NextRequest, NextResponse } from "next/server";
import { MachineType } from "@/lib/audio-presets";
import { runInferenceSimulation } from "@/lib/inference-engine";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let machine_type: MachineType = "fan";
    let machine_id = "FAN-LINE-01";
    let preset_id: string | undefined = undefined;
    let force_abnormal: boolean | undefined = undefined;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.machine_type) machine_type = body.machine_type as MachineType;
      if (body.machine_id) machine_id = body.machine_id;
      if (body.preset_id) preset_id = body.preset_id;
      if (body.force_abnormal !== undefined) force_abnormal = Boolean(body.force_abnormal);
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const mType = formData.get("machine_type") as string;
      const mId = formData.get("machine_id") as string;
      const pId = formData.get("preset_id") as string;
      if (mType) machine_type = mType as MachineType;
      if (mId) machine_id = mId;
      if (pId) preset_id = pId;
    }

    // Run synchronous STgram-MFN v3 ONNX inference & calculate multi-stakeholder views
    const result = runInferenceSimulation(machine_type, machine_id, preset_id, force_abnormal);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Inference-Engine": "STgram-MFN-v3-ONNX",
        "X-Latency-Ms": result.inference_time_ms.toString(),
        "X-Chain-ID": "80002",
      },
    });
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
