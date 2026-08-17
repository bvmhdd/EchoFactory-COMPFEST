"use client";

import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-4 block">
          SMART MANUFACTURING • COMPFEST 18 AIC
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Stop babysitting machines.
          <br />
          <span className="text-zinc-400">Let acoustic AI protect your plant.</span>
        </h2>

        <p className="max-w-xl mx-auto text-base text-zinc-400 leading-relaxed mb-10">
          Deploy the STgram-MFN v3 acoustic engine in seconds. 100% offline edge-ready with immutable blockchain audit logs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="px-8 py-3.5 text-sm font-semibold gap-2 border-zinc-700 hover:border-white">
              LAUNCH CONSOLE »
            </Button>
          </Link>

          <a
            href="https://amoy.polygonscan.com/address/0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg" className="px-8 py-3.5 text-sm font-semibold gap-2">
              AUDIT ON POLYGONSCAN
              <ArrowUpRight className="w-4 h-4 text-black" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
