import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2E]/60 bg-[#050505] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-wider text-white">ECHOFACTORY</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Industrial Acoustic AI & Tamper-Proof Health Ledger. Sub-50ms edge inference for smart manufacturing predictive maintenance.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>STgram-MFN v3 ONNX Edge • Polygon Amoy 80002</span>
          </div>
        </div>

        {/* Links: Platform */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <a href="#preview" className="hover:text-white transition-colors">
                Stateful Execution
              </a>
            </li>
            <li>
              <a href="#personas" className="hover:text-white transition-colors">
                4-Persona Unified Console
              </a>
            </li>
            <li>
              <a href="#machines" className="hover:text-white transition-colors">
                Hitachi MIMII Benchmark
              </a>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors text-cyan-400">
                Launch Live Console »
              </Link>
            </li>
          </ul>
        </div>

        {/* Links: Compliance */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-4">Standards</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <span className="text-zinc-400">ISO 10816-3 Vibration</span>
            </li>
            <li>
              <span className="text-zinc-400">IEEE Liu et al., 2022</span>
            </li>
            <li>
              <span className="text-zinc-400">ERC-721 Health Passport</span>
            </li>
            <li>
              <a
                href="https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-purple-400"
              >
                Polygon Amoy Explorer ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Links: Challenge */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-4">Challenge</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <span className="text-zinc-400">COMPFEST 18 AIC</span>
            </li>
            <li>
              <span className="text-zinc-400">Sub-Tema: Smart Mfg</span>
            </li>
            <li>
              <span className="text-zinc-400">Booklet Page 15 Compliant</span>
            </li>
            <li>
              <span className="text-zinc-400">MIT Open Source License</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#2A2A2E]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <span>© 2026 EchoFactory Team. All rights reserved.</span>
        <span>Unified Single-Screen Industrial Console Architecture.</span>
      </div>
    </footer>
  );
}
