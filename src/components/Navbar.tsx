"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSimulation } from "@/components/SimulationProvider";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "#virtual-lab", label: "Virtual Lab" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#biofingerprint", label: "BioFingerprint" },
  { href: "#digital-twin", label: "Digital Twin" },
  { href: "#biodiscovery", label: "BioDiscovery" },
  { href: "#workflow", label: "Workflow" },
  { href: "#security", label: "Security" },
  { href: "#validation", label: "Validation" },
  { href: "#research", label: "Research" },
];

export function KairosLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="#0a1a3f" />
      <path d="M11 7 C 21 12, 11 20, 21 25" stroke="#14c6c0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M21 7 C 11 12, 21 20, 11 25" stroke="#4f9dff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="13" y1="11" x2="19" y2="11" stroke="#fff" strokeOpacity=".7" />
      <line x1="13" y1="16" x2="19" y2="16" stroke="#fff" strokeOpacity=".7" />
      <line x1="13" y1="21" x2="19" y2="21" stroke="#fff" strokeOpacity=".7" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { anomaly, lastUpdate } = useSimulation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all",
        scrolled ? "glass border-b border-sci-100 shadow-sm" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5">
          <KairosLogo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-[0.18em] text-navy-900">KAIROS</span>
        </a>
        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-600 hover:bg-sci-50 hover:text-navy-900">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "hidden items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider sm:inline-flex",
              anomaly.detected ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
            aria-live="polite"
          >
            <span className={cn("h-2 w-2 rounded-full animate-pulse-soft", anomaly.detected ? "bg-red-500" : "bg-emerald-500")} />
            LIVE PROTOTYPE SIMULATION
            <span className="hidden text-slate-500 2xl:inline">{lastUpdate}</span>
          </span>
          <button
            className="rounded-lg p-2 text-navy-900 hover:bg-sci-50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass border-b border-sci-100 xl:hidden">
          <ul className="mx-auto grid max-w-[1320px] grid-cols-2 gap-1 px-5 py-3 sm:grid-cols-3 md:px-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sci-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
