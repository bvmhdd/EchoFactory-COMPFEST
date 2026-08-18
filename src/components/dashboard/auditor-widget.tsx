"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Copy, Check, QrCode, Lock, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";

export function AuditorWidget({ result }: { result: DetectionResult }) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(result.auditor_view.proof_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl border border-[#27272A] bg-[#09090B] flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase">
                Auditor & Warranty Trust Ledger
              </span>
              <span className="text-[10px] text-zinc-400 block font-mono">Immutable Passport on Polygon Amoy</span>
            </div>
          </div>

          <Badge variant="mono" className="text-[10px] font-mono border-purple-500/30 bg-purple-500/10 text-purple-300">
            Chain ID: 80002
          </Badge>
        </div>

        {/* Hash & Verification Details */}
        <div className="space-y-2.5 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
              <span className="uppercase">Tamper-Proof Audit Hash (SHA-256)</span>
              <button
                onClick={handleCopyHash}
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A] text-zinc-300 text-[11px] truncate select-all">
              {result.auditor_view.proof_hash}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-zinc-400 block text-[9px] uppercase">Block Commitment</span>
              <span className="text-zinc-200 font-semibold">#{result.auditor_view.block_number}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-zinc-400 block text-[9px] uppercase">Ledger State</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> VERIFIED ON-CHAIN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Links & QR Code Trigger */}
      <div className="pt-3 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <a
          href={result.auditor_view.polygonscan_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          <span>Verify on PolygonScan Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => setShowQrModal(!showQrModal)}
          className="px-2.5 py-1 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{showQrModal ? "Close QR" : "Passport QR"}</span>
        </button>
      </div>

      {/* QR Code Inline Modal */}
      {showQrModal && (
        <div className="p-4 rounded-xl bg-white text-black flex flex-col items-center justify-center space-y-2 mt-2 animate-in fade-in">
          <QrCode className="w-24 h-24 stroke-[1.5]" />
          <span className="text-[10px] font-mono font-bold uppercase text-center">
            Scan to Verify Passport (Polygon Amoy)
          </span>
          <span className="text-[9px] font-mono text-zinc-600 truncate max-w-[200px]">
            {result.auditor_view.proof_hash}
          </span>
        </div>
      )}
    </div>
  );
}
