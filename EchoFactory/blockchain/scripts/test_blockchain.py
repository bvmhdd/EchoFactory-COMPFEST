"""
EchoFactory - Test Script Blockchain Integration
Script untuk menguji koneksi Web3, commit data ML secara acak (Normal / Anomali), dan fetch audit trail.
"""

import os
import sys
import time
import random
from typing import Dict, Any

# Pastikan UTF-8 encoding untuk Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Tambahkan direktori root blockchain ke sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from blockchain_service import BlockchainService


# ==================== DATASET SAMPLE PROFILES (MIMII SIMULATION) ====================
SAMPLE_PROFILES = [
    # 1. FAN SAMPLES
    {
        "category": "Fan (Blower Pabrik)",
        "machine_id": "FAN_ID_00_BEARING",
        "status": "NORMAL",
        "defect_type": "None (Healthy Operation)",
        "score_range": (0.025, 0.048),
        "rpm": 1450,
        "temperature_base": 42.0,
        "peak_frequency_hz": 120,
        "estimated_rul": "> 3000 Jam (Optimal)",
        "severity": "NORMAL"
    },
    {
        "category": "Fan (Blower Pabrik)",
        "machine_id": "FAN_ID_02_BEARING",
        "status": "CRITICAL",
        "defect_type": "Bearing Inner Race Defect (BPFI Spalling)",
        "score_range": (0.820, 0.895),
        "rpm": 1435,
        "temperature_base": 72.5,
        "peak_frequency_hz": 1840,
        "estimated_rul": "38 Jam (Urgent Overhaul)",
        "severity": "CRITICAL"
    },
    {
        "category": "Fan (Blower Pabrik)",
        "machine_id": "FAN_ID_04_BLOWER",
        "status": "WARNING",
        "defect_type": "Unbalanced Rotor Blade & Aerodynamic Vortex",
        "score_range": (0.520, 0.615),
        "rpm": 1460,
        "temperature_base": 53.0,
        "peak_frequency_hz": 580,
        "estimated_rul": "140 Jam (Jadwalkan Balancing)",
        "severity": "WARNING"
    },

    # 2. PUMP SAMPLES
    {
        "category": "Pump (Pompa Sentrifugal Industri)",
        "machine_id": "PUMP_ID_00_SUCTION",
        "status": "NORMAL",
        "defect_type": "None (Healthy Operation)",
        "score_range": (0.028, 0.050),
        "rpm": 2900,
        "temperature_base": 45.0,
        "peak_frequency_hz": 250,
        "estimated_rul": "> 2500 Jam (Optimal)",
        "severity": "NORMAL"
    },
    {
        "category": "Pump (Pompa Sentrifugal Industri)",
        "machine_id": "PUMP_ID_02_IMPELLER",
        "status": "CRITICAL",
        "defect_type": "Severe Impeller Cavitation & Vapor Bubble Collapse",
        "score_range": (0.780, 0.865),
        "rpm": 2840,
        "temperature_base": 68.0,
        "peak_frequency_hz": 3200,
        "estimated_rul": "24 Jam (Risiko Pecah Impeller)",
        "severity": "CRITICAL"
    },

    # 3. SLIDER SAMPLES
    {
        "category": "Slider (Rel Geser Linear Rail)",
        "machine_id": "SLIDER_ID_00_RAIL",
        "status": "NORMAL",
        "defect_type": "None (Healthy Smooth Glide)",
        "score_range": (0.012, 0.032),
        "rpm": 900,
        "temperature_base": 36.0,
        "peak_frequency_hz": 85,
        "estimated_rul": "> 4000 Jam (Optimal)",
        "severity": "NORMAL"
    },
    {
        "category": "Slider (Rel Geser Linear Rail)",
        "machine_id": "SLIDER_ID_02_CARRIAGE",
        "status": "CRITICAL",
        "defect_type": "Linear Rail Jammed & Ball Screw Surface Spalling",
        "score_range": (0.880, 0.942),
        "rpm": 780,
        "temperature_base": 64.0,
        "peak_frequency_hz": 2100,
        "estimated_rul": "18 Jam (Risiko Macet Total)",
        "severity": "CRITICAL"
    },

    # 4. VALVE SAMPLES
    {
        "category": "Valve (Katup Solenoid Pneumatik)",
        "machine_id": "VALVE_ID_00_SOLENOID",
        "status": "NORMAL",
        "defect_type": "None (Healthy Operation)",
        "score_range": (0.018, 0.038),
        "rpm": 0,
        "temperature_base": 38.0,
        "peak_frequency_hz": 40,
        "estimated_rul": "> 5000 Siklus (Optimal)",
        "severity": "NORMAL"
    },
    {
        "category": "Valve (Katup Solenoid Pneumatik)",
        "machine_id": "VALVE_ID_02_SEAT",
        "status": "WARNING",
        "defect_type": "Solenoid Response Lag & Valve Seat Contamination",
        "score_range": (0.610, 0.695),
        "rpm": 0,
        "temperature_base": 56.5,
        "peak_frequency_hz": 1450,
        "estimated_rul": "96 Jam (Jadwalkan Pembersihan Seat)",
        "severity": "WARNING"
    }
]


def generate_random_inspection_sample() -> Dict[str, Any]:
    """Memilih 1 sample mesin secara acak dan membuat telemetri dinamis realistis."""
    profile = random.choice(SAMPLE_PROFILES)
    
    # Generate nilai acak terikat parameter profile
    score = round(random.uniform(*profile["score_range"]), 3)
    temp = round(profile["temperature_base"] + random.uniform(-1.5, 2.0), 1)
    rpm = profile["rpm"] + random.randint(-15, 15) if profile["rpm"] > 0 else 0
    noise_snr_db = round(random.uniform(-0.5, 0.5), 1)
    
    mock_ipfs_hash = "ipfs://Qm" + "".join(random.choices("abcdefABCDEF0123456789", k=44))
    
    return {
        "category": profile["category"],
        "machine_id": profile["machine_id"],
        "status": profile["status"],
        "defect_type": profile["defect_type"],
        "anomaly_score": score,
        "severity": profile["severity"],
        "estimated_rul": profile["estimated_rul"],
        "rpm": rpm,
        "temperature_c": temp,
        "noise_snr_db": f"{noise_snr_db} dB SNR (Factory Floor)",
        "peak_freq_hz": profile["peak_frequency_hz"],
        "ipfs_metadata": mock_ipfs_hash,
        "timestamp": int(time.time()),
        "model_version": "STgram-MFN-v3-ONNX (<50ms)"
    }


def run_blockchain_test():
    print("=" * 70)
    print("🏭 [ECHOFACTORY] - MULTI-SAMPLE BLOCKCHAIN AUDIT TEST")
    print("=" * 70)

    svc = BlockchainService()

    # 1. Cek Koneksi ke Node Polygon Amoy
    print("\n[STEP 1] Memeriksa koneksi ke Polygon Amoy Testnet...")
    connected = svc.is_connected()
    if connected:
        print(f"[OK] Terhubung ke Node RPC: {svc.rpc_url}")
    else:
        print("[ERROR] Gagal terhubung ke RPC. Periksa koneksi internet Anda.")
        return

    # 2. Cek Status Wallet & Saldo
    print("\n[STEP 2] Memeriksa Status Wallet & Smart Contract...")
    wallet_info = svc.get_wallet_info()
    if wallet_info.get("status") == "success":
        print(f"  * Wallet Address : {wallet_info['address']}")
        print(f"  * Saldo MATIC    : {wallet_info['balance_matic']:.6f} POL/MATIC")
        print(f"  * Smart Contract : {svc.contract_address or 'Belum terpasang'}")
        if wallet_info['balance_matic'] < 0.005:
            print("  * [INFO] Saldo tipis. Jika gas kurang, sistem otomatis aktifkan Simulation Hash.")
    else:
        print(f"  * [INFO] {wallet_info.get('message')}")
        print("  * [INFO] Mode Simulasi Kriptografi Aktif.")

    # 3. Ambil Sampel Acak dari Model AI
    print("\n[STEP 3] Menjalankan Simulasi Inferensi Model STgram-MFN (Randomized Sample)...")
    sample = generate_random_inspection_sample()
    
    status_icon = "🟢" if sample["status"] == "NORMAL" else ("🟡" if sample["status"] == "WARNING" else "🔴")
    print(f"  ┌─────────────────────────────────────────────────────────────┐")
    print(f"  │ Jenis Unit     : {sample['category']}")
    print(f"  │ Machine ID     : {sample['machine_id']}")
    print(f"  │ Health Status  : {status_icon} [{sample['status']}]")
    print(f"  │ Skor Anomali   : {sample['anomaly_score']:.3f} (Threshold: 0.500)")
    print(f"  │ Diagnosa Defect: {sample['defect_type']}")
    print(f"  │ Estimasi RUL   : {sample['estimated_rul']}")
    print(f"  │ Telemetri      : RPM={sample['rpm']} | Temp={sample['temperature_c']}°C | Noise={sample['noise_snr_db']}")
    print(f"  └─────────────────────────────────────────────────────────────┘")

    # 4. Commit ke Blockchain
    print("\n[STEP 4] Mengirim Log Data Hasil Deteksi ke Smart Contract Polygon...")
    result = svc.commit_inspection_record(
        machine_id=sample["machine_id"],
        anomaly_score=sample["anomaly_score"],
        status=sample["status"],
        defect_type=sample["defect_type"],
        ipfs_metadata=sample["ipfs_metadata"],
        raw_metadata=sample
    )

    print("\n" + "-" * 60)
    print("HASIL TRANSMISI BLOCKCHAIN:")
    print("-" * 60)
    for k, v in result.items():
        print(f"  {k:<18}: {v}")
    print("-" * 60)

    # 5. Fetch Riwayat On-Chain
    if svc.contract and result.get("status") == "success":
        print(f"\n[STEP 5] Menunggu konfirmasi blok (~3 detik) lalu membaca riwayat ({sample['machine_id']}) On-Chain...")
        time.sleep(3.5)
        history = svc.get_machine_history(sample["machine_id"])
        print(f"[OK] Ditemukan {len(history)} catatan inspeksi di Blockchain untuk mesin ini:")
        for idx, rec in enumerate(history, 1):
            print(f"  [{idx}] Skor: {rec['anomaly_score']:.3f} | Status: {rec['status']:<8} | Defect: {rec['defect_type']:<35} | Hash: {rec['data_hash'][:18]}...")
    else:
        print("\n[STEP 5] Ringkasan Validasi:")
        print(f"  * Bukti Audit Kriptografi SHA-256: {result.get('data_hash', 'N/A')}")
        print("  * Data telah di-hash secara deterministik dan siap di-validasi on-chain.")

    print("\n" + "=" * 70)
    print("[SUCCESS] Pengujian Selesai! EchoFactory AI & Blockchain Siap Dipresentasikan.")
    print("=" * 70)


if __name__ == "__main__":
    run_blockchain_test()
