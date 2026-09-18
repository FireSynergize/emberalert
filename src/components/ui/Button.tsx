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
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0500]",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          variant === "fire" && [
            "bg-gradient-to-r from-[#ff4500] to-[#ff6b00]",
            "text-white",
            "hover:from-[#ff5a1a] hover:to-[#ff7b1a]",
            "active:scale-[0.98]",
            "shadow-lg shadow-[rgba(255,69,0,0.3)]",
            "hover:shadow-[rgba(255,69,0,0.5)]",
          ],
          variant === "ghost" && [
            "bg-transparent text-[#f5f0ea] hover:bg-[rgba(255,69,0,0.1)]",
            "hover:text-[#ff7b35]",
          ],
          variant === "outline" && [
            "border border-[rgba(255,69,0,0.4)] text-[#ff7b35]",
            "hover:bg-[rgba(255,69,0,0.1)] hover:border-[rgba(255,69,0,0.7)]",
          ],
          variant === "danger" && [
            "bg-[rgba(220,38,38,0.2)] border border-[rgba(220,38,38,0.4)] text-red-400",
            "hover:bg-[rgba(220,38,38,0.3)]",
          ],

          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
