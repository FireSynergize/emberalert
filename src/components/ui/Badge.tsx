import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "fire" | "green" | "yellow" | "amber" | "red" | "purple" | "smoke";
  pulse?: boolean;
}

export function Badge({ className, variant = "fire", pulse, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "fire" && "bg-[rgba(255,69,0,0.15)] text-[#ff7b35] border border-[rgba(255,69,0,0.3)]",
        variant === "green" && "bg-[rgba(0,228,0,0.1)] text-[#4ade80] border border-[rgba(0,228,0,0.2)]",
        variant === "yellow" && "bg-[rgba(250,204,21,0.1)] text-[#fbbf24] border border-[rgba(250,204,21,0.2)]",
        variant === "amber" && "bg-[rgba(251,191,36,0.1)] text-[#f59e0b] border border-[rgba(251,191,36,0.2)]",
        variant === "red" && "bg-[rgba(239,68,68,0.1)] text-[#f87171] border border-[rgba(239,68,68,0.2)]",
        variant === "purple" && "bg-[rgba(168,85,247,0.1)] text-[#c084fc] border border-[rgba(168,85,247,0.2)]",
        variant === "smoke" && "bg-[rgba(74,74,74,0.3)] text-[#a3a3a3] border border-[rgba(74,74,74,0.4)]",
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            variant === "fire" && "bg-[#ff4500]",
            variant === "green" && "bg-green-400",
            variant === "red" && "bg-red-400",
            variant === "yellow" && "bg-yellow-400",
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === "fire" && "bg-[#ff4500]",
            variant === "green" && "bg-green-500",
            variant === "red" && "bg-red-500",
            variant === "yellow" && "bg-yellow-500",
          )} />
        </span>
      )}
      {children}
    </span>
  );
}
