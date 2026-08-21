"use client";

import { useState, useRef } from "react";
import { Cpu, Send, Mic, MicOff, Sparkles, Bot, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetectionResult } from "@/lib/inference-engine";

interface QueryAssistantProps {
  result: DetectionResult | null;
}

export function QueryAssistantWidget({ result }: QueryAssistantProps) {
  const [queryText, setQueryText] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [assistantOutput, setAssistantOutput] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<unknown>(null);

  const handleAskGemini = async (customPrompt?: string) => {
    const textToAsk = (customPrompt || queryText).trim();
    if (!textToAsk || isAsking) return;

    setIsAsking(true);
    setAssistantOutput(null);

    try {
      const res = await fetch("/api/v1/query-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToAsk,
          result: result,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAssistantOutput(data.answer);
      } else {
        setAssistantOutput(
          "[Gemini 2.0 Flash AI Assistant]\nGagal terhubung ke layanan Gemini API. Pastikan koneksi internet stabil."
        );
      }
    } catch {
      setAssistantOutput(
        "[Gemini 2.0 Flash AI Assistant]\nTerjadi kesalahan jaringan saat mengirim query."
      );
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleVoiceMic = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser Anda tidak mendukung Web Speech Recognition. Gunakan input teks.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        (recognitionRef.current as { stop: () => void }).stop();
      }
      setIsListening(false);
    } else {
      try {
        const SpeechReg =
          (window as unknown as { SpeechRecognition: new () => unknown }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition: new () => unknown }).webkitSpeechRecognition;
        const recog = new SpeechReg() as {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        };

        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "id-ID";

        recog.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQueryText(transcript);
          setIsListening(false);
          handleAskGemini(transcript);
        };

        recog.onerror = () => setIsListening(false);
        recog.onend = () => setIsListening(false);

        recognitionRef.current = recog;
        recog.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const suggestedQueries = [
    "Echo, berapa estimasi sisa umur operasional (RUL) mesin ini?",
    "Echo, apakah tingkat getaran saat ini berisiko bagi komponen?",
    "Echo, apa rekomendasi perbaikan preskriptif ISO 10816-3?",
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#050508] p-5 sm:p-6 space-y-5 shadow-2xl">
      {/* Section Header matching user screenshot */}
      <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <Bot className="w-4.5 h-4.5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Industrial Voice Assistant (Hands-Free Technical Query):
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Powered by Gemini 2.0 Flash LLM RAG · Contextual Acoustic Telemetry
            </p>
          </div>
        </div>

        <Badge variant="mono" className="text-[10px] font-mono bg-sky-500/10 text-sky-300 border-sky-500/30">
          <Sparkles className="w-3 h-3 mr-1 text-sky-400" />
          GEMINI 2.0 FLASH
        </Badge>
      </div>

      {/* Main Input Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Left Column: Textarea / Speech Input Box */}
        <div className="lg:col-span-9 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-zinc-400">
              Voice Query / Natural Language Input
            </label>

            {/* Voice Mic Toggle */}
            <button
              type="button"
              onClick={handleToggleVoiceMic}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono transition-all ${
                isListening
                  ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse"
                  : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3 h-3 text-rose-400" />
                  <span>Mendengarkan Suara...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span>Voice Mic</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskGemini();
                }
              }}
              placeholder="Example: 'Echo, what is the current vibration status of Fan 00?'"
              rows={3}
              className="w-full rounded-xl bg-[#0a0a0e] border border-zinc-800 p-3.5 text-xs text-white placeholder:text-zinc-600 font-sans focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
            />
          </div>

          {/* Quick Suggested Query Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono text-zinc-500">Saran Query:</span>
            {suggestedQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(sq);
                  handleAskGemini(sq);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#111115] hover:bg-[#1c1c22] border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-white transition-all text-left truncate max-w-[320px]"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Query Assistant Button */}
        <div className="lg:col-span-3">
          <Button
            type="button"
            onClick={() => handleAskGemini()}
            disabled={isAsking || !queryText.trim()}
            variant="secondary"
            size="lg"
            className="w-full justify-center text-xs font-bold tracking-wide gap-2 py-6 bg-[#1a2536] hover:bg-[#23334a] text-sky-200 border border-sky-500/30 shadow-lg transition-all"
          >
            {isAsking ? (
              <>
                <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>Memproses Gemini...</span>
              </>
            ) : (
              <>
                <span>Query Assistant »</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Output Container matching user screenshot */}
      <div className="space-y-2 pt-2 border-t border-[#1F1F23]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Assistant Diagnostic Output</span>
          </label>

          {assistantOutput && (
            <span className="text-[10px] font-mono text-emerald-400">
              ✓ Gemini 2.0 Flash Response Ready
            </span>
          )}
        </div>

        <div className="min-h-[100px] max-h-[260px] overflow-y-auto pr-2 rounded-xl bg-[#09090d] border border-zinc-800 p-4 font-sans text-xs text-zinc-200 leading-relaxed whitespace-pre-line shadow-inner scrollbar-thin">
          {isAsking ? (
            <div className="flex items-center gap-3 text-sky-400 animate-pulse font-mono text-xs py-4">
              <Cpu className="w-5 h-5 animate-spin" />
              <span>Gemini 2.0 Flash RAG sedang menganalisis query telemetri Anda...</span>
            </div>
          ) : assistantOutput ? (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-sky-400 font-semibold uppercase tracking-wider mb-1">
                [Gemini 2.0 Flash Response]
              </div>
              <div className="text-zinc-200">{assistantOutput}</div>
            </div>
          ) : (
            <span className="text-zinc-600 font-mono text-[11px] italic">
              Ketik pertanyaan teknis atau pilih saran query di atas, lalu tekan "Query Assistant »" untuk mendapatkan jawaban dari Gemini 2.0 Flash AI.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
