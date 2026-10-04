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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#2e2e2e]">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-[#e84c1a]" />
          <span className="text-sm font-semibold text-[#e0e0e0]">FireSynergize</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
                  active
                    ? "text-[#e84c1a]"
                    : "text-[#888] hover:text-[#e0e0e0]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/#chat"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e84c1a] text-white text-sm font-medium hover:bg-[#d43e0f] transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around px-2 pb-2 border-t border-[#2e2e2e]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
                active ? "text-[#e84c1a]" : "text-[#666] hover:text-[#e0e0e0]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
