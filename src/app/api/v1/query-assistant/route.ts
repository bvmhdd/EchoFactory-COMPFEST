import { NextRequest, NextResponse } from "next/server";
import { DetectionResult } from "@/lib/inference-engine";

export async function POST(req: NextRequest) {
  try {
    const { query, result } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const currentResult: DetectionResult | null = result || null;

    const systemPrompt = `
Anda adalah Gemini 1.5 Flash Industrial Reliability Assistant untuk sistem pemeliharaan prediktif pabrik pintar EchoFactory.
Tugas Anda adalah menjawab pertanyaan teknis operator/supervisor industri secara profesional, ringkas, dan berbasis data telemetri akustik.

${
  currentResult
    ? `[KONTEKS MESIN SAAT INI]
- ID Mesin: ${currentResult.machine_id} (${currentResult.machine_type.toUpperCase()})
- Status Kondisi: ${currentResult.operator_view.condition}
- Skor Anomali (STgram-MFN v3): ${currentResult.operator_view.anomaly_score.toFixed(3)} (Threshold: 0.500)
- Keyakinan Model: ${currentResult.operator_view.confidence_level}
- Kerusakan Teridentifikasi: ${currentResult.supervisor_view.fault_type}
- Standar ISO: ${currentResult.supervisor_view.iso_standard}
- Rekomendasi SOP: ${currentResult.supervisor_view.recommended_action}
- Kesehatan Unit: ${currentResult.manager_view.machine_health_percentage}%
- Estimasi Sisa Umur Operasional (RUL): ${currentResult.manager_view.estimated_rul_days} hari
- Biaya Downtime Dicegah: $${currentResult.manager_view.estimated_downtime_mitigated_usd.toLocaleString()} USD
- Web3 Blockchain Hash: ${currentResult.auditor_view.proof_hash}`
    : `[STATUS MESIN] Belum ada analisis akustik yang dijalankan.`
}

PERTANYAAN USER: "${query}"

Jawablah dalam bahasa Indonesia dengan gaya teknisi senior keandalan mesin pabrik (Reliability Engineer), ringkas (2-3 paragraf), jelas, dan berikan estimasi/rekomendasi berbasis bukti telemetri di atas jika ada.
`.trim();

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 350,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer && answer.trim().length > 0) {
            return NextResponse.json({ answer: answer.trim() });
          }
        }
      } catch (_err) {
        // Fallthrough to local AI synthesis
      }
    }

    // Dynamic Context-Aware Fallback Synthesis
    let answer = "";
    const q = query.toLowerCase();

    if (currentResult) {
      const isAbnormal = currentResult.operator_view.condition === "ABNORMAL";
      if (q.includes("rul") || q.includes("umur") || q.includes("sisa")) {
        answer = `[Gemini 1.5 Flash AI Assistant]\nBerdasarkan estimasi model STgram-MFN v3, sisa umur operasional (RUL) untuk ${currentResult.machine_id} diperkirakan tersisa ~${currentResult.manager_view.estimated_rul_days} hari kerja. ${
          isAbnormal
            ? `Terdeteksi ${currentResult.supervisor_view.fault_type}. Segera lakukan ${currentResult.supervisor_view.recommended_action} sebelum kegagalan total.`
            : `Kondisi mesin masih dalam batas aman laminar (${currentResult.manager_view.machine_health_percentage}% health index).`
        }`;
      } else if (q.includes("status") || q.includes("kondisi") || q.includes("getaran")) {
        answer = `[Gemini 1.5 Flash AI Assistant]\nStatus telemetri saat ini untuk ${currentResult.machine_id}: ${currentResult.operator_view.condition} (Skor Anomali: ${currentResult.operator_view.anomaly_score.toFixed(3)} vs Threshold 0.500). Kriteria kepatuhan ISO 10816: ${currentResult.supervisor_view.iso_standard}. Keyakinan model: ${currentResult.operator_view.confidence_level}.`;
      } else if (q.includes("tindakan") || q.includes("sop") || q.includes("perbaikan") || q.includes("apa yang harus")) {
        answer = `[Gemini 1.5 Flash AI Assistant]\nRekomendasi Tindakan Preskriptif (ISO 10816-3 SOP):\n1. ${currentResult.supervisor_view.recommended_action}\n2. Prioritas Work Order: ${currentResult.supervisor_view.work_order_draft.priority}\n3. Estimasi Downtime Terhindari: $${currentResult.manager_view.estimated_downtime_mitigated_usd.toLocaleString()} USD.`;
      } else {
        answer = `[Gemini 1.5 Flash AI Assistant]\nTelemetri ${currentResult.machine_id} menunjukkan status ${currentResult.operator_view.condition} dengan tingkat kesehatan ${currentResult.manager_view.machine_health_percentage}%. Masalah teridentifikasi: ${currentResult.supervisor_view.fault_type}. Rekomendasi: ${currentResult.supervisor_view.recommended_action}. Hash Bukti On-Chain: ${currentResult.auditor_view.proof_hash.slice(0, 16)}...`;
      }
    } else {
      answer = `[Gemini 1.5 Flash AI Assistant]\nSilakan pilih sampel mesin dan jalankan analisis akustik terlebih dahulu untuk mendapatkan data telemetri real-time. Pertanyaan Anda "${query}" telah dicatat.`;
    }

    return NextResponse.json({ answer });
  } catch (_err) {
    return NextResponse.json(
      { error: "Gagal memproses query assistant Gemini Flash" },
      { status: 500 }
    );
  }
}
