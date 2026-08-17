"use client";

import { Activity, Wrench, BarChart3, ShieldCheck, ArrowUpRight, CheckCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PersonaBento() {
  return (
    <section id="personas" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Durable autonomy.
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Every acoustic run empowers 4 stakeholders simultaneously.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
          One 10-second sound ingestion generates real-time operator alerts, ISO standard root-cause SOPs, executive financial metrics, and immutable on-chain audit records.
        </p>
      </div>

      {/* 4-Persona Bento Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Operator Lapangan */}
        <Card className="hover:border-zinc-500 transition-all group bg-[#0A0A0B]/90">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <Badge variant="info">ACT-01: FIELD TECHNICIAN</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors">
              Instant Pass/Fail & High-Frequency Spectrogram
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Sub-50ms visual indicator with zero latency. Provides audio waveform scrubbing and frequency heatmaps on edge tablets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Inference Response:</span>
                <span className="text-emerald-400 font-semibold">&lt; 42.6 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Visual Indicator:</span>
                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  🔴 ABNORMAL ALERT (Score: 0.887)
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Model Target:</span>
                <span className="text-zinc-400">STgram-MFN v3 ONNX (183.8 KB)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Supervisor Maintenance */}
        <Card className="hover:border-zinc-500 transition-all group bg-[#0A0A0B]/90">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <Badge variant="warning">ACT-02: MAINTENANCE LEAD</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-amber-300 transition-colors">
              ISO 10816 Root Cause & Preventive SOP Plan
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Categorizes mechanical vibration severity and drafts actionable maintenance SOPs, spare parts numbers, and work orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Vibration Standard:</span>
                <span className="text-amber-400">ISO 10816-3 Class II</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Diagnosed Defect:</span>
                <span className="text-white font-semibold">Bearing Outer Race Degradation</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Actionable SOP:</span>
                <span className="text-zinc-400 truncate max-w-[200px]">Grease ISO VG 46 / Part #SKF-6204</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Plant Manager */}
        <Card className="hover:border-zinc-500 transition-all group bg-[#0A0A0B]/90">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <Badge variant="success">ACT-03: PLANT EXECUTIVE</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-emerald-300 transition-colors">
              Machine Health Index & Downtime Risk Gauge
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Real-time health score percentage, RUL estimation, and quantifiable financial downtime losses mitigated before catastrophic failure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Asset Health Index:</span>
                <span className="text-emerald-400 font-bold">62.0% (Medium Degradation)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Downtime Mitigated:</span>
                <span className="text-white font-semibold">$4,200 USD / Incident</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Remaining Life (RUL):</span>
                <span className="text-amber-400 font-semibold">~18 Operating Days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Auditor & Insurance */}
        <Card className="hover:border-zinc-500 transition-all group bg-[#0A0A0B]/90">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <Badge variant="default" className="text-purple-300 border-purple-500/30 bg-purple-500/10">
                ACT-04: AUDITOR & INSURANCE
              </Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
              Tamper-Proof Machine Passport On-Chain
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Immutable SHA-256 cryptographic commitments written to Polygon Amoy Testnet for trusted warranty claims and machine appraisal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Smart Contract:</span>
                <span className="text-cyan-400 truncate max-w-[200px]">0xFEc1FcFfF8...D6864</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Ledger Network:</span>
                <span className="text-zinc-300">Polygon Amoy Testnet (80002)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Verification Method:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> PolygonScan Explorer Link
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
