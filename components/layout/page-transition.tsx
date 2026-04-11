"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const reduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const hasPathChanged = previousPathRef.current !== pathname;
    previousPathRef.current = pathname;

    if (!hasPathChanged && !isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    const timeout = window.setTimeout(
      () => setIsTransitioning(false),
      reduceMotion ? 220 : 780
    );

    return () => window.clearTimeout(timeout);
  }, [isTransitioning, pathname, reduceMotion]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: reduceMotion ? 0.12 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            key={`transition-${pathname}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.45, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-[90] overflow-hidden bg-black"
          >
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0.9, scale: 0.92 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              transition={{ duration: reduceMotion ? 0.16 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_22%,transparent_78%,rgba(255,255,255,0.02))]" />
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <div className="relative w-full max-w-[320px] sm:max-w-[380px]">
                  <Image
                    src="/brand/upmotors-transition.png"
                    alt="Up Motors"
                    width={760}
                    height={760}
                    priority
                    className="h-auto w-full object-contain opacity-95 drop-shadow-[0_22px_60px_rgba(255,255,255,0.12)]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
