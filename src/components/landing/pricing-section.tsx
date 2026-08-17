"use client";

import Link from "next/link";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const tiers = [
    {
      name: "Edge Evaluation",
      price: "$0",
      period: "forever",
      description: "Ideal for testing STgram-MFN v3 acoustic models on local workstations.",
      features: [
        "1 Edge Sensor Ingestion",
        "Sub-50ms Offline Inference",
        "4 Standard Machine Types",
        "WebAudio Microphone Recording",
        "Local SHA-256 Hash Generation",
        "Community Discord Support",
      ],
      cta: "GET STARTED »",
      popular: false,
    },
    {
      name: "Production Line",
      price: "$19",
      period: "per line / mo",
      description: "Continuous 24/7 monitoring for critical plant pumps, fans, and sliders.",
      features: [
        "Up to 5 Industrial Lines",
        "Continuous 0 dB SNR Filtering",
        "ISO 10816 SOP Diagnostics",
        "Polygon Amoy On-Chain Passport",
        "Automated Work Order Drafts",
        "Email & SMS Downtime Alerts",
      ],
      cta: "START TRIAL »",
      popular: false,
    },
    {
      name: "Factory Fleet",
      price: "$49",
      period: "per line / mo",
      description: "Full factory deployment with plant executive fleet analytics.",
      features: [
        "Unlimited Machine Ingestion",
        "Real-Time Health Index Gauges",
        "Financial Downtime Loss Estimator",
        "Automated QR Code Generator",
        "Polygon Amoy + Mainnet Ready",
        "24/7 Dedicated Reliability SLA",
      ],
      cta: "UPGRADE FLEET »",
      popular: true,
    },
    {
      name: "Enterprise Custom",
      price: "Custom",
      period: "annual contract",
      description: "Custom OEM integration for industrial machinery manufacturers.",
      features: [
        "Private Polygon Subnet / ZK-Rollup",
        "On-Premises Edge Firmware Flashing",
        "Custom Machine Acoustic Training",
        "Direct SAP / Siemens ERP Connector",
        "Parametric Warranty Smart Contracts",
        "On-Site Field Engineer Support",
      ],
      cta: "CONTACT SALES »",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Predictive maintenance.
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            Transparent pricing tailored for modern industrial plants.
          </p>
        </div>
        <p className="max-w-md text-sm text-zinc-400 leading-relaxed">
          Zero hardware vendor lock-in. Compatible with standard MEMS microphones and existing vibration sensor lines.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
              tier.popular
                ? "bg-[#111113] border-white/40 shadow-[0_0_35px_rgba(255,255,255,0.1)] ring-1 ring-white/20"
                : "bg-[#0A0A0B] border-[#2A2A2E] hover:border-zinc-500"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="bg-white text-black font-semibold text-[10px] uppercase tracking-wider">
                  MOST POPULAR
                </Badge>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold text-zinc-300 mb-1">{tier.name}</div>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-bold font-mono text-white">{tier.price}</span>
                <span className="text-xs text-zinc-400">/{tier.period}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {tier.description}
              </p>

              <div className="border-t border-[#2A2A2E]/60 pt-4 space-y-3 mb-8">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="w-full">
              <Button
                variant={tier.popular ? "secondary" : "primary"}
                className="w-full justify-center text-xs font-mono py-2.5"
              >
                {tier.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
