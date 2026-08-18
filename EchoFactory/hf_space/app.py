"""
🏭 EchoFactory — Industrial Acoustic AI & Blockchain Machine Health Passport
Aplikasi Terpadu: Edge Acoustic AI, Gemini Flash Multimodal, SOP ISO 10816, & Polygon Amoy Web3
COMPFEST 18 AI Innovation Challenge (AIC) | Smart Manufacturing Track
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import gradio as gr

# ---------------------------------------------------------------------------
# FIX: gradio_client schema-generation bug with ZeroGPU/spaces.GPU decorator.
#
# Root cause: The @spaces.GPU decorator injects `additionalProperties: true`
# (a boolean) into the Pydantic JSON schema. gradio_client's schema parser
# then calls _json_schema_to_python_type(True, defs) and get_type(True),
# neither of which can handle a non-dict schema — crashing with:
#   TypeError: argument of type 'bool' is not iterable
#   APIInfoParseError: Cannot parse schema True
#
# Fix: Patch BOTH functions to return "Any" when the schema is not a dict.
# ---------------------------------------------------------------------------
try:
    import gradio_client.utils as _gc_utils

    _original_get_type = _gc_utils.get_type
    _original_json_schema_to_python_type = _gc_utils._json_schema_to_python_type

    def _patched_get_type(schema):
        if not isinstance(schema, dict):
            return "Any"
        return _original_get_type(schema)

    def _patched_json_schema_to_python_type(schema, defs=None):
        """Guard against non-dict schemas (e.g. boolean additionalProperties)."""
        if not isinstance(schema, dict):
            return "Any"
        try:
            return _original_json_schema_to_python_type(schema, defs)
        except Exception:
            return "Any"

    _gc_utils.get_type = _patched_get_type
    _gc_utils._json_schema_to_python_type = _patched_json_schema_to_python_type
    print("[INFO] gradio_client schema patch applied successfully.")
except Exception as _patch_err:
    print(f"[WARN] Could not apply gradio_client schema patch: {_patch_err}")

# ---------------------------------------------------------------------------
# FIX: Jinja2 LRU cache TypeError: unhashable type: 'dict'
#
# Root cause: Starlette >= 0.37 changed TemplateResponse's calling convention.
# Gradio 4.44.0 may call templates.TemplateResponse(name, context_dict) in
# a way that passes the context dict as the cache_key to Jinja2, crashing with
# TypeError: unhashable type: 'dict' in jinja2/utils.py LRUCache.__getitem__.
#
# Fix: Patch Jinja2Templates.TemplateResponse to normalize argument order
# and ensure the template name is always a string, never a dict.
# ---------------------------------------------------------------------------
try:
    from starlette.templating import Jinja2Templates as _Jinja2Templates

    _orig_template_response = _Jinja2Templates.TemplateResponse

    def _safe_template_response(self, *args, **kwargs):
        # If first positional arg is a dict (context), the args are likely swapped.
        # Detect this and fix the order: (name:str, context:dict)
        if args and isinstance(args[0], dict):
            context = args[0]
            name = args[1] if len(args) > 1 else kwargs.pop("name", "")
            return _orig_template_response(self, name, context, **kwargs)
        return _orig_template_response(self, *args, **kwargs)

    _Jinja2Templates.TemplateResponse = _safe_template_response
    print("[INFO] Jinja2Templates.TemplateResponse patch applied successfully.")
except Exception as _jinja_patch_err:
    print(f"[WARN] Could not apply Jinja2Templates patch: {_jinja_patch_err}")

# Hugging Face ZeroGPU Support
try:
    import spaces
    has_spaces = True
except ImportError:
    has_spaces = False
    class spaces:
        @staticmethod
        def GPU(func=None, duration=60):
            if func is None:
                return lambda f: f
            return func

from audio_engine import audio_engine
from cognitive_engine import cognitive_engine, ERP_INVENTORY
from blockchain_service import hf_blockchain_service
from demo_samples_generator import generate_all_samples

# Path Demo Samples (Otomatis Dibuat saat Space Dijalankan)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEMO_DIR = os.path.join(BASE_DIR, "demo_samples")
try:
    if not os.path.exists(DEMO_DIR) or len(os.listdir(DEMO_DIR)) < 8:
        generate_all_samples(DEMO_DIR)
except Exception as ex:
    print(f"[WARN] Auto-generating demo samples fallback: {ex}")

# State Penyimpanan Diagnosis Terakhir
CURRENT_SCAN_STATE = {
    "machine_id": "FAN_ID_00",
    "machine_label": "Fan #00 (Industrial Blower)",
    "is_auto_detected": False,
    "machine_confidence": 100.0,
    "detected_snr": "0_dB",
    "snr_label": "0 dB (Standard Factory Floor)",
    "anomaly_score": 0.024,
    "is_anomaly": False,
    "crest_factor": 3.2,
    "status": "NORMAL (PASS)",
    "diagnosis": None
}

# =====================================================================
# HANDLER FUNCTIONS
# =====================================================================

def load_demo_audio(sample_filename, machine_id):
    """Memuat audio demo WAV dari asset library."""
    path = os.path.join(DEMO_DIR, sample_filename)
    if os.path.exists(path):
        return path, machine_id
    return None, machine_id

@spaces.GPU
def process_audio_scan(audio_input, machine_id):
    """Memproses file audio atau rekaman mikrofon dengan auto-detection mesin & SNR."""
    if audio_input is None:
        return (
            None,
            "⚠️ Harap rekam suara via mikrofon atau pilih file audio sampel!",
            "Belum ada data komitmen blockchain."
        )

    try:
        # 1. Load & Preprocess Audio (Resample mono 16kHz, pad/trim 10 detik)
        y, sr = audio_engine.load_and_preprocess_audio(audio_input)
        
        # 2. Extract Embedding, Auto-Detect Machine & SNR, Calculate Anomaly Score
        scan_res = audio_engine.extract_embedding_and_score(y, machine_id=machine_id)
        clean_mid = scan_res["machine_id"]
        
        # 3. Generate High-Tech Spectral Visualizer
        fig = audio_engine.generate_spectrogram_plot(scan_res, y)
        
        # 4. Update Current State
        CURRENT_SCAN_STATE["machine_id"] = clean_mid
        CURRENT_SCAN_STATE["machine_label"] = scan_res["machine_label"]
        CURRENT_SCAN_STATE["is_auto_detected"] = scan_res["is_auto_detected"]
        CURRENT_SCAN_STATE["machine_confidence"] = scan_res["machine_confidence"]
        CURRENT_SCAN_STATE["detected_snr"] = scan_res["detected_snr"]
        CURRENT_SCAN_STATE["snr_label"] = scan_res["snr_label"]
        CURRENT_SCAN_STATE["anomaly_score"] = scan_res["anomaly_score"]
        CURRENT_SCAN_STATE["is_anomaly"] = scan_res["is_anomaly"]
        CURRENT_SCAN_STATE["crest_factor"] = scan_res["crest_factor"]
        CURRENT_SCAN_STATE["status"] = scan_res["status"]
        
        # 5. Otomatis Commit Hash ke Blockchain Amoy
        bc_res = hf_blockchain_service.commit_inspection_record(
            machine_id=clean_mid,
            anomaly_score=scan_res["anomaly_score"],
            status=scan_res["status"],
            defect_type="None (Healthy)" if not scan_res["is_anomaly"] else f"Acoustic Anomaly ({scan_res['detected_snr']})"
        )
        
        # Format Info Deteksi
        detect_badge_info = ""
        if scan_res["is_auto_detected"]:
            detect_badge_info = f"<div style='margin-bottom:8px; font-size:13px; color:#38BDF8;'>🤖 <b>Auto-Detected Mesin:</b> <span style='color:#F1F5F9; font-weight:bold;'>{scan_res['machine_label']}</span> (Keyakinan Akustik: <b>{scan_res['machine_confidence']}%</b>)</div>"
        
        snr_badge_info = f"<div style='margin-bottom:8px; font-size:12.5px; color:#FBBF24;'>🔊 <b>Profil Kebisingan (SNR):</b> <span style='color:#FEF08A; font-weight:bold;'>{scan_res['snr_label']}</span> (Estimasi SNR: {scan_res['snr_db']} dB)</div>"
        
        # Format Badge Keputusan
        if not scan_res["is_anomaly"]:
            status_html = (
                f"<div style='background-color:#064E3B; border:2px solid #10B981; border-radius:10px; padding:15px; color:#ECFDF5;'>"
                f"{detect_badge_info}"
                f"{snr_badge_info}"
                f"<h3 style='margin:0; color:#34D399;'>🟢 MESIN SEHAT (PASS)</h3>"
                f"<p style='margin:5px 0 0 0; font-size:14px;'>Skor Anomali: <b>{scan_res['anomaly_score']:.4f}</b> (Batas Threshold {scan_res['detected_snr']}: {scan_res['threshold']}) | Spektrum stabil dalam standar ISO 10816.</p>"
                f"</div>"
            )
        else:
            status_html = (
                f"<div style='background-color:#7F1D1D; border:2px solid #EF4444; border-radius:10px; padding:15px; color:#FEF2F2; animation:pulse 2s infinite;'>"
                f"{detect_badge_info}"
                f"{snr_badge_info}"
                f"<h3 style='margin:0; color:#F87171;'>🔴 ANOMALI TERDETEKSI (ALERT)</h3>"
                f"<p style='margin:5px 0 0 0; font-size:14px;'>Skor Anomali: <b>{scan_res['anomaly_score']:.4f}</b> (Melebihi Batas {scan_res['threshold']}) | <b>Buka Tab 2 (Supervisor Hub) untuk diagnosis akar masalah & Work Order!</b></p>"
                f"</div>"
            )
            
        bc_html = (
            f"<div style='background:#1E293B; padding:12px; border-radius:8px; font-size:13px; color:#CBD5E1;'>"
            f"<b>⛓️ Status Web3 Ledger:</b> {bc_res['status']}<br>"
            f"<b>Mesin:</b> <code style='color:#F1F5F9;'>{clean_mid}</code> | <b>SNR:</b> <code style='color:#FEF08A;'>{scan_res['detected_snr']}</code><br>"
            f"<b>Data Hash SHA-256:</b> <code style='color:#38BDF8;'>{bc_res['data_hash']}</code><br>"
            f"<b>Tx Hash:</b> <code style='color:#A78BFA;'>{bc_res['tx_hash'][:22]}...</code><br>"
            f"{bc_res['explorer_link']}"
            f"</div>"
        )
        
        return (
            fig,
            status_html,
            bc_html
        )
    except Exception as e:
        return (
            None,
            f"<div style='color:#EF4444;'>Error memproses audio: {str(e)}</div>",
            str(e)
        )

@spaces.GPU
def run_deep_diagnostic(machine_id):
    """Menjalankan penalaran diagnostik kognitif Gemini Multimodal + ISO 10816."""
    score = CURRENT_SCAN_STATE["anomaly_score"]
    is_anom = CURRENT_SCAN_STATE["is_anomaly"]
    crest = CURRENT_SCAN_STATE["crest_factor"]
    mid = CURRENT_SCAN_STATE["machine_id"]
    snr_lbl = CURRENT_SCAN_STATE["snr_label"]
    
    diag = cognitive_engine.diagnose_anomaly(mid, score, is_anom, crest, snr_label=snr_lbl)
    CURRENT_SCAN_STATE["diagnosis"] = diag
    
    # Format Card ISO & RUL
    iso_color = "#10B981" if diag["iso_zone"] in ["Zone A", "Zone B"] else ("#F59E0B" if diag["iso_zone"] == "Zone C" else "#EF4444")
    
    diag_html = (
        f"<div style='background:#0F172A; border-left:5px solid {iso_color}; padding:15px; border-radius:8px; margin-bottom:15px;'>"
        f"<h3 style='margin:0 0 8px 0; color:#E2E8F0;'>🔬 Analisis Kognitif Gemini Flash Multimodal & SOP ISO 10816</h3>"
        f"<div style='background:#1E293B; display:inline-block; padding:3px 10px; border-radius:12px; font-size:12px; color:#FBBF24; margin-bottom:8px;'>🔊 Kondisi Kebisingan Terdeteksi: <b>{diag['snr_label']}</b></div>"
        f"<p style='margin:0 0 10px 0; font-size:14px; color:#94A3B8; line-height:1.5;'>{diag['diagnostic_summary']}</p>"
        f"<div style='display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:10px;'>"
        f"  <div style='background:#1E293B; padding:10px; border-radius:6px;'><b>Standar ISO 10816:</b><br><span style='color:{iso_color}; font-size:16px; font-weight:bold;'>{diag['iso_zone']}</span> ({diag['iso_condition']})</div>"
        f"  <div style='background:#1E293B; padding:10px; border-radius:6px;'><b>Akar Masalah:</b><br><span style='color:#38BDF8; font-size:13px; font-weight:bold;'>{diag['defect_type']}</span></div>"
        f"  <div style='background:#1E293B; padding:10px; border-radius:6px;'><b>Estimasi Sisa Umur (RUL):</b><br><span style='color:#FBBF24; font-size:16px; font-weight:bold;'>~{diag['estimated_rul_hours']} Jam</span> Operasi</div>"
        f"</div>"
        f"</div>"
    )
    
    part = diag["recommended_part"]
    part_html = (
        f"<div style='background:#1E293B; padding:12px; border-radius:8px; font-size:13px; color:#E2E8F0;'>"
        f"<b>📦 Rekomendasi Suku Cadang Gudang SAP:</b> {part['part_name']}<br>"
        f"<b>SKU Part:</b> <code>{part['sku']}</code> | <b>Stok Tersedia:</b> <b style='color:#10B981;'>{part['stock']} Unit</b> ({part['location']})<br>"
        f"<b>Estimasi Biaya Penggantian:</b> Rp {part['unit_price_idr']:,}"
        f"</div>"
    )
    
    return diag_html, part_html

def trigger_work_order_dispatch():
    """Menerbitkan tiket Work Order simulasi ERP/SAP."""
    diag = CURRENT_SCAN_STATE.get("diagnosis")
    if not diag:
        diag = cognitive_engine.diagnose_anomaly(
            CURRENT_SCAN_STATE["machine_id"],
            CURRENT_SCAN_STATE["anomaly_score"],
            CURRENT_SCAN_STATE["is_anomaly"],
            CURRENT_SCAN_STATE["crest_factor"]
        )
    wo = cognitive_engine.generate_work_order(diag)
    
    wo_html = (
        f"<div style='background:#064E3B; border:2px solid #34D399; padding:15px; border-radius:10px; color:#ECFDF5;'>"
        f"<h3 style='margin:0 0 5px 0; color:#6EE7B7;'>✅ TIKET WORK ORDER TERBIT: #{wo['work_order_id']}</h3>"
        f"<p style='margin:0; font-size:13px;'>Status: <b>{wo['status']}</b></p>"
        f"<hr style='border:0; border-top:1px solid #065F46; margin:8px 0;'>"
        f"<div style='font-size:13px; line-height:1.6;'>"
        f"• <b>Mesin Target:</b> {wo['machine_id']}<br>"
        f"• <b>Deskripsi Tindakan:</b> Overhaul & Ganti {wo['allocated_part']}<br>"
        f"• <b>Alokasi Gudang:</b> {wo['warehouse_location']} (SKU: {wo['part_sku']})<br>"
        f"• <b>Tim Teknisi Ditugaskan:</b> {wo['assigned_team']}<br>"
        f"• <b>Estimasi Anggaran:</b> {wo['estimated_cost_idr']}"
        f"</div>"
        f"</div>"
    )
    return wo_html

@spaces.GPU
def voice_assistant_qa(user_text):
    """Menjawab pertanyaan suara/teks operator lapangan."""
    ans = cognitive_engine.process_voice_assistant(user_text, CURRENT_SCAN_STATE)
    return ans

def generate_fleet_trend_chart():
    """Menghasilkan grafik garis tren getaran 30 hari armada mesin."""
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 3.8))
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#111827')
    
    days = np.arange(1, 31)
    # Sintesis data getaran historis
    np.random.seed(101)
    fan_trend = 0.02 + 0.001 * days + np.random.normal(0, 0.003, len(days))
    pump_trend = 0.025 + 0.0005 * days + np.random.normal(0, 0.002, len(days))
    slider_trend = 0.015 + 0.0002 * days + np.random.normal(0, 0.001, len(days))
    valve_trend = 0.018 + 0.0003 * days + np.random.normal(0, 0.002, len(days))
    
    # Anomali di hari terakhir pada fan
    if CURRENT_SCAN_STATE["is_anomaly"] and CURRENT_SCAN_STATE["machine_id"] == "FAN_ID_00":
        fan_trend[-1] = CURRENT_SCAN_STATE["anomaly_score"]
        
    ax.plot(days, fan_trend, label='Fan #00 (Blower)', color='#38BDF8', lw=2)
    ax.plot(days, pump_trend, label='Pump #01 (Centrifugal)', color='#10B981', lw=1.5)
    ax.plot(days, slider_trend, label='Slider #02 (Guide Rail)', color='#A78BFA', lw=1.5)
    ax.plot(days, valve_trend, label='Valve #03 (Solenoid)', color='#FBBF24', lw=1.5)
    ax.axhline(y=0.050, color='#EF4444', linestyle='--', label='Anomaly Threshold (0.050)', alpha=0.8)
    
    ax.set_title("📈 30-Day Fleet Vibration Degradation Trend", fontsize=11, fontweight='bold', color='#F1F5F9')
    ax.set_xlabel("Days of Month", fontsize=9, color='#94A3B8')
    ax.set_ylabel("Acoustic Anomaly Score", fontsize=9, color='#94A3B8')
    ax.grid(True, linestyle='--', alpha=0.2, color='#64748B')
    ax.legend(fontsize=8, loc='upper left')
    plt.tight_layout()
    return fig

def fetch_blockchain_passport(machine_id):
    """Mengambil riwayat inspeksi dari Smart Contract Polygon Amoy."""
    records = hf_blockchain_service.get_machine_history(machine_id)
    table_rows = []
    for r in records:
        table_rows.append([
            f"{r['timestamp']}",
            f"{r['anomaly_score']:.4f}",
            r['status'],
            r['defect_type'],
            r['data_hash'][:14] + "...",
            r['inspector'][:10] + "..."
        ])
    return table_rows

def submit_parametric_claim(machine_id, claim_reason):
    """Mengajukan klaim garansi otomatis berbasis histori inspeksi on-chain."""
    claim_res = hf_blockchain_service.file_warranty_claim(machine_id, claim_reason)
    badge_col = "#10B981" if claim_res["is_approved"] else "#F59E0B"
    return (
        f"<div style='background:#1E293B; border:2px solid {badge_col}; padding:15px; border-radius:10px; color:#F8FAFC;'>"
        f"<h3 style='margin:0 0 5px 0; color:{badge_col};'>📋 ID Klaim: {claim_res['claim_id']} — {claim_res['status']}</h3>"
        f"<p style='margin:0 0 8px 0; font-size:13px;'>Mesin: <b>{claim_res['machine_id']}</b> | Kepatuhan Inspeksi On-Chain: <b>{claim_res['inspection_compliance_count']} Log Tercatat</b></p>"
        f"<p style='margin:0; font-size:13px; color:#94A3B8;'>{claim_res['resolution_note']}</p>"
        f"</div>"
    )

# =====================================================================
# GRADIO INTERFACE LAYOUT (HIGH-TECH INDUSTRIAL THEME)
# =====================================================================

custom_css = """
#app-container { max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; }
.gr-button-primary { background: linear-gradient(135deg, #059669 0%, #10B981 100%) !important; border: none !important; color: white !important; font-weight: 600 !important; }
.gr-button-secondary { background: #1E293B !important; border: 1px solid #334155 !important; color: #E2E8F0 !important; }
.stat-card { background: #1E293B; border: 1px solid #334155; border-radius: 8px; padding: 15px; text-align: center; }
"""

with gr.Blocks(title="EchoFactory - Industrial AI & Blockchain Passport", css=custom_css) as demo:
    gr.HTML(
        """
        <div style='background: linear-gradient(90deg, #0F172A 0%, #1E293B 100%); padding: 20px 25px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 15px;'>
            <div style='display: flex; justify-content: space-between; align-items: center;'>
                <div>
                    <h1 style='margin: 0; color: #38BDF8; font-size: 24px; font-weight: 800; display: flex; align-items: center; gap: 8px;'>
                        🏭 ECHOFACTORY <span style='font-size: 13px; background: #065F46; color: #34D399; padding: 3px 8px; border-radius: 20px;'>COMPFEST 18 AIC</span>
                    </h1>
                    <p style='margin: 5px 0 0 0; color: #94A3B8; font-size: 13px;'>Acoustic Machine Intelligence & Tamper-Proof Health Passport (Polygon Amoy Testnet)</p>
                </div>
                <div style='text-align: right;'>
                    <span style='background: #0284C7; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;'>STgram-MFN v3</span>
                    <span style='background: #7C3AED; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-left: 5px;'>Gemini Multimodal</span>
                    <span style='background: #059669; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-left: 5px;'>Web3 Amoy</span>
                </div>
            </div>
        </div>
        """
    )

    with gr.Tabs():
        
        # -------------------------------------------------------------
        # TAB 1: OPERATOR INGESTION & SCANNER (UC-01 & UC-02)
        # -------------------------------------------------------------
        with gr.TabItem("📱 1. Pindai Suara Mesin (Operator)"):
            with gr.Row():
                with gr.Column(scale=5):
                    machine_select = gr.Dropdown(
                        label="Pilih Unit Mesin Pabrik",
                        choices=[
                            "🤖 AUTO-DETECT (Otomatis Deteksi Mesin & Noise SNR)",
                            "FAN_ID_00 (Industrial Blower)",
                            "PUMP_ID_01 (Centrifugal Pump)",
                            "SLIDER_ID_02 (Linear Guide Rail)",
                            "VALVE_ID_03 (Solenoid Valve)"
                        ],
                        value="🤖 AUTO-DETECT (Otomatis Deteksi Mesin & Noise SNR)"
                    )
                    
                    gr.HTML(
                        """
                        <div style='background:#1E293B; border-left:4px solid #38BDF8; padding:10px 14px; border-radius:6px; margin:10px 0; font-size:13px; color:#CBD5E1;'>
                            <b>💡 3 Pilihan Input Suara Mesin:</b><br>
                            • <b>Rekam Mikrofon</b>: Klik tombol mikrofon di bawah untuk merekam langsung suara mesin fisik.<br>
                            • <b>Upload File Sendiri</b>: Klik dropzone untuk mengunggah file rekaman Anda (.wav / .mp3).<br>
                            • <b>Sampel Demo Instan</b>: Klik tombol preset di bawah untuk uji coba cepat.
                        </div>
                        """
                    )
                    
                    gr.Markdown("#### 🎵 Preset Sampel Demo Cepat (1-Klik):")
                    with gr.Row():
                        btn_fan_norm = gr.Button("🌀 Fan Normal", size="sm", variant="secondary")
                        btn_fan_anom = gr.Button("🌀 Fan Anomali (BPFI Fault)", size="sm", variant="secondary")
                    with gr.Row():
                        btn_pump_norm = gr.Button("🚰 Pump Normal", size="sm", variant="secondary")
                        btn_pump_anom = gr.Button("🚰 Pump Anomali (Kavitasi)", size="sm", variant="secondary")
                    with gr.Row():
                        btn_slider_anom = gr.Button("🎚️ Slider Anomali (Friksi Rel)", size="sm", variant="secondary")
                        btn_valve_anom = gr.Button("⛽ Valve Anomali (Kebocoran)", size="sm", variant="secondary")
                    
                    audio_input = gr.Audio(
                        sources=["microphone", "upload"],
                        type="filepath",
                        label="🎙️ Rekam Mikrofon Langsung / 📁 Upload File Audio Mesin (WAV/MP3)",
                        show_download_button=True
                    )
                    
                    btn_scan = gr.Button("⚡ Mulai Analisis Akustik AI (<50ms)", variant="primary", size="lg")

                with gr.Column(scale=7):
                    decision_badge = gr.HTML(
                        "<div style='background:#1E293B; padding:15px; border-radius:10px; color:#94A3B8; text-align:center;'>Tekan tombol 'Mulai Analisis Akustik AI' untuk memproses audio mesin.</div>"
                    )
                    plot_output = gr.Plot(label="Spektrogram & Analisis Spektrum Frekuensi")
                    bc_badge = gr.HTML("<div style='color:#64748B; font-size:12px;'>Blockchain ledger siap menerima hash audit.</div>")

            gr.Markdown("---")
            gr.Markdown("#### 🎙️ Industrial Voice Assistant (Hands-Free Q&A Teknisi):")
            with gr.Row():
                voice_query = gr.Textbox(
                    label="Tanya Voice Assistant (Teks / Prompt Lisan)",
                    placeholder="Contoh: 'Echo, bagaimana kondisi vibrasi Fan 00 sekarang?'",
                    scale=8
                )
                btn_voice = gr.Button("Tanya Echo", variant="primary", scale=2)
            voice_response = gr.Textbox(label="Jawaban Voice Assistant", lines=2)

        # -------------------------------------------------------------
        # TAB 2: SUPERVISOR COGNITIVE DIAGNOSTIC (UC-04 & UC-05)
        # -------------------------------------------------------------
        with gr.TabItem("🔬 2. Diagnosis Multimodal & Work Order"):
            gr.Markdown("### 🧠 Cognitive Diagnostic Core (Gemini Flash + SOP RAG ISO 10816)")
            btn_run_diag = gr.Button("🔬 Jalankan Root Cause Reasoning & Estimasi RUL", variant="primary")
            
            diag_output_html = gr.HTML(
                "<div style='background:#1E293B; padding:20px; border-radius:8px; color:#94A3B8;'>Jalankan diagnosis untuk melihat akar masalah mekanik dan standar keparahan getaran ISO 10816.</div>"
            )
            part_output_html = gr.HTML()
            
            gr.Markdown("---")
            gr.Markdown("### 📋 Eksekusi Tiket Perbaikan ERP/SAP")
            btn_dispatch_wo = gr.Button("🚀 Setujui & Terbitkan Work Order Resmi ke Teknisi Shift", variant="primary")
            wo_output_html = gr.HTML()

        # -------------------------------------------------------------
        # TAB 3: PLANT MANAGER FLEET HEALTH (UC-06)
        # -------------------------------------------------------------
        with gr.TabItem("📊 3. Dasbor Armada Pabrik & ROI"):
            gr.Markdown("### 🏭 Fleet Health Monitoring & Financial Downtime Avoided")
            with gr.Row():
                with gr.Column(scale=3):
                    gr.HTML(
                        """
                        <div style='display:flex; flex-direction:column; gap:10px;'>
                            <div class='stat-card'>
                                <span style='font-size:12px; color:#94A3B8;'>FLEET RELIABILITY INDEX</span><br>
                                <b style='font-size:24px; color:#10B981;'>97.8%</b>
                            </div>
                            <div class='stat-card'>
                                <span style='font-size:12px; color:#94A3B8;'>DOWNTIME PREVENTED</span><br>
                                <b style='font-size:24px; color:#38BDF8;'>14.2 Jam</b>
                            </div>
                            <div class='stat-card'>
                                <span style='font-size:12px; color:#94A3B8;'>ESTIMATED COST SAVINGS</span><br>
                                <b style='font-size:22px; color:#FBBF24;'>Rp 284.000.000,-</b>
                            </div>
                        </div>
                        """
                    )
                with gr.Column(scale=9):
                    fleet_plot = gr.Plot(value=generate_fleet_trend_chart(), label="Grafik Tren Degradasi Akustik 30 Hari")

        # -------------------------------------------------------------
        # TAB 4: BLOCKCHAIN PASSPORT & WARRANTY (UC-07 & UC-08)
        # -------------------------------------------------------------
        with gr.TabItem("⛓️ 4. Paspor On-Chain & Klaim Garansi"):
            gr.Markdown("### 🔐 Paspor Kesehatan Mesin Terdesentralisasi (Polygon Amoy Testnet)")
            with gr.Row():
                bc_machine_select = gr.Dropdown(
                    label="Pilih Machine ID untuk Verifikasi Paspor On-Chain",
                    choices=["FAN_ID_00", "PUMP_ID_01", "SLIDER_ID_02", "VALVE_ID_03"],
                    value="FAN_ID_00",
                    scale=8
                )
                btn_fetch_bc = gr.Button("🔍 Query Smart Contract", variant="primary", scale=4)

            passport_table = gr.Dataframe(
                headers=["Timestamp", "Score", "Status", "Defect Type", "SHA-256 Hash", "Inspector Address"],
                datatype=["str", "str", "str", "str", "str", "str"],
                label="Riwayat Log Inspeksi On-Chain (Tamper-Proof Ledger)"
            )

            gr.Markdown("---")
            gr.Markdown("### 📝 Portal Klaim Garansi Parametrik Otomatis")
            with gr.Row():
                claim_reason_input = gr.Textbox(
                    label="Deskripsi Klaim Kerusakan Mesin",
                    placeholder="Contoh: Terdeteksi degradasi bantalan dini setelah 1200 jam operasi rutin.",
                    scale=8
                )
                btn_submit_claim = gr.Button("Ajukan Klaim Garansi", variant="primary", scale=4)
            claim_output_html = gr.HTML()

    # =====================================================================
    # EVENT BINDINGS
    # =====================================================================
    
    # 1. Demo Audio Buttons
    btn_fan_norm.click(lambda: load_demo_audio("DEMO_FAN_NORMAL.wav", "FAN_ID_00"), outputs=[audio_input, machine_select])
    btn_fan_anom.click(lambda: load_demo_audio("DEMO_FAN_ANOMALY.wav", "FAN_ID_00"), outputs=[audio_input, machine_select])
    btn_pump_norm.click(lambda: load_demo_audio("DEMO_PUMP_NORMAL.wav", "PUMP_ID_01"), outputs=[audio_input, machine_select])
    btn_pump_anom.click(lambda: load_demo_audio("DEMO_PUMP_ANOMALY.wav", "PUMP_ID_01"), outputs=[audio_input, machine_select])
    btn_slider_anom.click(lambda: load_demo_audio("DEMO_SLIDER_ANOMALY.wav", "SLIDER_ID_02"), outputs=[audio_input, machine_select])
    btn_valve_anom.click(lambda: load_demo_audio("DEMO_VALVE_ANOMALY.wav", "VALVE_ID_03"), outputs=[audio_input, machine_select])

    # 2. Process Scan
    btn_scan.click(
        process_audio_scan,
        inputs=[audio_input, machine_select],
        outputs=[plot_output, decision_badge, bc_badge]
    )

    # 3. Voice Assistant
    btn_voice.click(voice_assistant_qa, inputs=[voice_query], outputs=[voice_response])

    # 4. Supervisor Diagnostic & Work Order
    btn_run_diag.click(lambda: run_deep_diagnostic(CURRENT_SCAN_STATE["machine_id"]), outputs=[diag_output_html, part_output_html])
    btn_dispatch_wo.click(trigger_work_order_dispatch, outputs=[wo_output_html])

    # 5. Blockchain Passport & Warranty
    btn_fetch_bc.click(fetch_blockchain_passport, inputs=[bc_machine_select], outputs=[passport_table])
    btn_submit_claim.click(submit_parametric_claim, inputs=[bc_machine_select, claim_reason_input], outputs=[claim_output_html])

if __name__ == "__main__":
    demo.queue().launch(
        server_name="0.0.0.0",
        server_port=7860,
        show_api=False
    )
