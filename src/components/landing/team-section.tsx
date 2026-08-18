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
    name: "[Nama Tim - Lead AI & Blockchain]",
    role: "Lead AI & Blockchain Systems Architect",
    division: "AI Core & Decentralized Trust",
    icon: Cpu,
    bio: "Memimpin perancangan model deep metric learning STgram-MFN v3 dual-branch pada dataset Hitachi MIMII, optimasi kuantisasi ONNX, dan arsitektur smart contract paspor kesehatan mesin di Polygon Amoy.",
    contributions: [
      "Pelatihan model STgram-MFN v3 (Mel-Spectrogram + Linear STFT) dengan ArcFace Loss",
      "Kuantisasi bobot ONNX Opset 17 (< 184 KB) untuk inferensi edge sub-50ms",
      "Pembangunan smart contract Solidity MachineHealthPassport.sol & hashing SHA-256",
    ],
    skills: ["PyTorch", "STgram-MFN v3", "Solidity", "Polygon Amoy", "ONNX Opset 17", "ArcFace"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "[Nama Rekan 1 - Full-Stack]",
    role: "Full-Stack & Edge Telemetry Engineer",
    division: "Console & Frontend Architecture",
    icon: Code2,
    bio: "Mengembangkan antarmuka Next.js 15 konsol industri 4 persona (Operator, Supervisor, Manager, Auditor), streaming audio WebAudio API 16 kHz, dan visualisasi spektrogram interaktif.",
    contributions: [
      "Pengembangan Unified 4-Persona Industrial Console (Next.js 15 + Tailwind CSS)",
      "Streaming audio WebAudio API 16 kHz & kanvas spektrogram real-time",
      "Optimasi responsivitas antarmuka B2B Industrial SCADA & micro-interactions",
    ],
    skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "WebAudio API", "Lucide React"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "[Nama Rekan 2 - Cognitive AI]",
    role: "Cognitive Diagnostic & IoT Domain Specialist",
    division: "Manufacturing Intelligence & MLOps",
    icon: Sparkles,
    bio: "Menyusun Cognitive Diagnostic Core menggunakan Gemini Flash Multimodal RAG terintegrasi standar ISO 10816-3 untuk rekomendasi SOP preventif dan estimasi sisa umur operasional mesin (RUL).",
    contributions: [
      "Integrasi RAG SOP mekanik berdasarkan standardisasi getaran ISO 10816-3",
      "Prompt engineering Gemini Flash untuk analisis mitigasi kerugian finansial downtime",
      "Kepatuhan teknis Booklet COMPFEST 18 & deployment backend Hugging Face Spaces",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
