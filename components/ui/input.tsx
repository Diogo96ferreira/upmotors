import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-white",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
