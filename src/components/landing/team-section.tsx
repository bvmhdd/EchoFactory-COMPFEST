"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Cpu, Code2, Sparkles, Database, FileText, Github, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  tag: string;
  icon: typeof Cpu;
  accentColor: string;
  avatarUrl?: string; // Path ke foto, contoh: "/team/lead.jpg" atau URL
  github?: string;
  linkedin?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Muhammad Muhibin",
    role: "Team Lead & AI Architect",
    tag: "Lead AI & Web3",
    icon: Cpu,
    accentColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    avatarUrl: "/team/muhibin.jpg",
    focus: "Merancang arsitektur model deep metric STgram-MFN v3, kuantisasi ONNX, dan smart contract paspor kesehatan mesin di Polygon Amoy.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Eko Muhammad Rizki",
    role: "Full-Stack Developer",
    tag: "Frontend & WebAudio",
    icon: Code2,
    accentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    avatarUrl: "", // Isi dengan path foto, contoh: "/team/fullstack.jpg"
    focus: "Membangun antarmuka Next.js 15 konsol industri 4-persona, streaming audio WebAudio API 16 kHz, dan visualisasi spektrogram real-time.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Muhammad Ihya Abdillah",
    role: "AI & RAG Engineer",
    tag: "LLM & MLOps",
    icon: Sparkles,
    accentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    avatarUrl: "", // Isi dengan path foto, contoh: "/team/ai-rag.jpg"
    focus: "Mengembangkan Cognitive Diagnostic Core berbasis Gemini 2.0 Flash RAG untuk rekomendasi SOP preskriptif standar ISO 10816-3.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Yasmin Tia Nizarini",
    role: "Product & Proposal Lead",
    tag: "Product & Strategy",
    icon: FileText,
    accentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    avatarUrl: "", // Isi dengan path foto, contoh: "/team/product.jpg"
    focus: "Menyusun proposal teknis, memimpin strategi kepatuhan booklet lomba COMPFEST 18 AIC, serta mengelola koordinasi dan roadmap proyek.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Zaskia Azzahra",
    role: "Data & ML Pipeline Engineer",
    tag: "Data Pipeline",
    icon: Database,
    accentColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    avatarUrl: "", // Isi dengan path foto, contoh: "/team/data-engineer.jpg"
    focus: "Mengkurasi dan memproses dataset audio industri Hitachi MIMII, augmentasi sinyal multi-SNR, dan validasi spektrum akustik.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#27272A]/60">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>AKU MAU FOKUS HIMA TEAM · COMPFEST 18 AIC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Aku Mau Fokus Hima Team
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal">
            Tim Pengembang EchoFactory — Kolaborasi 5 anggota lintas disiplin AI, Full-Stack, Data Pipeline, dan Product Strategy.
          </p>
        </div>
      </div>

      {/* Team Cards Grid — Clean Hackathon Layout (3 Top + 2 Centered Bottom) */}
      <div className="space-y-5">
        {/* Row 1: 3 Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEAM_MEMBERS.slice(0, 3).map((member, idx) => (
            <MemberCard key={idx} member={member} />
          ))}
        </div>

        {/* Row 2: 2 Members (Centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:w-2/3 md:mx-auto">
          {TEAM_MEMBERS.slice(3).map((member, idx) => (
            <MemberCard key={idx + 3} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const IconComp = member.icon;
  const [imgError, setImgError] = useState(false);

  const hasPhoto = Boolean(member.avatarUrl && member.avatarUrl.trim().length > 0 && !imgError);

  return (
    <div className="p-6 rounded-2xl bg-[#09090C] border border-[#222226] hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:bg-[#0D0D12]">
      <div>
        {/* Card Header: Prominent Avatar Photo / Fallback Icon + Role Tag */}
        <div className="flex items-start justify-between mb-4">
          {hasPhoto ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-zinc-700/80 group-hover:border-sky-500/60 shadow-lg group-hover:shadow-sky-500/10 transition-all">
              <Image
                src={member.avatarUrl!}
                alt={member.name}
                fill
                className="object-cover object-[center_22%]"
                onError={() => setImgError(true)}
                unoptimized
              />
            </div>
          ) : (
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center ${member.accentColor}`}>
              <IconComp className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          )}

          <Badge variant="mono" className="text-[10px] font-mono border-zinc-800 bg-zinc-900/80 text-zinc-400">
            {member.tag}
          </Badge>
        </div>

        {/* Name & Hackathon Role */}
        <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-sky-300 transition-colors">
          {member.name}
        </h3>
        <div className="text-xs font-mono font-medium text-sky-400 mb-3">
          {member.role}
        </div>

        {/* Clean Single Focus Description */}
        <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
          {member.focus}
        </p>
      </div>

      {/* Social Links Footer */}
      <div className="border-t border-[#1C1C20] pt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Aku Mau Fokus Hima Team
        </span>
        <div className="flex items-center gap-2.5 text-zinc-500">
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
}
