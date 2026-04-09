import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm border border-transparent font-semibold uppercase tracking-[0.22em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:scale-[1.01] hover:bg-zinc-200",
        outline: "border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5",
        ghost: "bg-transparent text-white hover:bg-white/5",
      },
      size: {
        default: "h-12 px-6 text-xs",
        sm: "h-10 px-4 text-[11px]",
        lg: "h-14 px-8 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);

Button.displayName = "Button";

export { buttonVariants };
