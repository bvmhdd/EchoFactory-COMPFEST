import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "mono";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
        variant === "default" &&
          "border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md",
        variant === "mono" &&
          "border border-[#2A2A2E] bg-[#111113] text-zinc-200",
        variant === "success" &&
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        variant === "warning" &&
          "border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
        variant === "danger" &&
          "border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
        variant === "info" &&
          "border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.15)]",
        variant === "outline" &&
          "border border-zinc-700 text-zinc-400",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
