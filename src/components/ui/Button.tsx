"use client";
import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fire" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "fire", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors rounded cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e84c1a]",
          "disabled:opacity-40 disabled:cursor-not-allowed",

          variant === "fire" && "bg-[#e84c1a] text-white hover:bg-[#d43e0f]",
          variant === "ghost" && "text-[#888] hover:text-[#e0e0e0] hover:bg-[#222]",
          variant === "outline" && "border border-[#2e2e2e] text-[#888] hover:border-[#444] hover:text-[#e0e0e0]",
          variant === "danger" && "border border-[#5a2020] text-[#f87171] hover:bg-[#2a1a1a]",

          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          size === "lg" && "h-11 px-5 text-sm",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
