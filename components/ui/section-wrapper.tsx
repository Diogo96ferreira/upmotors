"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionWrapper({
  children,
  className,
  contentClassName,
}: SectionWrapperProps) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={cn("container-shell", contentClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
}
