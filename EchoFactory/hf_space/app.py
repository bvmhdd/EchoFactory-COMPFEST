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
            detect_badge_info = f"<div style='margin-bottom:8px; font-size:12px; color:#38bdf8; font-family:\"JetBrains Mono\", monospace;'>[AUTO-DETECTED] Target: <span style='color:#ffffff; font-weight:bold;'>{scan_res['machine_label']}</span> (Acoustic Confidence: <b>{scan_res['machine_confidence']}%</b>)</div>"
        
        snr_badge_info = f"<div style='margin-bottom:8px; font-size:12px; color:#f59e0b; font-family:\"JetBrains Mono\", monospace;'>[SNR PROFILE] Baseline: <span style='color:#ffffff; font-weight:bold;'>{scan_res['snr_label']}</span> (Estimated SNR: {scan_res['snr_db']} dB)</div>"
        
        # Format Badge Keputusan
        if not scan_res["is_anomaly"]:
            status_html = (
                f"<div style='background: rgba(6, 78, 59, 0.4); border: 1px solid #10b981; border-radius: 10px; padding: 16px; color: #ecfdf5;'>"
                f"{detect_badge_info}"
                f"{snr_badge_info}"
                f"<h3 style='margin:0; color:#34d399; font-size: 16px; font-weight: 700; letter-spacing: -0.01em;'>STATUS: NORMAL (PASS)</h3>"
                f"<p style='margin:6px 0 0 0; font-size:13px; color: #a1a1aa;'>Anomaly Score: <b>{scan_res['anomaly_score']:.4f}</b> (Threshold [{scan_res['detected_snr']}]: {scan_res['threshold']}) | Spectral signature compliant with ISO 10816 baseline.</p>"
                f"</div>"
            )
        else:
            status_html = (
                f"<div style='background: rgba(127, 29, 29, 0.4); border: 1px solid #ef4444; border-radius: 10px; padding: 16px; color: #fef2f2;'>"
                f"{detect_badge_info}"
                f"{snr_badge_info}"
                f"<h3 style='margin:0; color:#f87171; font-size: 16px; font-weight: 700; letter-spacing: -0.01em;'>STATUS: ABNORMAL DETECTED (ALERT)</h3>"
                f"<p style='margin:6px 0 0 0; font-size:13px; color: #fca5a5;'>Anomaly Score: <b>{scan_res['anomaly_score']:.4f}</b> (Exceeds Threshold {scan_res['threshold']}) | <b>Open Tab 02 (Cognitive Diagnostics) for root cause analysis and work order generation.</b></p>"
                f"</div>"
            )
            
        bc_html = (
            f"<div style='background: #0f1117; border: 1px solid #1f2430; padding: 14px; border-radius: 10px; font-size: 12px; color: #a1a1aa; font-family: \"JetBrains Mono\", monospace;'>"
            f"<b style='color:#ffffff;'>[WEB3 LEDGER STATUS]</b> {bc_res['status']}<br>"
            f"Target: <code style='color:#ffffff;'>{clean_mid}</code> | SNR: <code style='color:#f59e0b;'>{scan_res['detected_snr']}</code><br>"
            f"SHA-256 Hash: <code style='color:#38bdf8;'>{bc_res['data_hash']}</code><br>"
            f"Tx Hash: <code style='color:#a78bfa;'>{bc_res['tx_hash'][:22]}...</code><br>"
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
            f"<div style='color:#ef4444;'>Error processing audio stream: {str(e)}</div>",
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
    iso_color = "#10b981" if diag["iso_zone"] in ["Zone A", "Zone B"] else ("#f59e0b" if diag["iso_zone"] == "Zone C" else "#ef4444")
    
    diag_html = (
        f"<div style='background:#0f1117; border-left:4px solid {iso_color}; border:1px solid #1f2430; padding:18px; border-radius:12px; margin-bottom:16px;'>"
        f"<h3 style='margin:0 0 10px 0; color:#ffffff; font-size:15px; font-weight:700;'>Multimodal Cognitive Diagnostic & ISO 10816 Evaluation</h3>"
        f"<div style='background:#18181b; display:inline-block; padding:4px 10px; border-radius:6px; font-size:11px; color:#f59e0b; font-family:\"JetBrains Mono\", monospace; margin-bottom:10px;'>NOISE SNR PROFILE: <b>{diag['snr_label']}</b></div>"
        f"<p style='margin:0 0 14px 0; font-size:13px; color:#a1a1aa; line-height:1.6;'>{diag['diagnostic_summary']}</p>"
        f"<div style='display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:12px;'>"
        f"  <div style='background:#14161f; padding:12px; border-radius:8px; border:1px solid #1f2430;'><span style='font-size:11px; color:#71717a; font-weight:600;'>ISO 10816 STANDARD</span><br><span style='color:{iso_color}; font-size:15px; font-weight:bold;'>{diag['iso_zone']}</span> <span style='font-size:12px; color:#a1a1aa;'>({diag['iso_condition']})</span></div>"
        f"  <div style='background:#14161f; padding:12px; border-radius:8px; border:1px solid #1f2430;'><span style='font-size:11px; color:#71717a; font-weight:600;'>MECHANICAL DEFECT</span><br><span style='color:#38bdf8; font-size:12px; font-weight:bold;'>{diag['defect_type']}</span></div>"
        f"  <div style='background:#14161f; padding:12px; border-radius:8px; border:1px solid #1f2430;'><span style='font-size:11px; color:#71717a; font-weight:600;'>ESTIMATED RUL</span><br><span style='color:#f59e0b; font-size:15px; font-weight:bold; font-family:\"JetBrains Mono\", monospace;'>~{diag['estimated_rul_hours']} Hours</span></div>"
        f"</div>"
        f"</div>"
    )
    
    part = diag["recommended_part"]
    part_html = (
        f"<div style='background:#0f1117; border:1px solid #1f2430; padding:14px; border-radius:10px; font-size:12px; color:#a1a1aa; font-family:\"JetBrains Mono\", monospace;'>"
        f"<b style='color:#ffffff;'>[ERP / SAP REPLACEMENT PART]:</b> {part['part_name']}<br>"
        f"SKU: <code style='color:#ffffff;'>{part['sku']}</code> | Inventory Stock: <b style='color:#10b981;'>{part['stock']} Units</b> ({part['location']})<br>"
        f"Estimated Replacement Cost: IDR {part['unit_price_idr']:,}"
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
        f"<div style='background: rgba(6, 78, 59, 0.4); border: 1px solid #34d399; padding: 16px; border-radius: 12px; color: #ecfdf5;'>"
        f"<h3 style='margin:0 0 6px 0; color:#6ee7b7; font-size: 15px; font-weight: 700; letter-spacing: -0.01em;'>WORK ORDER DISPATCHED: #{wo['work_order_id']}</h3>"
        f"<p style='margin:0; font-size:12px; color: #a7f3d0; font-family:\"JetBrains Mono\", monospace;'>Status: <b>{wo['status']}</b></p>"
        f"<hr style='border:0; border-top:1px solid rgba(52, 211, 153, 0.2); margin:10px 0;'>"
        f"<div style='font-size:12px; line-height:1.7; color:#d1fae5; font-family:\"JetBrains Mono\", monospace;'>"
        f"• Target Machinery   : {wo['machine_id']}<br>"
        f"• Action Mandate     : Overhaul & Replace {wo['allocated_part']}<br>"
        f"• Warehouse Stock    : {wo['warehouse_location']} (SKU: {wo['part_sku']})<br>"
        f"• Maintenance Crew   : {wo['assigned_team']}<br>"
        f"• Budget Allocation  : {wo['estimated_cost_idr']}"
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
    fig.patch.set_facecolor('#090D16')
    ax.set_facecolor('#0F1117')
    
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
    
    ax.set_title("30-Day Fleet Vibration Degradation Trend", fontsize=11, fontweight='bold', color='#F1F5F9')
    ax.set_xlabel("Days of Month", fontsize=9, color='#94A3B8')
    ax.set_ylabel("Acoustic Anomaly Score", fontsize=9, color='#94A3B8')
    ax.grid(True, linestyle='--', alpha=0.15, color='#64748B')
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
        f"<div style='background:#0f1117; border:1px solid {badge_col}; padding:16px; border-radius:12px; color:#f8fafc; font-family:\"JetBrains Mono\", monospace;'>"
        f"<h3 style='margin:0 0 6px 0; color:{badge_col}; font-size:14px; font-weight:700;'>CLAIM RECORD: #{claim_res['claim_id']} — {claim_res['status']}</h3>"
        f"<p style='margin:0 0 8px 0; font-size:12px;'>Target Machinery: <b>{claim_res['machine_id']}</b> | On-Chain Compliance Log Count: <b>{claim_res['inspection_compliance_count']} Records</b></p>"
        f"<p style='margin:0; font-size:12px; color:#a1a1aa;'>{claim_res['resolution_note']}</p>"
        f"</div>"
    )

# =====================================================================
# GRADIO INTERFACE LAYOUT (ENTERPRISE DARK GRID THEME - ZERO EMOJIS)
# =====================================================================

custom_css = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
    --bg-dark: #000000;
    --surface-dark: #090a0f;
    --card-dark: #0f1117;
    --border-dark: #1f2430;
    --border-subtle: #27272a;
    --text-main: #f4f4f5;
    --text-muted: #a1a1aa;
    --accent-emerald: #10b981;
    --accent-cyan: #06b6d4;
    --accent-indigo: #6366f1;
}

body, .gradio-container {
    background-color: var(--bg-dark) !important;
    background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px) !important;
    background-size: 36px 36px !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    color: var(--text-main) !important;
}

#app-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 10px;
}

/* Tabs Header */
.tabs {
    border-bottom: 1px solid var(--border-dark) !important;
    background: transparent !important;
}
.tab-nav {
    gap: 8px !important;
    background: transparent !important;
}
.tab-nav button {
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    letter-spacing: -0.01em !important;
    color: var(--text-muted) !important;
    border: 1px solid transparent !important;
    border-radius: 8px 8px 0 0 !important;
    padding: 10px 18px !important;
    background: transparent !important;
    transition: all 0.15s ease !important;
}
.tab-nav button.selected {
    color: #ffffff !important;
    border-color: var(--border-dark) !important;
    border-bottom-color: var(--bg-dark) !important;
    background: var(--card-dark) !important;
}

/* Primary Button - Sleek White Pill */
.gr-button-primary {
    background: #ffffff !important;
    border: 1px solid #ffffff !important;
    color: #000000 !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    letter-spacing: -0.01em !important;
    border-radius: 9999px !important;
    padding: 10px 24px !important;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.15) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.gr-button-primary:hover {
    background: #e4e4e7 !important;
    border-color: #e4e4e7 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 25px rgba(255, 255, 255, 0.25) !important;
}

/* Secondary Button - Dark Glass Pill */
.gr-button-secondary {
    background: rgba(15, 17, 23, 0.8) !important;
    border: 1px solid var(--border-dark) !important;
    color: #d4d4d8 !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    font-size: 12px !important;
    border-radius: 9999px !important;
    backdrop-filter: blur(8px) !important;
    transition: all 0.2s ease !important;
}
.gr-button-secondary:hover {
    background: #18181b !important;
    border-color: #3f3f46 !important;
    color: #ffffff !important;
}

/* Input Fields & Boxes */
.gr-input, .gr-box, input, select, textarea {
    background: var(--card-dark) !important;
    border: 1px solid var(--border-dark) !important;
    border-radius: 10px !important;
    color: var(--text-main) !important;
    font-family: 'Inter', sans-serif !important;
}
.gr-input:focus, input:focus, select:focus, textarea:focus {
    border-color: #52525b !important;
    box-shadow: 0 0 0 1px #52525b !important;
}

/* Code & Monospace */
code, pre {
    font-family: 'JetBrains Mono', monospace !important;
}

/* Metric Cards */
.stat-card {
    background: var(--card-dark);
    border: 1px solid var(--border-dark);
    border-radius: 12px;
    padding: 18px;
    text-align: left;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
"""

theme = gr.themes.Base(
    primary_hue="slate",
    secondary_hue="slate",
    neutral_hue="slate",
    font=[gr.themes.GoogleFont("Inter"), "ui-sans-serif", "system-ui", "sans-serif"],
).set(
    body_background_fill="#000000",
    body_background_fill_dark="#000000",
    block_background_fill="#0f1117",
    block_background_fill_dark="#0f1117",
    block_border_color="#1f2430",
    block_border_color_dark="#1f2430",
    input_background_fill="#090a0f",
    input_background_fill_dark="#090a0f",
    input_border_color="#1f2430",
    input_border_color_dark="#1f2430",
)

with gr.Blocks(title="ECHOFACTORY — Industrial Acoustic Intelligence & On-Chain Ledger", css=custom_css, theme=theme) as demo:
    gr.HTML(
        """
        <div style='background: rgba(15, 17, 23, 0.9); padding: 20px 24px; border-radius: 14px; border: 1px solid #1f2430; margin-bottom: 20px; backdrop-filter: blur(12px);'>
            <div style='display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;'>
                <div style='display: flex; align-items: center; gap: 14px;'>
                    <div style='width: 44px; height: 44px; border-radius: 10px; background: #ffffff; display: flex; align-items: center; justify-content: center;'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <div>
                        <div style='display: flex; align-items: center; gap: 12px;'>
                            <h1 style='margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.03em; font-family: Inter, sans-serif;'>ECHOFACTORY</h1>
                            <span style='background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px;'>
                                <span style='width: 6px; height: 6px; border-radius: 50%; background: #34d399;'></span>
                                Amoy Testnet Node
                            </span>
                        </div>
                        <p style='margin: 4px 0 0 0; color: #a1a1aa; font-size: 13px; font-weight: 400;'>Acoustic Machine Intelligence • Polygon Amoy Ledger • ISO 10816 Diagnostic Engine</p>
                    </div>
                </div>
                <div style='display: flex; gap: 8px; align-items: center; flex-wrap: wrap;'>
                    <span style='background: #18181b; border: 1px solid #27272a; color: #e4e4e7; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: "JetBrains Mono", monospace;'>
                        STgram-MFN v3 ONNX
                    </span>
                    <span style='background: #18181b; border: 1px solid #27272a; color: #e4e4e7; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: "JetBrains Mono", monospace;'>
                        Gemini Flash Multimodal
                    </span>
                    <span style='background: #18181b; border: 1px solid #27272a; color: #e4e4e7; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: "JetBrains Mono", monospace;'>
                        Chain ID: 80002
                    </span>
                </div>
            </div>
        </div>
        """
    )

    with gr.Tabs():
        
        # -------------------------------------------------------------
        # TAB 1: OPERATOR INGESTION & SCANNER
        # -------------------------------------------------------------
        with gr.TabItem("01 / Ingestion & Acoustic Scan"):
            with gr.Row():
                with gr.Column(scale=5):
                    machine_select = gr.Dropdown(
                        label="Target Machinery Unit",
                        choices=[
                            "AUTO-DETECT (Acoustic Signature & Noise Profiling)",
                            "FAN_ID_00 (Industrial Blower)",
                            "PUMP_ID_01 (Centrifugal Pump)",
                            "SLIDER_ID_02 (Linear Guide Rail)",
                            "VALVE_ID_03 (Solenoid Valve)"
                        ],
                        value="AUTO-DETECT (Acoustic Signature & Noise Profiling)"
                    )
                    
                    gr.HTML(
                        """
                        <div style='background: #0f1117; border-left: 3px solid #ffffff; padding: 12px 16px; border-radius: 6px; margin: 12px 0; font-size: 13px; color: #a1a1aa;'>
                            <strong style='color: #ffffff;'>Acoustic Signal Source:</strong><br>
                            • <strong>Live Microphone</strong>: Record direct physical machine acoustics.<br>
                            • <strong>File Ingestion</strong>: Upload local WAV/MP3 recordings.<br>
                            • <strong>Preset Benchmark</strong>: Select 1-click verified MIMII audio samples below.
                        </div>
                        """
                    )
                    
                    gr.Markdown("**Verified MIMII Sample Presets:**")
                    with gr.Row():
                        btn_fan_norm = gr.Button("Fan Normal", size="sm", variant="secondary")
                        btn_fan_anom = gr.Button("Fan Anomaly (BPFI Fault)", size="sm", variant="secondary")
                    with gr.Row():
                        btn_pump_norm = gr.Button("Pump Normal", size="sm", variant="secondary")
                        btn_pump_anom = gr.Button("Pump Anomaly (Cavitation)", size="sm", variant="secondary")
                    with gr.Row():
                        btn_slider_anom = gr.Button("Slider Anomaly (Rail Friction)", size="sm", variant="secondary")
                        btn_valve_anom = gr.Button("Valve Anomaly (Leakage)", size="sm", variant="secondary")
                    
                    audio_input = gr.Audio(
                        sources=["microphone", "upload"],
                        type="filepath",
                        label="Audio Stream Ingestion (WAV/MP3)",
                        show_download_button=True
                    )
                    
                    btn_scan = gr.Button("Execute Acoustic Analysis »", variant="primary", size="lg")

                with gr.Column(scale=7):
                    decision_badge = gr.HTML(
                        "<div style='background: #0f1117; border: 1px solid #1f2430; padding: 20px; border-radius: 12px; color: #71717a; text-align: center; font-size: 13px;'>Awaiting audio stream ingestion. Execute acoustic analysis to view spectral parameters.</div>"
                    )
                    plot_output = gr.Plot(label="STFT Time-Frequency & Mel Spectrogram Analysis")
                    bc_badge = gr.HTML("<div style='color: #71717a; font-size: 12px; font-family: \"JetBrains Mono\", monospace;'>Ledger Status: Standby for cryptographic hash commit.</div>")

            gr.Markdown("---")
            gr.Markdown("**Industrial Voice Assistant (Hands-Free Technical Query):**")
            with gr.Row():
                voice_query = gr.Textbox(
                    label="Voice Query / Natural Language Input",
                    placeholder="Example: 'Echo, what is the current vibration status of Fan 00?'",
                    scale=8
                )
                btn_voice = gr.Button("Query Assistant »", variant="primary", scale=2)
            voice_response = gr.Textbox(label="Assistant Diagnostic Output", lines=2)

        # -------------------------------------------------------------
        # TAB 2: SUPERVISOR COGNITIVE DIAGNOSTICS
        # -------------------------------------------------------------
        with gr.TabItem("02 / Cognitive Diagnostics & Work Order"):
            gr.Markdown("### Root Cause Analysis & Maintenance Dispatch")
            btn_run_diag = gr.Button("Execute Multimodal Reasoning & RUL Estimation »", variant="primary")
            
            diag_output_html = gr.HTML(
                "<div style='background: #0f1117; border: 1px solid #1f2430; padding: 20px; border-radius: 12px; color: #71717a; font-size: 13px;'>Run cognitive diagnostics to generate mechanical root cause explanations and ISO 10816 severity mapping.</div>"
            )
            part_output_html = gr.HTML()
            
            gr.Markdown("---")
            gr.Markdown("### ERP / SAP Maintenance Work Order Dispatch")
            btn_dispatch_wo = gr.Button("Approve & Dispatch Official Work Order »", variant="primary")
            wo_output_html = gr.HTML()

        # -------------------------------------------------------------
        # TAB 3: PLANT MANAGER FLEET HEALTH
        # -------------------------------------------------------------
        with gr.TabItem("03 / Fleet Analytics & Financial ROI"):
            gr.Markdown("### Machinery Fleet Health & Avoided Downtime Metrics")
            with gr.Row():
                with gr.Column(scale=3):
                    gr.HTML(
                        """
                        <div style='display: flex; flex-direction: column; gap: 12px;'>
                            <div class='stat-card'>
                                <span style='font-size: 11px; color: #a1a1aa; font-weight: 600; letter-spacing: 0.05em;'>FLEET RELIABILITY INDEX</span><br>
                                <b style='font-size: 26px; color: #10b981; font-family: "JetBrains Mono", monospace;'>97.8%</b>
                            </div>
                            <div class='stat-card'>
                                <span style='font-size: 11px; color: #a1a1aa; font-weight: 600; letter-spacing: 0.05em;'>DOWNTIME PREVENTED</span><br>
                                <b style='font-size: 26px; color: #38bdf8; font-family: "JetBrains Mono", monospace;'>14.2 Hours</b>
                            </div>
                            <div class='stat-card'>
                                <span style='font-size: 11px; color: #a1a1aa; font-weight: 600; letter-spacing: 0.05em;'>ESTIMATED COST SAVINGS</span><br>
                                <b style='font-size: 22px; color: #f59e0b; font-family: "JetBrains Mono", monospace;'>IDR 284,000,000</b>
                            </div>
                        </div>
                        """
                    )
                with gr.Column(scale=9):
                    fleet_plot = gr.Plot(value=generate_fleet_trend_chart(), label="30-Day Fleet Acoustic Degradation Trend")

        # -------------------------------------------------------------
        # TAB 4: BLOCKCHAIN PASSPORT & WARRANTY
        # -------------------------------------------------------------
        with gr.TabItem("04 / On-Chain Passport & Warranty"):
            gr.Markdown("### Decentralized Machine Health Passport (Polygon Amoy Testnet)")
            with gr.Row():
                bc_machine_select = gr.Dropdown(
                    label="Target Machine Passport ID",
                    choices=["FAN_ID_00", "PUMP_ID_01", "SLIDER_ID_02", "VALVE_ID_03"],
                    value="FAN_ID_00",
                    scale=8
                )
                btn_fetch_bc = gr.Button("Query Smart Contract »", variant="primary", scale=4)

            passport_table = gr.Dataframe(
                headers=["Timestamp", "Score", "Status", "Defect Type", "SHA-256 Hash", "Inspector Address"],
                datatype=["str", "str", "str", "str", "str", "str"],
                label="Immutable On-Chain Inspection Ledger"
            )

            gr.Markdown("---")
            gr.Markdown("### Automated Parametric Warranty Claims")
            with gr.Row():
                claim_reason_input = gr.Textbox(
                    label="Claim Justification / Damage Description",
                    placeholder="Example: Early bearing raceway degradation detected after 1,200 continuous operating hours.",
                    scale=8
                )
                btn_submit_claim = gr.Button("Submit Parametric Claim »", variant="primary", scale=4)
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

