import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sci-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-navy-900 text-white shadow-lg shadow-navy-900/15 hover:bg-navy-800",
        accent: "bg-sci-500 text-white shadow-lg shadow-sci-500/25 hover:bg-sci-600",
        outline: "border border-sci-200 bg-white text-navy-900 hover:border-sci-400 hover:bg-sci-50",
        ghost: "text-navy-800 hover:bg-sci-50",
        danger: "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700",
        teal: "bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";
