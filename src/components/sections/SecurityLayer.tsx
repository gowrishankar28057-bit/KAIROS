"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileClock, Fingerprint, KeyRound, Loader2, Lock, ScanLine, ServerCog, ShieldCheck, UserCog, Usb } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { OperatorIdentity } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export const SECURITY_SCAN_EVENT = "kairos:security-scan";

const LAYERS = [
  { icon: KeyRound, label: "API Key Authentication", text: "Every device and client call is authenticated." },
  { icon: Lock, label: "TLS Encryption", text: "Data encrypted in transit across MQTT and REST." },
  { icon: ServerCog, label: "Linux Gateway", text: "Hardened edge OS with minimal exposed services." },
  { icon: UserCog, label: "Role-Based Access", text: "Operators, scientists and admins see only what they need." },
  { icon: FileClock, label: "Audit Trail", text: "Actions and data changes logged for traceability." },
  { icon: Fingerprint, label: "Data Integrity", text: "Checksums / hashes to detect tampering of records." },
  { icon: Usb, label: "Secure Device Onboarding", text: "Only provisioned sensor nodes can join the network." },
];

const CHECKS = [
  { k: "DEVICE", v: "AUTHENTICATED" },
  { k: "GATEWAY", v: "HARDENED" },
  { k: "API", v: "ENCRYPTED" },
  { k: "DATABASE", v: "PROTECTED" },
  { k: "AUDIT", v: "ACTIVE" },
];

export function SecurityLayer() {
  const [step, setStep] = useState(-1);
  const [scanning, setScanning] = useState(false);
  const timer = useRef<number | null>(null);

  const scan = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    setScanning(true);
    setStep(-1);
    let i = -1;
    timer.current = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= CHECKS.length - 1) {
        if (timer.current) window.clearInterval(timer.current);
        setScanning(false);
      }
    }, 650);
  }, []);

  useEffect(() => {
    window.addEventListener(SECURITY_SCAN_EVENT, scan);
    return () => {
      window.removeEventListener(SECURITY_SCAN_EVENT, scan);
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [scan]);

  return (
    <Section id="security">
      <SectionHeader
        eyebrow="08 · Cyberbiosecurity"
        title="Biological Intelligence Must Also Be Secure"
        subtitle="KAIROS integrates cybersecurity into the biological data pipeline rather than treating security as an afterthought."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card id="security-shield" className="relative overflow-hidden p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-navy-900">Secure pipeline</p>
            <SimTag label="Simulated scan" />
          </div>
          <div className="relative mx-auto aspect-[5/6] max-w-[360px]">
            <svg viewBox="0 0 300 360" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="shield" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#e0efff" />
                  <stop offset="1" stopColor="#f0fdfa" />
                </linearGradient>
              </defs>
              {[0, 18, 36].map((inset, i) => (
                <path
                  key={inset}
                  d={`M150 ${10 + inset} L ${280 - inset} ${60 + inset * 0.6} V ${180} C ${280 - inset} ${270 - inset * 0.5}, ${210} ${330 - inset}, 150 ${350 - inset} C ${90} ${330 - inset}, ${20 + inset} ${270 - inset * 0.5}, ${20 + inset} 180 V ${60 + inset * 0.6} Z`}
                  fill={i === 0 ? "url(#shield)" : "none"}
                  stroke={i === 2 ? "#14c6c0" : "#93c5fd"}
                  strokeWidth={i === 2 ? 2 : 1.4}
                  strokeDasharray={i === 1 ? "5 5" : undefined}
                />
              ))}
            </svg>
            {scanning && (
              <div className="pointer-events-none absolute inset-x-10 inset-y-6 overflow-hidden">
                <div className="h-1/3 w-full animate-scan bg-gradient-to-b from-transparent via-teal-glow/30 to-transparent" />
              </div>
            )}
            <ol className="absolute inset-x-[22%] top-[17%] bottom-[16%] flex flex-col justify-between">
              {CHECKS.map((c, i) => {
                const done = step >= i;
                const busy = scanning && step === i - 1;
                return (
                  <li
                    key={c.k}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all",
                      done ? "border-teal-200 bg-white text-navy-900 shadow-sm" : "border-sci-100 bg-white/60 text-slate-400",
                    )}
                  >
                    <span>{c.k}</span>
                    <span className={cn("flex items-center gap-1", done && "text-teal-700")}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      {done ? c.v : "—"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className={cn("h-5 w-5", step >= CHECKS.length - 1 ? "text-teal-600" : "text-slate-300")} />
              {step >= CHECKS.length - 1 ? "All simulated checks passed" : "Run a simulated security scan"}
            </p>
            <Button variant="primary" size="sm" onClick={scan} disabled={scanning}>
              <ScanLine className="h-4 w-4" /> {scanning ? "Scanning…" : "Run Security Scan"}
            </Button>
          </div>
          <div className="mt-4 rounded-xl border border-sci-100 bg-sci-50/60 px-4 py-3">
            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">Current session · identity layer</p>
            <OperatorIdentity />
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn("rounded-2xl border border-sci-100 bg-white p-4", i === LAYERS.length - 1 && "sm:col-span-2")}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-teal-glow">
                  <l.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-semibold text-navy-900">{l.label}</p>
                  <p className="text-sm text-slate-500">{l.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
