"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Flame, Map, Calculator, Navigation, Heart, MessageCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Flame },
  { href: "/map", label: "Fire Map", icon: Map },
  { href: "/damages", label: "Damages", icon: Calculator },
  { href: "/escape", label: "Escape Routes", icon: Navigation },
  { href: "/relief", label: "Relief", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-smoke border-b border-[rgba(255,69,0,0.15)]">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Flame className="h-7 w-7 text-[#ff4500] animate-flicker group-hover:text-[#ff6b35] transition-colors" />
            <div className="absolute inset-0 blur-md bg-[#ff4500]/40 rounded-full animate-pulse" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-[#ff4500] text-glow">Fire</span>
            <span className="text-[#f5f0ea]">Synergize</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[rgba(255,69,0,0.15)] text-[#ff7b35] border border-[rgba(255,69,0,0.25)]"
                    : "text-[rgba(245,240,234,0.6)] hover:text-[#f5f0ea] hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-[#ff4500]")} />
                {label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/#chat"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#ff4500] to-[#ff6b00] text-white hover:from-[#ff5a1a] hover:to-[#ff7b1a] transition-all shadow-lg shadow-[rgba(255,69,0,0.3)] hover:shadow-[rgba(255,69,0,0.5)]"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around px-2 pb-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                active ? "text-[#ff7b35]" : "text-[rgba(245,240,234,0.5)] hover:text-[#f5f0ea]"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
