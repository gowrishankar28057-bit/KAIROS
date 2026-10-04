import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { id: string }) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)} {...props}>
      <div className="mx-auto w-full max-w-[1320px] px-5 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sci-500">{eyebrow}</p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy-900 md:text-[2.6rem]">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p>}
    </div>
  );
}

/** Mandatory label for any simulated output. */
export function SimTag({ className, label = "Prototype Simulation" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-dashed border-sci-200 bg-sci-50/70 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-sci-700",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-sci-400" aria-hidden />
      {label}
    </span>
  );
}
