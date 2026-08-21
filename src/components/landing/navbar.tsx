"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EchoFactoryLogo } from "@/components/brand/logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-[#27272A]/80 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <EchoFactoryLogo size="md" subtitle="Smart Manufacturing" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
          <a href="#preview" className="hover:text-white transition-colors">
            Fitur
          </a>
          <a href="#personas" className="hover:text-white transition-colors">
            Solusi
          </a>
          <a href="#machines" className="hover:text-white transition-colors">
            Benchmark
          </a>
          <a href="#blockchain" className="hover:text-white transition-colors">
            On-Chain Ledger
          </a>
          <a href="#team" className="hover:text-white transition-colors">
            Tim Kami
          </a>
        </nav>

        {/* Right Action / Status */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111113] border border-[#27272A] text-[11px] font-mono text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Amoy Testnet</span>
          </div>

          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold px-4 py-2">
              Buka Konsol
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B] border-b border-[#27272A] px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-3">
          <a
            href="#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 hover:text-white"
          >
            Fitur
          </a>
          <a
            href="#personas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 hover:text-white"
          >
            Solusi
          </a>
          <a
            href="#machines"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 hover:text-white"
          >
            Benchmark
          </a>
          <a
            href="#blockchain"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 hover:text-white"
          >
            On-Chain Ledger
          </a>
          <a
            href="#team"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 hover:text-white"
          >
            Tim Kami
          </a>

          <div className="pt-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full justify-center text-xs font-semibold">
                Buka Konsol
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
