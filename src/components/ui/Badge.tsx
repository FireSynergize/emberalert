import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "fire" | "green" | "yellow" | "amber" | "red" | "purple" | "smoke";
  pulse?: boolean;
}

export function Badge({ className, variant = "fire", pulse, children, ...props }: BadgeProps) {
  const colors = {
    fire:   "bg-[#2a1a12] text-[#e84c1a] border border-[#3a2018]",
    green:  "bg-[#0f2318] text-[#22c55e] border border-[#1a3828]",
    yellow: "bg-[#231f0a] text-[#eab308] border border-[#352e10]",
    amber:  "bg-[#231a0a] text-[#f59e0b] border border-[#352810]",
    red:    "bg-[#2a1010] text-[#f87171] border border-[#3a1818]",
    purple: "bg-[#1e1228] text-[#c084fc] border border-[#2e1a3a]",
    smoke:  "bg-[#1c1c1c] text-[#888] border border-[#2e2e2e]",
  };

  const dotColor = {
    fire: "bg-[#e84c1a]", green: "bg-green-500", red: "bg-red-500",
    yellow: "bg-yellow-500", amber: "bg-amber-500", purple: "bg-purple-500", smoke: "bg-[#666]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium",
        colors[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={cn("absolute inline-flex h-full w-full rounded-full animate-ping opacity-75", dotColor[variant])} />
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColor[variant])} />
        </span>
      )}
      {children}
    </span>
  );
}
