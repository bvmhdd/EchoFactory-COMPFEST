"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Copy, Check, QrCode, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SMART_CONTRACT_ADDRESS, POLYGON_NETWORK, generateProofHash } from "@/lib/inference-engine";

export function BlockchainPassport() {
  const [copied, setCopied] = useState(false);
  const sampleHash = "0x8f3c71a9e2d5b6a7c8e9f0123456789abcdef0123456789abcdef0123456789a";

  const handleCopy = () => {
    navigator.clipboard.writeText(SMART_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="blockchain" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Tamper-proof audit.
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Machine Health Passport anchored on Polygon Amoy.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
          Prevent maintenance fraud and counterfeit service logs. Every acoustic inspection generates an immutable on-chain cryptographic commitment.
        </p>
      </div>

      {/* Main Blockchain Box */}
      <div className="rounded-2xl border border-[#2A2A2E] bg-[#0A0A0B] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              SMART CONTRACT: MachineHealthPassport.sol
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Cryptographic machine identity for warranty & secondary market valuation.
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Insurance companies and prospective machine buyers can verify the entire acoustic degradation history of an industrial asset by scanning the machine’s physical QR code linked to Polygon Amoy Testnet.
            </p>

            {/* Contract Info Box */}
            <div className="p-4 rounded-xl bg-[#111113] border border-[#2A2A2E] space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-zinc-300">
                <span className="text-zinc-400">Contract Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 break-all">{SMART_CONTRACT_ADDRESS}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-zinc-300">
                <span className="text-zinc-400">Network & Chain ID:</span>
                <span className="text-zinc-200">{POLYGON_NETWORK}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-zinc-300">
                <span className="text-zinc-400">Sample Ingestion Hash:</span>
                <span className="text-zinc-400 truncate max-w-[280px]">{sampleHash}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={`https://amoy.polygonscan.com/address/${SMART_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md" className="gap-2 font-mono text-xs">
                  <ExternalLink className="w-4 h-4" />
                  VERIFY ON POLYGONSCAN AMOY
                </Button>
              </a>

              <a
                href="https://github.com/ethereum/solidity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="md" className="gap-2 font-mono text-xs">
                  <Database className="w-4 h-4" />
                  VIEW SOLIDITY CONTRACT
                </Button>
              </a>
            </div>
          </div>

          {/* Right Card: Mobile QR Code & Passport Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-[#111113] border border-[#2A2A2E] shadow-2xl flex flex-col items-center text-center relative">
              <div className="w-full flex items-center justify-between border-b border-[#2A2A2E] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    PASSPORT VERIFICATION
                  </span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  ON-CHAIN
                </Badge>
              </div>

              {/* QR Code Placeholder Graphic */}
              <div className="w-44 h-44 bg-white p-3 rounded-xl mb-4 shadow-inner flex flex-col items-center justify-center relative group">
                <div className="w-full h-full border-2 border-black border-dashed flex flex-col items-center justify-center p-2 text-black">
                  <QrCode className="w-24 h-24 stroke-[1.5] text-black mb-1" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-center">
                    SCAN FOR AMOY PROOF
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-300 font-semibold mb-1">
                FAN-LINE-01 / SKF-6204
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mb-3">
                Block #15894412 • 0x8f3c...6789a
              </div>

              <div className="w-full py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-mono flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                100% Cryptographically Validated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
