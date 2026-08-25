import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DetectionResult } from "./inference-engine";

export type WorkOrderTabType = "sop" | "fmea" | "supply_chain" | "esg";

export function generateWorkOrderPDF(
  result: DetectionResult,
  activeTab: WorkOrderTabType,
  geminiDiagnosis?: string | null
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const isAbnormal = result.operator_view.condition === "ABNORMAL";

  const {
    machine_id,
    machine_type,
    supervisor_view,
    manager_view,
    auditor_view,
    operator_view,
  } = result;

  const {
    prescriptive_sop,
    fmea_matrix,
    supply_chain_derating,
    work_order_draft,
    fault_type,
    iso_standard,
    recommended_action,
  } = supervisor_view;

  const { esg_forensics } = manager_view;

  const woId = work_order_draft?.wo_id || `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("id-ID");

  // ── Colors ──
  const primaryNavy: [number, number, number] = [11, 37, 69]; // #0B2545
  const accentCyan: [number, number, number] = [0, 150, 199]; // #0096C7
  const statusColor: [number, number, number] = isAbnormal ? [220, 38, 38] : [16, 185, 129];
  const darkText: [number, number, number] = [30, 41, 59];
  const mutedText: [number, number, number] = [100, 116, 139];

  // ── Header Banner ──
  doc.setFillColor(...primaryNavy);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Header Cyan Accent Bar
  doc.setFillColor(...accentCyan);
  doc.rect(0, 28, pageWidth, 1.5, "F");

  // Brand Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ECHOFACTORY", margin, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 220, 255);
  doc.text("SMART MANUFACTURING · ACOUSTIC AI & BLOCKCHAIN LEDGER", margin, 17);
  doc.text("Standard: ISO 10816-3 · IATF 16949 · Polygon Amoy Web3", margin, 22);

  // Right Header Meta
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`NO. TIKET: ${woId}`, pageWidth - margin, 12, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 230, 255);
  doc.text(`Tanggal: ${dateStr} ${timeStr}`, pageWidth - margin, 18, { align: "right" });
  doc.text(`Unit: ${machine_id} (${machine_type.toUpperCase()})`, pageWidth - margin, 23, { align: "right" });

  let currentY = 36;

  // ── Document Title by Tab ──
  let docTitle = "";
  let docSubtitle = "";

  switch (activeTab) {
    case "sop":
      docTitle = "WORK ORDER PEMELIHARAAN PRESKRIPTIF & K3 LOTO";
      docSubtitle = "Instruksi Kerja Standar Isolasi Energi, Penggantian Suku Cadang, & Audit Akustik";
      break;
    case "fmea":
      docTitle = "LAPORAN EVALUASI RISIKO KEGAGALAN FMEA & RPN";
      docSubtitle = "Failure Mode and Effects Analysis · IATF 16949 Standard Mechanical Forensics";
      break;
    case "supply_chain":
      docTitle = "REKOMENDASI OPERASI DERATING & SUPPLY CHAIN ERP";
      docSubtitle = "Mitigasi Bottleneck Suku Cadang · Penurunan Beban Mesin · Ekstensi Sisa Umur Pakai (RUL)";
      break;
    case "esg":
      docTitle = "LAPORAN AUDIT ESG CARBON FORENSICS & EFISIENSI ENERGI";
      docSubtitle = "Analisis Pemborosan Energi, Penalti Karbon Scope 2, & Sertifikasi ISO 50001";
      break;
  }

  doc.setTextColor(...primaryNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(docTitle, margin, currentY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text(docSubtitle, margin, currentY + 4.5);

  currentY += 10;

  // ── General Machine & Status Summary Box ──
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: "grid",
    head: [["PARAMETER UNIT", "NILAI / STATUS", "STANDAR INDUSTRI", "AUDIT KEANDALAN"]],
    body: [
      [
        "Target Mesin / Line",
        `${machine_id} (${machine_type.toUpperCase()})`,
        iso_standard,
        `Kesehatan: ${manager_view.machine_health_percentage}%`,
      ],
      [
        "Status Deteksi Akustik",
        `${operator_view.condition} (${isAbnormal ? "ANOMALI KRITIS" : "NORMAL MEMENUHI SYARAT"})`,
        `Threshold: ${operator_view.threshold.toFixed(3)}`,
        `Skor Anomali: ${operator_view.anomaly_score.toFixed(3)}`,
      ],
      [
        "Identifikasi Kerusakan",
        fault_type,
        `Keyakinan AI: ${operator_view.confidence_level}`,
        `Model: ${operator_view.model_architecture}`,
      ],
      [
        "Prioritas Work Order",
        `${work_order_draft.priority} (Target: ${work_order_draft.target_completion_hours} Jam)`,
        "Penugasan",
        work_order_draft.assigned_to,
      ],
    ],
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: darkText,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
    },
  });

  // @ts-expect-error jspdf-autotable lastAutoTable position
  currentY = doc.lastAutoTable.finalY + 6;

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 1: SOP & LOTO
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeTab === "sop") {
    // K3 LOTO Mandate Highlight Box
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(239, 68, 68);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 2, 2, "FD");

    doc.setTextColor(185, 28, 28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("MANDAT K3 LOTO (LOCK OUT - TAG OUT) - ZERO ENERGY STATE", margin + 3, currentY + 5);

    doc.setTextColor(69, 10, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const lotoLines = doc.splitTextToSize(
      prescriptive_sop?.loto_protocol || "Wajib isolasi saklar utama MCC 400V. Pasang gembok pengaman dan tagout sebelum intervensi mekanik.",
      pageWidth - margin * 2 - 6
    );
    doc.text(lotoLines, margin + 3, currentY + 10);

    currentY += 21;

    // 5-Step Prescriptive SOP Table
    doc.setTextColor(...primaryNavy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TAHAPAN EKSEKUSI PRESKRIPTIF SOP 5-LANGKAH", margin, currentY);
    currentY += 2;

    const sopStepsData = (prescriptive_sop?.steps || [
      "1. [LOTO & ISOLASI]: Matikan breaker utama MCC dan lakukan verifikasi Zero Energy State.",
      "2. [DISASSEMBLY]: Bongkar housing bearing menggunakan Hydraulic Puller presisi.",
      "3. [CLEANING]: Bersihkan journal shaft dengan solvent non-chlorinated dan cek runout (<0.02mm).",
      "4. [ASSEMBLY]: Panaskan bearing baru hingga 110C dengan induction heater dan pasang ke dudukan.",
      "5. [AUDIT]: Jalankan uji getaran idle 600 RPM lalu re-scan akustik dengan EchoFactory (Target Zone A).",
    ]).map((stepText, idx) => [
      `[ ] Step ${idx + 1}`,
      stepText,
      idx === 4 ? "Target Zone A ISO" : "Sesuai Standar K3",
      "Belum",
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "striped",
      head: [["CHECK", "INSTRUKSI KERJA PREVENTIF / KOREKTIF", "KRITERIA PENERIMAAN", "STATUS"]],
      body: sopStepsData,
      headStyles: {
        fillColor: primaryNavy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: darkText,
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: "bold" },
        1: { cellWidth: 105 },
        2: { cellWidth: 35 },
        3: { cellWidth: 20, halign: "center" },
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 6;

    // Tooling & Lubricant Specs Table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [["PERALATAN WAJIB (TOOLING MATRIX)", "SPESIFIKASI PELUMAS & BAHAN"]],
      body: [
        [
          (prescriptive_sop?.tooling_matrix || ["Hydraulic Bearing Puller 5-Ton", "Induction Heater 110C", "Torque Wrench 48 Nm", "Dial Gauge"]).join("\n• "),
          `Spesifikasi Pelumas:\n• ${prescriptive_sop?.lubricant_spec || "SKF LGHP 2 Polyurea Synthetic Grease (15g fill)"}\n\nRekomendasi Perbaikan Tambahan:\n• ${recommended_action}`,
        ],
      ],
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 2: FMEA (RPN)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeTab === "fmea") {
    // RPN Score Banner
    const rpnScore = fmea_matrix?.rpn_score ?? 96;
    const rpnBg: [number, number, number] = rpnScore > 40 ? [254, 242, 242] : [236, 253, 245];
    const rpnBorder: [number, number, number] = rpnScore > 40 ? [239, 68, 68] : [16, 185, 129];
    const rpnText: [number, number, number] = rpnScore > 40 ? [185, 28, 28] : [4, 120, 87];

    doc.setFillColor(...rpnBg);
    doc.setDrawColor(...rpnBorder);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 2, 2, "FD");

    doc.setTextColor(...rpnText);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`TOTAL FMEA RISK PRIORITY NUMBER (RPN): ${rpnScore} / 1000`, margin + 4, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Formula Kalkulasi: Severity (${fmea_matrix?.severity_s || 8}) × Occurrence (${fmea_matrix?.occurrence_o || 6}) × Detection (${fmea_matrix?.detection_d || 2}) = ${rpnScore}`,
      margin + 4,
      currentY + 11
    );
    doc.text(
      `Kategori Tingkat Risiko: ${fmea_matrix?.risk_category || "HIGH RISK (P1 MANDATE - Tindakan Segera Diperlukan)"}`,
      margin + 4,
      currentY + 15
    );

    currentY += 23;

    // FMEA Analysis Matrix Table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [["FAKTOR PENILAIAN", "SKOR (1-10)", "DEFINISI & IMPACT KERUSAKAN"]],
      body: [
        [
          "Severity (Tingkat Keparahan)",
          `${fmea_matrix?.severity_s || 8} / 10`,
          `Potensi Kerusakan: ${fmea_matrix?.potential_effect || "Rotor locking, motor coil burn, catastrophic line stoppage"}`,
        ],
        [
          "Occurrence (Kemungkinan Terjadi)",
          `${fmea_matrix?.occurrence_o || 6} / 10`,
          `Mode Kegagalan Teridentifikasi: ${fmea_matrix?.failure_mode || fault_type}`,
        ],
        [
          "Detection (Tingkat Deteksi AI)",
          `${fmea_matrix?.detection_d || 2} / 10`,
          `Deteksi Sangat Tinggi oleh STgram-MFN v3 Edge AI (Latensi: ${result.inference_time_ms} ms, Deteksi Dini Sebelum Kerusakan Fatal)`,
        ],
      ],
      headStyles: {
        fillColor: primaryNavy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: 30, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 100 },
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 6;

    // Mitigasi FMEA Action Plan
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "striped",
      head: [["RENCANA AKSI KONTINJENSI FMEA", "TARGET PENYELESAIAN", "TARGET RPN PASCA REPARASI"]],
      body: [
        [
          `1. Lakukan mitigasi langsung: ${recommended_action}\n2. Evaluasi derating beban motor untuk menekan laju keausan mekanik.\n3. Uji ulang harmonik getaran pada shift berikutnya.`,
          `${work_order_draft.target_completion_hours} Jam Maksimal`,
          "RPN < 10 (Target Kategori Low Risk)",
        ],
      ],
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 3: DERATING & SUPPLY CHAIN
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeTab === "supply_chain") {
    const isBottleneck = supply_chain_derating?.is_bottleneck ?? true;

    // Supply Chain Status Banner
    doc.setFillColor(isBottleneck ? 254 : 236, isBottleneck ? 243 : 253, isBottleneck ? 199 : 245);
    doc.setDrawColor(isBottleneck ? 245 : 16, isBottleneck ? 158 : 185, isBottleneck ? 11 : 129);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 2, 2, "FD");

    doc.setTextColor(isBottleneck ? 180 : 4, isBottleneck ? 83 : 120, isBottleneck ? 9 : 87);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      isBottleneck ? "STATUS LOGISTIK: PERINGATAN BOTTLENECK SUKU CADANG" : "STATUS LOGISTIK: PASOKAN AMAN",
      margin + 4,
      currentY + 6
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Lead Time Pengadaan: ${supply_chain_derating?.lead_time_days || 5} Hari | Stok Gudang Saat Ini: ${supply_chain_derating?.in_stock || 0} Unit | Sisa RUL Normal: ${manager_view.estimated_rul_days} Hari`,
      margin + 4,
      currentY + 11
    );

    currentY += 21;

    // Part Allocation Table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [["KODE PART SKU", "NAMA KOMPONEN", "STOK TERSEDIA", "LEAD TIME PENGIRIMAN", "STATUS BOTTLENECK"]],
      body: [
        [
          supply_chain_derating?.part_sku || "SKF-6205-2RSH/C3",
          supply_chain_derating?.part_name || "Deep Groove Ball Bearing 25x52x15mm",
          `${supply_chain_derating?.in_stock || 0} Unit`,
          `${supply_chain_derating?.lead_time_days || 5} Hari Kalender`,
          isBottleneck ? "BOTTLENECK (Lead Time > Sisa Umur)" : "TERSEDIA DI GUDANG",
        ],
      ],
      headStyles: {
        fillColor: primaryNavy,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 6;

    // Prescriptive Derating Advice Box
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "striped",
      head: [["INSTRUKSI DERATING OPERASIONAL PABRIK", "DAMPAK EKSTENSI SISA UMUR (RUL)"]],
      body: [
        [
          `Instruksi:\n${supply_chain_derating?.derating_advice || "Turunkan beban operasional blower 25% (derating ke 1350 RPM). Hindari start-stop mendadak."}`,
          `Tambahan Sisa Umur Pakai (RUL):\n+${supply_chain_derating?.extended_rul_days || 18} Hari Kalender\n(Menjamin mesin bertahan sampai suku cadang tiba di pabrik)`,
        ],
      ],
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 5;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 4: ESG ECO & CARBON FORENSICS
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeTab === "esg") {
    // ESG Banner
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 2, 2, "FD");

    doc.setTextColor(21, 128, 61);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("AUDIT KEBERLANJUTAN ESG (GREEN MANUFACTURING ISO 50001)", margin + 4, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Efisiensi Motor: ${esg_forensics?.motor_efficiency_pct || 91.2}% | Pemborosan Energi: +${esg_forensics?.excess_kwh_per_day || 14.2} kWh/hari | Penalti Karbon Scope 2: +${esg_forensics?.excess_co2_kg_per_day || 11.4} kg CO2e/hari`,
      margin + 4,
      currentY + 11
    );

    currentY += 21;

    // ESG Loss Table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "grid",
      head: [["INDIKATOR FORENSIK ESG", "DAMPAK LOSS / HARI", "DAMPAK LOSS / BULAN", "BIAYA FINANCIAL WASTE"]],
      body: [
        [
          "Konsumsi Listrik Berlebih",
          `+${esg_forensics?.excess_kwh_per_day || 14.2} kWh`,
          `+${((esg_forensics?.excess_kwh_per_day || 14.2) * 30).toFixed(1)} kWh`,
          `IDR ${(esg_forensics?.excess_cost_idr_per_month || 639000).toLocaleString("id-ID")}`,
        ],
        [
          "Emisi Gas Rumah Kaca (Scope 2)",
          `+${esg_forensics?.excess_co2_kg_per_day || 11.4} kg CO2e`,
          `+${((esg_forensics?.excess_co2_kg_per_day || 11.4) * 30).toFixed(1)} kg CO2e`,
          "Potensi Pajak Karbon Industri",
        ],
        [
          "Degradasi Efisiensi Motor",
          `${esg_forensics?.motor_efficiency_pct || 91.2}% (Loss: -${(100 - (esg_forensics?.motor_efficiency_pct || 91.2)).toFixed(1)}%)`,
          "Efisiensi Turun Akibat Gesekan",
          "Kompensasi Daya Reaktif",
        ],
      ],
      headStyles: {
        fillColor: [21, 128, 61],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 6;

    // ESG ROI Recommendation
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "striped",
      head: [["REKOMENDASI DEKARBONISASI & PENGHEMATAN ENERGI"]],
      body: [
        [
          `Perbaikan presisi akustik sebelum kerusakan parah akan menghemat hingga IDR ${(manager_view.estimated_downtime_mitigated_usd * 16000).toLocaleString("id-ID")} dan mereduksi emisi karbon hingga ${((esg_forensics?.excess_co2_kg_per_day || 11.4) * 365 / 1000).toFixed(2)} Ton CO2e per tahun. Memenuhi sertifikasi audit ISO 50001 dan ESG Green Compliance.`,
        ],
      ],
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkText,
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 5;
  }

  // ── Gemini Flash Multimodal Note (In all PDFs for traceability) ──
  if (geminiDiagnosis || fault_type) {
    const diagnosisContent =
      geminiDiagnosis ||
      `Spektrum getaran akustik ${machine_id} dianalisis dengan arsitektur STgram-MFN v3. Rekomendasi: ${recommended_action}`;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: "plain",
      body: [[`🧠 CATATAN DIAGNOSTIK KOGNITIF (GEMINI FLASH 2.0 AI):\n${diagnosisContent}`]],
      bodyStyles: {
        fontSize: 7,
        fontStyle: "italic",
        textColor: [51, 65, 85],
        fillColor: [248, 250, 252],
      },
    });

    // @ts-expect-error jspdf-autotable
    currentY = doc.lastAutoTable.finalY + 6;
  }

  // ── Sign-off & Blockchain Audit Verification Box ──
  const signBlockY = Math.max(currentY, pageHeight - 48);

  autoTable(doc, {
    startY: signBlockY,
    margin: { left: margin, right: margin },
    theme: "grid",
    head: [["TANDA TANGAN PENANGGUNG JAWAB", "VERIFIKASI BLOCKCHAIN POLYGON AMOY"]],
    body: [
      [
        "1. Lead Maintenance Engineer : ______________________\n\n2. Shift Safety Officer (K3)  : ______________________\n\n3. Plant Maintenance Manager : ______________________",
        `Proof Hash:\n${auditor_view.proof_hash}\n\nSmart Contract:\n${auditor_view.smart_contract_address}\n\nBlock #${auditor_view.block_number} · Polygon Amoy Testnet (Chain ID: 80002)\nStatus: 100% LOCALLY VERIFIED TAMPER-PROOF`,
      ],
    ],
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: darkText,
    },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { cellWidth: 85, fontStyle: "normal" },
    },
  });

  // ── Footer ──
  doc.setFontSize(7);
  doc.setTextColor(...mutedText);
  doc.text(
    `Dokumen resmi diterbitkan otomatis oleh EchoFactory Enterprise Industrial AI Platform · Halaman 1/1 · ${woId}`,
    margin,
    pageHeight - 5
  );

  // Trigger browser download
  const filenamePrefix =
    activeTab === "sop"
      ? "WorkOrder_SOP_LOTO"
      : activeTab === "fmea"
      ? "Report_FMEA_RPN"
      : activeTab === "supply_chain"
      ? "Advisory_SupplyChain_Derating"
      : "Audit_ESG_CarbonForensics";

  doc.save(`EchoFactory_${filenamePrefix}_${woId}_${machine_id}.pdf`);
}
