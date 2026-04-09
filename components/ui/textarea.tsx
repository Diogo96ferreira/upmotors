import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-white",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
