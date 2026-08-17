import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
          // Variants
          variant === "primary" &&
            "bg-[#0A0A0B] text-white border border-[#2A2A2E] hover:border-zinc-400 hover:bg-[#141416] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] rounded-full",
          variant === "secondary" &&
            "bg-white text-black font-semibold hover:bg-zinc-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] rounded-full",
          variant === "outline" &&
            "border border-[#2A2A2E] text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-[#111113] rounded-full",
          variant === "ghost" &&
            "text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg",
          variant === "danger" &&
            "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 rounded-full",
          variant === "success" &&
            "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 rounded-full",
          // Sizes
          size === "sm" && "text-xs px-3.5 py-1.5 gap-1.5",
          size === "md" && "text-sm px-5 py-2.5 gap-2",
          size === "lg" && "text-base px-7 py-3.5 gap-2.5 font-semibold",
          size === "icon" && "p-2.5 rounded-full",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
