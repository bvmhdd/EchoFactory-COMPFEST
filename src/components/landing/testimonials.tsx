"use client";

import { Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      quote:
        "EchoFactory detected our line 4 centrifugal pump cavitation 14 days before standard vibration sensors triggered. The ISO 10816-3 root-cause SOP saved us over $24,000 in emergency downtime.",
      author: "Hendra Wijaya, ST",
      role: "Lead Reliability Engineer",
      company: "PT Nusantara Heavy Industries",
    },
    {
      quote:
        "The Polygon Amoy tamper-proof blockchain passport completely resolved dispute claims between our equipment leasing department and factory operators. The SHA-256 validation is brilliant.",
      author: "Ir. Bambang Prasetyo",
      role: "VP of Asset Integrity & ISO Auditor",
      company: "Apex Global Manufacturing",
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#2A2A2E]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Teams moving faster
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-400 font-normal">
            with autonomous acoustic intelligence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-[#0A0A0B] border border-[#2A2A2E] flex flex-col justify-between relative hover:border-zinc-500 transition-colors"
          >
            <Quote className="w-8 h-8 text-zinc-700 mb-6" />
            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal mb-8">
              &ldquo;{rev.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[#2A2A2E]/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-400 flex items-center justify-center font-bold text-sm text-black">
                {rev.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm text-white">{rev.author}</div>
                <div className="text-xs text-zinc-400">
                  {rev.role} • <span className="text-zinc-300">{rev.company}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
