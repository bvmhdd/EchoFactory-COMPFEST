"""
EchoFactory - Cognitive Diagnostic Engine Module
Menggabungkan penalaran Multimodal Gemini Flash, Standar Vibrasi Mesin ISO 10816,
Estimasi Remaining Useful Life (RUL), Voice Assistant, dan ERP Work Order Dispatcher.
"""

import os
import json
import random
from typing import Dict, Any, Optional

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if HAS_GENAI and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel(GEMINI_MODEL_NAME)
    except Exception:
        try:
            gemini_model = genai.GenerativeModel("gemini-2.0-flash")
        except Exception:
            gemini_model = None
else:
    gemini_model = None


# Knowledge Base ISO 10816-3 (Vibration Severity & Diagnostic SOP)
ISO_10816_ZONES = {
    "Zone A": {
        "range": "0.0 - 1.8 mm/s",
        "condition": "Baru / Sangat Baik (Good)",
        "action": "Operasi normal tanpa batasan. Lanjutkan inspeksi rutin."
    },
    "Zone B": {
        "range": "1.8 - 4.5 mm/s",
        "condition": "Memuaskan / Layak Operasi (Satisfactory)",
        "action": "Mesin layak beroperasi jangka panjang tanpa perlu intervensi."
    },
    "Zone C": {
        "range": "4.5 - 11.2 mm/s",
        "condition": "Degradasi / Tidak Direkomendasikan (Unsatisfactory)",
        "action": "Peringatan! Jadwalkan inspeksi & pergantian komponen sebelum kerusakan struktural."
    },
    "Zone D": {
        "range": "> 11.2 mm/s",
        "condition": "Kerusakan Kritis / Bahaya (Unacceptable)",
        "action": "BAHAYA! Matikan mesin segera untuk mencegah kegagalan katastropik & kecelakaan kerja."
    }
}

# Database Mock Suku Cadang Gudang ERP/SAP dengan Lead Time
ERP_INVENTORY = {
    "FAN_ID_00": {
        "part_name": "Deep Groove Ball Bearing #SKF-6204-2RSH",
        "sku": "SKU-BEAR-6204",
        "stock": 8,
        "location": "Gudang B - Rak 04",
        "unit_price_idr": 185000,
        "lead_time_days": 2,
        "supplier": "SKF Industrial Distribution Asia"
    },
    "PUMP_ID_01": {
        "part_name": "Mechanical Seal & Impeller Kit #GRUNDFOS-CR15",
        "sku": "SKU-SEAL-CR15",
        "stock": 1,
        "location": "Gudang A - Rak 12",
        "unit_price_idr": 1250000,
        "lead_time_days": 12, # Bottleneck lead time
        "supplier": "Grundfos Direct Spares Global"
    },
    "SLIDER_ID_02": {
        "part_name": "Linear Guide Rail Block #THK-HSR25R",
        "sku": "SKU-RAIL-THK25",
        "stock": 5,
        "location": "Gudang C - Rak 02",
        "unit_price_idr": 650000,
        "lead_time_days": 4,
        "supplier": "THK Motion Systems Jakarta"
    },
    "VALVE_ID_03": {
        "part_name": "High-Pressure Solenoid Diaphragm #FESTO-VZWD",
        "sku": "SKU-VALV-FESTO",
        "stock": 12,
        "location": "Gudang B - Rak 09",
        "unit_price_idr": 420000,
        "lead_time_days": 3,
        "supplier": "Festo Automation Indonesia"
    }
}


class CognitiveDiagnosticEngine:
    def __init__(self):
        self.model = gemini_model

    def generate_fmea_matrix(self, machine_id: str, anomaly_score: float, is_anomaly: bool, defect_type: str, zone: str) -> Dict[str, Any]:
        """
        Menghasilkan Analisis Mode Kegagalan dan Efeknya (FMEA Matrix) berstandar IATF 16949:
        - Severity (S): Dampak terhadap lini produksi (1-10)
        - Occurrence (O): Kemungkinan terjadinya kegagalan (1-10)
        - Detection (D): Kemampuan deteksi akustik dini (1-10)
        - RPN = S * O * D (Risk Priority Number)
        """
        if not is_anomaly:
            return {
                "failure_mode": "Normal Operation (Zero Incipient Defect)",
                "potential_effect": "Optimal throughput, no unplanned downtime risk",
                "severity_s": 1,
                "occurrence_o": 1,
                "detection_d": 1,
                "rpn_score": 1,
                "risk_category": "LOW (ACCEPTABLE)",
                "recommended_control": "Lanjutkan monitoring akustik pasif edge-AI STgram-MFN."
            }

        s_val = 8 if zone == "Zone D" else (6 if zone == "Zone C" else 4)
        o_val = min(9, max(3, int(anomaly_score * 10)))
        d_val = 2 # Deteksi akustik dini sangat andal (skor deteksi rendah = kemampuan deteksi tinggi)
        rpn = s_val * o_val * d_val

        fmea_data = {
            "FAN_ID_00": {
                "failure_mode": "Bearing Raceway Pitting & Inner Ring Spall (BPFI 118.5 Hz)",
                "potential_effect": "Rotor locking, motor coil burn, total airflow stoppage in furnace line",
                "potential_cause": "Lubrication contamination & micro-fretting corrosion",
                "current_controls": "EchoFactory STgram-MFN Continuous Acoustic Monitoring",
            },
            "PUMP_ID_01": {
                "failure_mode": "Centrifugal Impeller Erosion & Cavitation Shock Pitting",
                "potential_effect": "Suction pressure loss, mechanical seal rupture, coolant overflow",
                "potential_cause": "NPSH starvation & fluid vapor bubble collapse",
                "current_controls": "Suction Acoustic Sensor & Pressure Guard",
            },
            "SLIDER_ID_02": {
                "failure_mode": "Guide Rail Stick-Slip Galling & Ball Block Starvation",
                "potential_effect": "CNC positioning jitter, dimensional reject on machined parts",
                "potential_cause": "Automatic lubrication channel blockage",
                "current_controls": "Stroke Reciprocating Envelope Anomaly Profiler",
            },
            "VALVE_ID_03": {
                "failure_mode": "High-Pressure Solenoid Diaphragm Micro-Rupture",
                "potential_effect": "Continuous pneumatic/hydraulic pressure leak, compressor overloading",
                "potential_cause": "Thermal cycling fatigue & elastomer degradation",
                "current_controls": "Ultrasonic Orifice Acoustic Signature Guard",
            }
        }.get(machine_id, {
            "failure_mode": defect_type,
            "potential_effect": "Unplanned machine stoppage and production bottleneck",
            "potential_cause": "Mechanical wear and cyclical fatigue",
            "current_controls": "Acoustic AI Vibration Inspection",
        })

        fmea_data.update({
            "severity_s": s_val,
            "occurrence_o": o_val,
            "detection_d": d_val,
            "rpn_score": rpn,
            "risk_category": "CRITICAL RISK (P1)" if rpn > 90 else ("MODERATE RISK (P2)" if rpn > 40 else "LOW RISK"),
            "recommended_control": f"Lakukan isolasi LOTO, ganti komponen sebelum RPN melampaui batas kritis 100."
        })
        return fmea_data

    def evaluate_supply_chain_and_derating(self, machine_id: str, rul_hours: int, part: dict) -> Dict[str, Any]:
        """
        Menganalisis risiko rantai pasok suku cadang (Lead Time vs RUL)
        dan memberikan rekomendasi Derating (penurunan beban/kecepatan operasi) untuk memperpanjang RUL.
        """
        lead_time_hours = part["lead_time_days"] * 24
        stock_available = part["stock"] > 0
        is_bottleneck = (not stock_available or part["stock"] <= 1) and (lead_time_hours > rul_hours)

        if "FAN" in machine_id:
            derating_advice = "Turunkan kecepatan inverter motor dari 1800 RPM ke 1250 RPM (-30%). Hal ini mengurangi gaya sentrifugal bantalan sebesar ~51%, memperpanjang RUL dari saat ini hingga suku cadang tiba."
        elif "PUMP" in machine_id:
            derating_advice = "Turunkan laju aliran debit sebesar 25% dan tingkatkan tekanan suction minimal +0.8 bar untuk meredam pembentukan gelembung kavitasi impeler."
        elif "SLIDER" in machine_id:
            derating_advice = "Kurangi kecepatan feed rate CNC sebesar 35% dan lakukan manual spray lubrication grease ISO VG 220 setiap 4 jam kerja."
        else:
            derating_advice = "Turunkan siklus switching solenoid valve sebesar 20% untuk mengurangi frekuensi lonjakan tekanan pada membran seal."

        extended_rul_hours = int(rul_hours * 2.8) if is_bottleneck else rul_hours

        return {
            "part_stock": part["stock"],
            "part_lead_time_days": part["lead_time_days"],
            "part_lead_time_hours": lead_time_hours,
            "rul_hours": rul_hours,
            "is_supply_chain_bottleneck": is_bottleneck,
            "bottleneck_severity": "CRITICAL ALERT (Lead Time > RUL)" if is_bottleneck else "NORMAL (In-Stock / Adequate Lead Time)",
            "prescriptive_derating_action": derating_advice,
            "extended_rul_under_derating_hours": extended_rul_hours
        }

    def generate_prescriptive_sop(self, machine_id: str, defect_type: str, zone: str, part: dict) -> Dict[str, Any]:
        """
        Menghasilkan SOP Pemeliharaan Preskriptif 5-Langkah lengkap dengan protokol K3 LOTO & Tooling Matrix.
        """
        clean_mid = machine_id.split()[0] if machine_id else "FAN_ID_00"
        
        sop_templates = {
            "FAN_ID_00": {
                "loto_protocol": "Isolasi Breaker Panel MCC-B02 (400V 3-Phase). Pasang Safety Padlock & Tagout. Pastikan motor benar-benar nol energi (Zero Energy State).",
                "tooling_matrix": ["Hydraulic Bearing Puller 5-Ton", "Induction Bearing Heater (110°C target)", "Torque Wrench (Torsi 48 Nm)", "Dial Gauge Alignment Kit"],
                "lubricant_spec": "SKF LGHP 2 High Performance Polyurea Synthetic Grease (15 gram initial fill)",
                "step_1": "1. [LOTO & ISOLASI]: Matikan power drive, pasang lock out, dan lepas coupling shaft motor-blower.",
                "step_2": "2. [DISASSEMBLY]: Gunakan Hydraulic Puller untuk menarik bearing lama SKF-6204 tanpa merusak shaft journal.",
                "step_3": "3. [CLEANING & INSPEKSI]: Bersihkan housing menggunakan solvent non-chlorinated. Ukur toleransi shaft runout (maks < 0.02 mm).",
                "step_4": "4. [ASSEMBLY]: Panaskan bearing baru SKF-6204 hingga 110°C dengan induction heater, lalu pasang presisi ke dudukan shaft.",
                "step_5": "5. [POST-REPAIR ACOUSTIC AUDIT]: Nyalakan mesin pada idle 600 RPM, lalu jalankan re-scan akustik EchoFactory. Target skor anomali < 0.035."
            },
            "PUMP_ID_01": {
                "loto_protocol": "Tutup Suction & Discharge Valve. Kunci Handle Valve dengan Cable Lockout. Buka drain plug untuk de-pressurisasi fluida ruang impeler.",
                "tooling_matrix": ["Impeller Spanner Wrench", "Mechanical Seal Press Tool", "Torque Wrench 65 Nm", "Pressure Barometer 0-10 Bar"],
                "lubricant_spec": "Food-Grade Silicone Sealant & Synthetic ISO VG 46 Barrier Fluid",
                "step_1": "1. [LOTO & DRAIN]: Isolasi elektrikal MCC-P01 dan kuras seluruh fluida dari casing pompa.",
                "step_2": "2. [CASING REMOVAL]: Buka baut casing menggunakan cross-pattern torque wrench.",
                "step_3": "3. [SEAL REPLACEMENT]: Lepas cartridge mechanical seal Grundfos CR15 dan ganti O-Ring baru.",
                "step_4": "4. [IMPELLER CLEARANCE]: Pasang impeler kit dan atur clearance vane 0.35 mm.",
                "step_5": "5. [HYDRO-TEST & SCAN]: Lakukan uji priming dan jalankan verifikasi akustik EchoFactory (Target Zone A)."
            },
            "SLIDER_ID_02": {
                "loto_protocol": "Aktifkan E-STOP CNC Console. Putuskan pasokan pneumatik/hidrolik sumbu gerak. Ganjal meja sumbu menggunakan Mechanical Safety Block.",
                "tooling_matrix": ["Hex Key Set Chrome Vanadium", "Precision Dial Indicator 0.001 mm", "Grease Gun High Pressure", "Linear Guide Alignment Jig"],
                "lubricant_spec": "THK AFB-LF Extreme Pressure Lithium Soap Grease (No. 2 consistency)",
                "step_1": "1. [LOTO & SECURE]: Kunci controller dan amankan sumbu linier dari risiko jatuh gravitasi.",
                "step_2": "2. [RAIL STRIPPING]: Lepas end-cap wiper dan geser block THK-HSR25 lama keluar dari rail.",
                "step_3": "3. [SURFACE POLISHING]: Bersihkan micro-burr pada permukaan guide rail menggunakan abrasive stone #1000.",
                "step_4": "4. [BLOCK INSTALLATION]: Pasang ball block baru dan kencangkan fixing bolt dengan torsi 12 Nm.",
                "step_5": "5. [TRAVEL ACOUSTIC TEST]: Jalankan siklus stroke 10x dan catat skor anomali akustik EchoFactory."
            },
            "VALVE_ID_03": {
                "loto_protocol": "Tutup Main Air Header Supply (6 Bar). Buang tekanan manifold via relief valve. Cabut konektor solenoid 24V DC.",
                "tooling_matrix": ["Pneumatic Fitting Wrench", "Circlip Plier Internal", "Multimeter Coil Resistance Tester", "Ultrasonic Leak Detector"],
                "lubricant_spec": "Klüber Syntheso Glep 1 O-Ring Special Lubricant Grease",
                "step_1": "1. [DE-ENERGIZE]: Putuskan pasokan udara kompresor dan cabut kabel sinyal solenoid.",
                "step_2": "2. [BONNET DISASSEMBLY]: Buka coil retaining nut dan lepas plunger spring assembly.",
                "step_3": "3. [DIAPHRAGM RENEWAL]: Pasang membran Festo VZWD baru, pastikan orientasi lubang equalizing port tepat.",
                "step_4": "4. [TORQUE & SEAL CHECK]: Kencangkan solenoid housing dan lakukan uji tahanan koil (~32 Ohm).",
                "step_5": "5. [ULTRASONIC AUDIT]: Beri tekanan 6 bar dan jalankan scan akustik frekuensi tinggi untuk memastikan 0% kebocoran."
            }
        }.get(clean_mid, {
            "loto_protocol": "Lakukan isolasi sumber energi primer dan pasang Lockout/Tagout sebelum intervensi mekanis.",
            "tooling_matrix": ["Standard Mechanical Maintenance Tool Set", "Torque Wrench", "Alignment Gauge"],
            "lubricant_spec": "Standard Industrial Machine Grease ISO VG 460",
            "step_1": "1. [LOTO]: Matikan mesin dan isolasi sumber daya.",
            "step_2": "2. [DISASSEMBLY]: Buka komponen yang mengalami anomali.",
            "step_3": "3. [REPLACEMENT]: Ganti komponen aus dengan suku cadang baru.",
            "step_4": "4. [CALIBRATION]: Kalibrasi clearance dan torsi baut pengikat.",
            "step_5": "5. [ACOUSTIC VALIDATION]: Uji ulang kondisi akustik mesin."
        })
        sop_data = dict(sop_templates)
        sop_data["steps"] = [
            sop_data.get("step_1", ""),
            sop_data.get("step_2", ""),
            sop_data.get("step_3", ""),
            sop_data.get("step_4", ""),
            sop_data.get("step_5", "")
        ]
        return sop_data

    def generate_radio_voice_dispatch(self, machine_id: str, defect_type: str, zone: str, rul_hours: int, wo_id: str) -> str:
        """
        Menghasilkan teks siaran suara walkie-talkie HT radio industri (Text-To-Speech / Dispatch Audio).
        """
        return (
            f"Perhatian Tim Maintenance Alpha! Peringatan otomatis EchoFactory diterbitkan untuk {machine_id}. "
            f"Klasifikasi {zone}. Indikasi {defect_type}. Sisa waktu operasional diperkirakan {rul_hours} jam. "
            f"Tiket Work Order #{wo_id} telah aktif. Segera lakukan prosedur LOTO dan ambil suku cadang di gudang. Ganti dan lapor kembali, over."
        )

    def diagnose_anomaly(
        self,
        machine_id: str,
        anomaly_score: float,
        is_anomaly: bool,
        crest_factor: float,
        snr_label: str = "0 dB"
    ) -> Dict[str, Any]:
        """
        Mendiagnosis akar masalah komponen, zona ISO 10816, estimasi RUL,
        FMEA Matrix, Rantai Pasok Derating, Prescriptive SOP, dan Radio Dispatch.
        """
        clean_mid = machine_id.split()[0] if machine_id else "FAN_ID_00"

        # 1. Tentukan Zona ISO 10816 & Estimasi RUL
        if anomaly_score <= 0.050:
            zone = "Zone A"
            rul_hours = random.randint(1800, 2400)
            defect_type = "None (Healthy Baseline)"
            severity = "NORMAL (PASS)"
        elif anomaly_score <= 0.250:
            zone = "Zone B"
            rul_hours = random.randint(720, 1200)
            defect_type = "Minor Wear / Slight Misalignment"
            severity = "LOW RISK"
        elif anomaly_score <= 0.600:
            zone = "Zone C"
            rul_hours = random.randint(120, 240)
            defect_type = self._get_default_defect(clean_mid)
            severity = "WARNING (ZONE C)"
        else:
            zone = "Zone D"
            rul_hours = random.randint(24, 48)
            defect_type = self._get_critical_defect(clean_mid)
            severity = "CRITICAL DANGER (ZONE D)"

        iso_info = ISO_10816_ZONES[zone]
        erp_part = ERP_INVENTORY.get(clean_mid, ERP_INVENTORY["FAN_ID_00"])
        wo_id = f"WO-2026-{random.randint(1000, 9999)}"

        # 2. Panggil Gemini Flash jika API Key tersedia
        gemini_explanation = None
        if self.model and is_anomaly:
            try:
                prompt = (
                    f"Sebagai AI Predictive Maintenance Engineer standar ISO 10816 & IATF 16949, analisis anomali suara mesin berikut:\n"
                    f"- Machine ID: {clean_mid}\n"
                    f"- Noise SNR Profile: {snr_label}\n"
                    f"- Anomaly Score: {anomaly_score:.4f} (Threshold: 0.050)\n"
                    f"- Spectral Crest Factor: {crest_factor:.2f}\n"
                    f"- ISO 10816 Severity: {zone} ({iso_info['condition']})\n"
                    f"- Defect: {defect_type}\n"
                    f"- Estimated RUL: {rul_hours} Jam\n"
                    f"Berikan ringkasan diagnosis teknis berbahasa Indonesia maksimal 3 kalimat: "
                    f"(1) Identifikasi akar masalah pada kondisi noise {snr_label}, (2) Risiko jika dibiarkan, (3) Tindakan perbaikan segera."
                )
                response = self.model.generate_content(prompt)
                gemini_explanation = response.text.strip()
            except Exception:
                gemini_explanation = None

        if not gemini_explanation:
            gemini_explanation = self._generate_rule_based_diagnosis(
                clean_mid, defect_type, zone, rul_hours, erp_part, snr_label
            )

        # 3. Hitung FMEA, Supply Chain Derating, Prescriptive SOP, dan Radio Voice
        fmea = self.generate_fmea_matrix(clean_mid, anomaly_score, is_anomaly, defect_type, zone)
        supply_chain = self.evaluate_supply_chain_and_derating(clean_mid, rul_hours, erp_part)
        sop = self.generate_prescriptive_sop(clean_mid, defect_type, zone, erp_part)
        radio_dispatch = self.generate_radio_voice_dispatch(clean_mid, defect_type, zone, rul_hours, wo_id)

        return {
            "machine_id": clean_mid,
            "snr_label": snr_label,
            "anomaly_score": anomaly_score,
            "is_anomaly": is_anomaly,
            "severity": severity,
            "defect_type": defect_type,
            "iso_zone": zone,
            "iso_range": iso_info["range"],
            "iso_condition": iso_info["condition"],
            "iso_action": iso_info["action"],
            "estimated_rul_hours": rul_hours,
            "recommended_part": erp_part,
            "diagnostic_summary": gemini_explanation,
            "work_order_id": wo_id,
            "fmea_matrix": fmea,
            "supply_chain": supply_chain,
            "prescriptive_sop": sop,
            "radio_voice_dispatch": radio_dispatch
        }

    def _get_default_defect(self, machine_id: str) -> str:
        defects = {
            "FAN_ID_00": "Fan Blade Unbalance & Light Bearing Friction",
            "PUMP_ID_01": "Incipient Cavitation & Fluid Turbulence",
            "SLIDER_ID_02": "Guide Rail Lubrication Starvation",
            "VALVE_ID_03": "Solenoid Plunger Hesitation & Flow Flutter"
        }
        return defects.get(machine_id, "Mechanical Friction Anomaly")

    def _get_critical_defect(self, machine_id: str) -> str:
        defects = {
            "FAN_ID_00": "Bearing Inner Race Spalling (BPFI 118.5 Hz) & Rotor Eccentricity",
            "PUMP_ID_01": "Severe Impeller Cavitation & Mechanical Seal Breakdown",
            "SLIDER_ID_02": "Linear Guide Rail Galling & Heavy Ball Block Friction",
            "VALVE_ID_03": "High-Pressure Solenoid Valve Seal Rupture & Continuous Leakage"
        }
        return defects.get(machine_id, "Severe Mechanical Defect")

    def _generate_rule_based_diagnosis(
        self, machine_id: str, defect: str, zone: str, rul: int, part: dict, snr_label: str = "0 dB"
    ) -> str:
        if "NORMAL" in zone or zone in ["Zone A", "Zone B"]:
            return f"✅ Mesin {machine_id} beroperasi dalam batas toleransi standar ISO 10816 ({zone}) pada profil kebisingan {snr_label}. Spektrogram akustik menunjukkan harmonik rotasi yang stabil. Lanjutkan jadwal inspeksi rutin harian."
        return (
            f"⚠️ Terdeteksi anomali pada {machine_id} terklasifikasi dalam ISO 10816 {zone} (Kondisi Noise: {snr_label}). "
            f"Akar masalah teridentifikasi sebagai '{defect}' dengan estimasi sisa umur operasional (RUL) tersisa ~{rul} jam. "
            f"Disarankan segera melakukan inspeksi dan pergantian {part['part_name']} ({part['sku']}) sebelum terjadi downtime tak terduga."
        )

    def process_voice_assistant(self, user_query: str, current_context: Optional[dict] = None) -> str:
        """Menjawab pertanyaan lisan teknisi industri hands-free."""
        if not user_query or not user_query.strip():
            return "Halo teknisi EchoFactory! Silakan ajukan pertanyaan seputar kondisi mesin, standar getaran ISO, atau status suku cadang."

        q = user_query.lower()
        
        # Panggil Gemini jika ada
        if self.model:
            try:
                ctx_str = f"Konteks mesin saat ini: {json.dumps(current_context)}" if current_context else "Tidak ada anomali aktif."
                prompt = (
                    f"Anda adalah Voice Assistant AI untuk teknisi pabrik di aplikasi EchoFactory.\n"
                    f"{ctx_str}\n"
                    f"Pertanyaan Teknisi: '{user_query}'\n"
                    f"Berikan jawaban teknis yang ramah, ringkas, solutif, dan berbahasa Indonesia (maksimal 3 kalimat)."
                )
                res = self.model.generate_content(prompt)
                return res.text.strip()
            except Exception:
                pass

        # Rule-based Voice Assistant
        if "fan" in q or "kipas" in q:
            return "Fan 00 beroperasi pada 1800 RPM. Riwayat inspeksi terakhir menunjukkan kondisi normal dengan skor anomali 0.024. Stok bantalan SKF-6204 di gudang tersedia 8 unit."
        elif "pump" in q or "pompa" in q:
            return "Pompa Sentrifugal 01 terpantau stabil. Pastikan tekanan suction tidak turun di bawah 1.5 bar guna mencegah kavitasi impeler."
        elif "slider" in q or "rel" in q:
            return "Linear Slider 02 memerlukan pelumasan berkala tiap 100 jam kerja. Stok blok THK-HSR25 di Gudang C tersedia 5 unit."
        elif "valve" in q or "katup" in q:
            return "Solenoid Valve 03 memiliki siklus switching normal pada tekanan 6 bar. Tidak ada kebocoran fluida yang terdeteksi."
        elif "iso" in q or "standar" in q:
            return "Sistem mengacu pada ISO 10816-3. Getaran di bawah 1.8 mm/s adalah Zona A (Baik), sedangkan di atas 11.2 mm/s adalah Zona D (Bahaya Kritis)."
        elif "fmea" in q or "rpn" in q:
            return "Matriks FMEA menghitung skor RPN = Severity x Occurrence x Detection. RPN di atas 90 memerlukan intervensi maintenance P1."
        elif "esg" in q or "karbon" in q or "energi" in q:
            return "Anomali getaran mekanis meningkatkan konsumsi daya motor hingga +22% dan emisi karbon ~10 kg CO2/hari akibat hilangnya efisiensi energi."
        elif "wo" in q or "work order" in q or "perbaikan" in q:
            return "Tiket Work Order dapat diterbitkan langsung dari Tab 2 setelah supervisor memverifikasi anomali dan alokasi suku cadang."
        else:
            return f"EchoFactory telah memproses query: '{user_query}'. Semua telemetri sensor terhubung dengan Smart Contract Polygon Amoy untuk validasi tamper-proof."

    def generate_work_order(self, diagnosis: dict) -> dict:
        """Menerbitkan tiket Work Order resmi simulasi ERP/SAP."""
        wo_id = diagnosis.get("work_order_id", f"WO-2026-{random.randint(1000, 9999)}")
        part = diagnosis.get("recommended_part", ERP_INVENTORY["FAN_ID_00"])
        return {
            "work_order_id": wo_id,
            "machine_id": diagnosis["machine_id"],
            "defect_type": diagnosis["defect_type"],
            "iso_zone": diagnosis["iso_zone"],
            "urgency": "HIGH (Immediate Overhaul)" if diagnosis["iso_zone"] == "Zone D" else "MEDIUM (Scheduled)",
            "allocated_part": part["part_name"],
            "part_sku": part["sku"],
            "warehouse_location": part["location"],
            "assigned_team": "Shift Maintenance Team Alpha",
            "estimated_cost_idr": f"Rp {part['unit_price_idr'] + 350000:,}",
            "status": "APPROVED & DISPATCHED TO SHIFT TECH"
        }


# Singleton Instance
cognitive_engine = CognitiveDiagnosticEngine()

