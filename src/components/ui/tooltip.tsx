"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight accessible tooltip. Opens on hover and keyboard focus,
 * linked to its trigger via aria-describedby.
 */
export function Tooltip({
  content,
  children,
  className,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 w-max max-w-64 -translate-x-1/2 rounded-lg bg-navy-900 px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-white shadow-xl",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/** A scientific term with a dotted underline and an explanatory tooltip. */
export function Term({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <Tooltip content={tip}>
      <span
        tabIndex={0}
        className="cursor-help border-b border-dotted border-sci-400 outline-none focus-visible:ring-2 focus-visible:ring-sci-400"
      >
        {children}
      </span>
    </Tooltip>
  );
}
