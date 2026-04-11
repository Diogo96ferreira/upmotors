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
        initial={{ opacity: 0, y: 42, scale: 0.985, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("container-shell will-change-transform", contentClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
}
