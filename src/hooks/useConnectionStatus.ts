"use client";

import { useState, useEffect, useCallback } from "react";

export interface ConnectionStatus {
  hfBackend: "live" | "sleeping" | "offline" | "unconfigured";
  geminiApi: "active" | "not_configured";
  smartContract: "linked" | "simulated";
  hfUrl: string;
  contractAddress: string;
  latencyMs: number | null;
}

export function useConnectionStatus() {
  const hfUrl = process.env.NEXT_PUBLIC_HF_BACKEND_URL ?? "";
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
    "0xFEc1FcFfF8E1C4B3470a677387F95bC3f1fD6864";
  const geminiEnabled = process.env.NEXT_PUBLIC_GEMINI_ENABLED === "true";

  const [status, setStatus] = useState<ConnectionStatus>({
    hfBackend: hfUrl ? "sleeping" : "unconfigured",
    geminiApi: geminiEnabled ? "active" : "not_configured",
    smartContract: "simulated",
    hfUrl,
    contractAddress,
    latencyMs: null,
  });

  const check = useCallback(async () => {
    const t0 = Date.now();
    try {
      const res = await fetch("/api/v1/detect-acoustic", {
        signal: AbortSignal.timeout(8000),
      });
      const latencyMs = Date.now() - t0;
      if (res.ok) {
        const data = await res.json();
        setStatus((prev) => ({
          ...prev,
          hfBackend: data.hfStatus ?? (latencyMs < 2500 ? "live" : "sleeping"),
          geminiApi: data.geminiConfigured ? "active" : "not_configured",
          smartContract: "linked",
          latencyMs,
        }));
      } else {
        setStatus((prev) => ({ ...prev, hfBackend: "offline", latencyMs: null }));
      }
    } catch {
      setStatus((prev) => ({
        ...prev,
        hfBackend: hfUrl ? "offline" : "unconfigured",
        latencyMs: null,
      }));
    }
  }, [hfUrl, geminiEnabled]);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  return { ...status, refresh: check };
}
