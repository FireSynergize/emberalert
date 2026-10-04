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
  fire:   { icon: "text-[#e84c1a]", dot: "bg-[#e84c1a]" },
  red:    { icon: "text-red-400",    dot: "bg-red-400" },
  amber:  { icon: "text-amber-400",  dot: "bg-amber-400" },
  green:  { icon: "text-green-400",  dot: "bg-green-400" },
  purple: { icon: "text-purple-400", dot: "bg-purple-400" },
};

export function StatCard({ title, value, subValue, icon: Icon, trend, color = "fire", pulse }: StatCardProps) {
  const c = COLOR_MAP[color];

  return (
    <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1.5">{title}</p>
          <p className={cn("text-2xl font-bold", c.icon)}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subValue && <p className="text-xs text-[#666] mt-1">{subValue}</p>}
        </div>
        <div className="relative">
          <Icon className={cn("h-5 w-5 mt-0.5", c.icon)} />
          {pulse && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2">
              <span className={cn("absolute inline-flex h-full w-full rounded-full animate-ping opacity-60", c.dot)} />
              <span className={cn("relative inline-flex rounded-full h-2 w-2", c.dot)} />
            </span>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-[#2e2e2e]">
          <span className={cn("text-xs font-medium", trend.value > 0 ? "text-red-400" : "text-green-400")}>
            {trend.value > 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-[#666] ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
