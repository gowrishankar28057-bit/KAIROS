import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sci-100 bg-white shadow-[0_1px_2px_rgba(10,26,63,0.04),0_8px_24px_-12px_rgba(10,26,63,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
