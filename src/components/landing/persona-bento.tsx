"use client";

import { Activity, Wrench, BarChart3, ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PersonaBento() {
  return (
    <section id="personas" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Satu diagnosis. Empat sudut pandang.
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Satu sampel suara menghasilkan wawasan terintegrasi untuk seluruh pemangku kepentingan.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
          Dari teknisi di lantai pabrik hingga auditor asuransi, EchoFactory menyediakan informasi spesifik yang relevan dan dapat langsung ditindaklanjuti.
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
              <Badge variant="info">Teknisi Lapangan</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors">
              Status Cepat & Visualisasi Spektrogram
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Indikator visual instan dengan latensi di bawah 50 ms. Memberikan visualisasi heatmap frekuensi untuk verifikasi langsung di lapangan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Waktu Respon:</span>
                <span className="text-emerald-400 font-semibold">&lt; 50 ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Indikator Status:</span>
                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> Abnormal (Skor: 0.887)
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Model AI:</span>
                <span className="text-zinc-400">STgram-MFN v3 Edge</span>
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
              <Badge variant="warning">Supervisor Maintenance</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-amber-300 transition-colors">
              Analisis Akar Masalah & Rekomendasi SOP
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Mengidentifikasi keparahan getaran mekanik dan menyusun panduan perbaikan, estimasi suku cadang, serta tiket work order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Standar Getaran:</span>
                <span className="text-amber-400">ISO 10816-3 Class II</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Indikasi Kerusakan:</span>
                <span className="text-white font-semibold">Degradasi Bearing Outer Race</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>SOP Perbaikan:</span>
                <span className="text-zinc-400 truncate max-w-[200px]">Pelumasan ISO VG 46 / Part #SKF-6204</span>
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
              <Badge variant="success">Plant Manager</Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-emerald-300 transition-colors">
              Indeks Kesehatan & Mitigasi Risiko Downtime
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Menampilkan skor kesehatan aset, estimasi sisa umur operasi (RUL), dan kalkulasi potensi kerugian biaya yang berhasil dicegah.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Health Index:</span>
                <span className="text-emerald-400 font-bold">62.0% (Kondisi Waspada)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Downtime Dicegah:</span>
                <span className="text-white font-semibold">$4,200 USD / Insiden</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Estimasi Sisa Umur:</span>
                <span className="text-amber-400 font-semibold">~18 Hari Operasional</span>
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
                Auditor & Compliance
              </Badge>
            </div>
            <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
              Paspor Kesehatan Mesin On-Chain
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Pencatatan hash inspeksi kriptografis permanen ke jaringan Polygon Amoy untuk klaim garansi transparan dan audit kepatuhan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Smart Contract:</span>
                <span className="text-cyan-400 truncate max-w-[200px]">0xFEc1FcFfF8...D6864</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Jaringan Ledger:</span>
                <span className="text-zinc-300">Polygon Amoy Testnet (80002)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Verifikasi:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> PolygonScan Verified
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
