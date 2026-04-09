import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none transition-colors focus:border-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
