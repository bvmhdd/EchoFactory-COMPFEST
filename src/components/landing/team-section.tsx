"use client";

import { Users, Cpu, ShieldCheck, Code2, Sparkles, Github, Linkedin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TeamMember {
  name: string;
  role: string;
  division: string;
  icon: typeof Cpu;
  bio: string;
  contributions: string[];
  skills: string[];
  github?: string;
  linkedin?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Nama Rekan 1",
    role: "Lead Acoustic AI & Deep Learning Engineer",
    division: "Artificial Intelligence Core",
    icon: Cpu,
    bio: "Merancang dan melatih arsitektur STgram-MFN v3 dual-branch (Mel-Spectrogram + Linear STFT) dengan ArcFace Loss untuk deteksi anomali suara mesin presisi tinggi pada noise 0 dB SNR.",
    contributions: [
      "Pelatihan model STgram-MFN v3 pada dataset Hitachi MIMII (-6dB & 6dB)",
      "Optimasi ekstraksi fitur Time-Frequency & Mel-Filterbank 16 kHz",
      "Kuantisasi bobot model ke ONNX Opset 17 (< 184 KB footprint)",
    ],
    skills: ["PyTorch", "STgram-MFN", "Librosa", "ArcFace", "ONNX Runtime"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Nama Rekan 2",
    role: "Blockchain & Smart Contract Architect",
    division: "Decentralized Trust & Web3",
    icon: ShieldCheck,
    bio: "Mengembangkan smart contract MachineHealthPassport.sol pada jaringan Polygon Amoy Testnet untuk pencatatan paspor kesehatan mesin yang anti-manipulasi (tamper-proof) dan klaim garansi parametrik.",
    contributions: [
      "Arsitektur Solidity smart contract MachineHealthPassport.sol",
      "Integrasi hashing kriptografi SHA-256 dan verifikasi on-chain",
      "Deployment dan verifikasi contract di PolygonScan Amoy Explorer",
    ],
    skills: ["Solidity", "Polygon Amoy", "Web3.py / Ethers", "SHA-256", "Hardhat"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Nama Rekan 3",
    role: "Full-Stack & Edge Systems Engineer",
    division: "Unified Console & Architecture",
    icon: Code2,
    bio: "Membangun antarmuka Next.js 15 konsol industri 4 persona terintegrasi, pemrosesan audio WebAudio API real-time, serta backend inferensi terdistribusi di Hugging Face Spaces.",
    contributions: [
      "Pengembangan Unified 4-Persona Industrial Console (Next.js + Tailwind)",
      "Streaming audio WebAudio API & visualisasi Mel-Spectrogram interaktif",
      "Arsitektur backend Gradio API & integrasi REST inferensi sub-50ms",
    ],
    skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "WebAudio API", "Gradio"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Nama Rekan 4 (Opsional)",
    role: "Cognitive Diagnostic & IoT Domain Specialist",
    division: "Manufacturing Intelligence",
    icon: Sparkles,
    bio: "Menyusun sistem diagnosis kognitif berbasis Gemini Flash Multimodal yang dipadukan dengan standardisasi vibrasi ISO 10816-3 untuk rekomendasi SOP mekanik dan estimasi sisa umur mesin (RUL).",
    contributions: [
      "Integrasi RAG SOP mekanik berdasarkan standar ISO 10816-3",
      "Prompt engineering Gemini Flash untuk estimasi finansial downtime",
      "Validasi domain industri manufaktur & kepatuhan Booklet COMPFEST 18",
    ],
    skills: ["Gemini Flash", "ISO 10816-3", "Prompt Engineering", "Predictive Maint.", "IoT"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#27272A]/60">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>COMPFEST 18 AI INNOVATION CHALLENGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Tim Pengembang EchoFactory
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Kolaborasi lintas disiplin AI, Web3, Smart Manufacturing, dan Full-Stack Systems.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed font-sans">
          Dibangun khusus untuk menjawab tantangan efisiensi industri manufaktur modern dengan menggabungkan deteksi akustik frekuensi tinggi dan buku besar terdesentralisasi.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_MEMBERS.map((member, idx) => {
          const IconComp = member.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#09090B] border border-[#27272A] hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:shadow-2xl hover:bg-[#0E0E11]"
            >
              <div>
                {/* Card Top: Icon & Division Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/15 group-hover:border-sky-500/30 transition-all">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="mono" className="text-[10px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
                    {member.division}
                  </Badge>
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-mono font-medium text-sky-400 mb-3 leading-snug">
                  {member.role}
                </div>

                {/* Bio */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-sans">
                  {member.bio}
                </p>

                {/* Key Contributions */}
                <div className="border-t border-[#27272A] pt-3 mb-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                    Kontribusi Utama:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-zinc-300 font-sans">
                    {member.contributions.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-sky-400 font-mono text-xs">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills Tags & Social Links */}
              <div className="border-t border-[#27272A] pt-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1 text-zinc-400">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-400 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
