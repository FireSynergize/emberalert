"use client";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "fire" | "red" | "amber" | "green" | "purple";
  pulse?: boolean;
}

const COLOR_MAP = {
  fire: { icon: "text-[#ff4500]", bg: "bg-[rgba(255,69,0,0.1)]", border: "border-[rgba(255,69,0,0.2)]", glow: "shadow-[rgba(255,69,0,0.15)]" },
  red: { icon: "text-red-400", bg: "bg-[rgba(239,68,68,0.1)]", border: "border-[rgba(239,68,68,0.2)]", glow: "shadow-[rgba(239,68,68,0.15)]" },
  amber: { icon: "text-amber-400", bg: "bg-[rgba(251,191,36,0.1)]", border: "border-[rgba(251,191,36,0.2)]", glow: "shadow-[rgba(251,191,36,0.15)]" },
  green: { icon: "text-green-400", bg: "bg-[rgba(74,222,128,0.1)]", border: "border-[rgba(74,222,128,0.2)]", glow: "shadow-[rgba(74,222,128,0.15)]" },
  purple: { icon: "text-purple-400", bg: "bg-[rgba(192,132,252,0.1)]", border: "border-[rgba(192,132,252,0.2)]", glow: "shadow-[rgba(192,132,252,0.15)]" },
};

export function StatCard({ title, value, subValue, icon: Icon, trend, color = "fire", pulse }: StatCardProps) {
  const c = COLOR_MAP[color];

  return (
    <div className={cn(
      "glass-fire rounded-xl p-5 border",
      c.border,
      "shadow-lg",
      c.glow,
      "hover:scale-[1.02] transition-transform duration-200"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[rgba(245,240,234,0.5)] uppercase tracking-wider mb-2">{title}</p>
          <p
            className={cn("text-2xl font-bold", c.icon)}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subValue && (
            <p className="text-xs text-[rgba(245,240,234,0.5)] mt-1">{subValue}</p>
          )}
        </div>
        <div className={cn("relative p-2.5 rounded-lg", c.bg)}>
          <Icon className={cn("h-5 w-5", c.icon)} />
          {pulse && (
            <span className="absolute top-1 right-1 h-2 w-2">
              <span className={cn("absolute inline-flex h-full w-full rounded-full animate-ping opacity-75", c.icon.replace("text-", "bg-").replace("[", "").replace("]", ""))} />
              <span className={cn("relative inline-flex rounded-full h-2 w-2", c.bg.replace("bg-[rgba", "bg-[rgba").replace("0.1)", "0.8)"))} />
            </span>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <span className={cn(
            "text-xs font-medium",
            trend.value > 0 ? "text-red-400" : "text-green-400"
          )}>
            {trend.value > 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-[rgba(245,240,234,0.4)] ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
