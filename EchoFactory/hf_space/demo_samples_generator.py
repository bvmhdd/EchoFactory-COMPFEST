"""
EchoFactory - Synthetic Demo Audio Generator
Menghasilkan 8 sampel audio WAV 16kHz realistis untuk demo instan di HF Spaces:
1. FAN: Normal (Smooth humming) vs Anomaly (Bearing Inner Race tick/BPFI + unbalance)
2. PUMP: Normal (Steady laminar flow) vs Anomaly (Cavitation bubble popping noise)
3. SLIDER: Normal (Periodic linear sliding) vs Anomaly (Dry friction & screeching rail)
4. VALVE: Normal (Crisp solenoid click & flow) vs Anomaly (Leakage hiss & erratic pulsing)
"""

import os
import numpy as np
import scipy.io.wavfile as wavfile

SR = 16000 # 16kHz standard
DURATION = 10 # 10 detik

def create_fan_normal():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # Fundamental rotation 30 Hz (1800 RPM) + blade pass frequency (4 blades = 120 Hz)
    sig = 0.4 * np.sin(2 * np.pi * 30 * t) + 0.3 * np.sin(2 * np.pi * 120 * t) + 0.15 * np.sin(2 * np.pi * 240 * t)
    # Background smooth pink noise
    noise = np.random.normal(0, 0.08, len(t))
    audio = sig + noise
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.7)

def create_fan_anomaly():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # Base unbalance
    sig = 0.5 * np.sin(2 * np.pi * 30 * t) + 0.2 * np.sin(2 * np.pi * 120 * t)
    # BPFI Bearing Fault (118.5 Hz periodic impact pulses)
    pulse_train = np.zeros_like(t)
    pulse_indices = np.arange(0, len(t), int(SR / 118.5))
    pulse_train[pulse_indices] = 1.0
    # Resonant ring-down filter
    decay = np.exp(-t[:int(SR * 0.008)] * 1000) * np.sin(2 * np.pi * 2400 * t[:int(SR * 0.008)])
    fault_signal = np.convolve(pulse_train, decay, mode='same') * 0.6
    # Harsh industrial noise
    noise = np.random.normal(0, 0.2, len(t))
    audio = sig + fault_signal + noise
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.9)

def create_pump_normal():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # 50 Hz motor hum + 300 Hz impeller vane pass (6 vanes)
    sig = 0.35 * np.sin(2 * np.pi * 50 * t) + 0.25 * np.sin(2 * np.pi * 300 * t)
    # Steady fluid flow sound (filtered noise)
    noise = np.random.normal(0, 0.1, len(t))
    audio = sig + noise
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.7)

def create_pump_anomaly():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    sig = 0.3 * np.sin(2 * np.pi * 50 * t) + 0.2 * np.sin(2 * np.pi * 300 * t)
    # Cavitation: random bursty high-frequency popping noise (3 kHz - 6 kHz)
    cavitation = np.random.normal(0, 0.4, len(t)) * (np.random.rand(len(t)) > 0.85)
    noise = np.random.normal(0, 0.25, len(t))
    audio = sig + cavitation + noise
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.9)

def create_slider_normal():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # Periodic back and forth stroke (0.5 Hz cycle)
    envelope = np.abs(np.sin(2 * np.pi * 0.5 * t))
    slide_noise = np.random.normal(0, 0.15, len(t)) * envelope
    audio = slide_noise + 0.05 * np.sin(2 * np.pi * 100 * t)
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.65)

def create_slider_anomaly():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    envelope = np.abs(np.sin(2 * np.pi * 0.5 * t))
    # Dry metallic friction screech (1800 Hz & 3200 Hz harmonic squeals)
    friction = 0.5 * np.sin(2 * np.pi * 1850 * t) * envelope + 0.3 * np.sin(2 * np.pi * 3200 * t) * envelope
    noise = np.random.normal(0, 0.3, len(t)) * envelope
    audio = friction + noise + 0.1 * np.sin(2 * np.pi * 100 * t)
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.95)

def create_valve_normal():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # Periodic solenoid click every 2.5 seconds
    audio = np.random.normal(0, 0.05, len(t))
    for click_time in [2.5, 5.0, 7.5]:
        idx = int(click_time * SR)
        click_dur = int(0.05 * SR)
        if idx + click_dur < len(audio):
            click = np.sin(2 * np.pi * 800 * t[:click_dur]) * np.exp(-t[:click_dur] * 50) * 0.6
            audio[idx:idx+click_dur] += click
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.6)

def create_valve_anomaly():
    t = np.linspace(0, DURATION, int(SR * DURATION), endpoint=False)
    # Continuous high-pressure leakage hiss (4 kHz - 7 kHz) + erratic flow flutter
    flutter = 0.3 * np.sin(2 * np.pi * 15 * t)
    leakage = np.random.normal(0, 0.45, len(t)) * (1.0 + flutter)
    audio = leakage
    return np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.9)

def generate_all_samples(output_dir="demo_samples"):
    os.makedirs(output_dir, exist_ok=True)
    samples = {
        "DEMO_FAN_NORMAL.wav": create_fan_normal(),
        "DEMO_FAN_ANOMALY.wav": create_fan_anomaly(),
        "DEMO_PUMP_NORMAL.wav": create_pump_normal(),
        "DEMO_PUMP_ANOMALY.wav": create_pump_anomaly(),
        "DEMO_SLIDER_NORMAL.wav": create_slider_normal(),
        "DEMO_SLIDER_ANOMALY.wav": create_slider_anomaly(),
        "DEMO_VALVE_NORMAL.wav": create_valve_normal(),
        "DEMO_VALVE_ANOMALY.wav": create_valve_anomaly(),
    }
    for filename, audio_data in samples.items():
        filepath = os.path.join(output_dir, filename)
        wavfile.write(filepath, SR, audio_data)
        print(f"Generated: {filepath} ({len(audio_data)/SR:.1f}s)")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(current_dir, "demo_samples")
    generate_all_samples(out)
