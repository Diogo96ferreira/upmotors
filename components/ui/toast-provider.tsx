"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = "info",
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = nextIdRef.current++;

      setToasts((currentToasts) => [...currentToasts, { id, title, description, variant }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 3800);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-5 top-24 z-[120] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto overflow-hidden border bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl",
                item.variant === "success" && "border-emerald-500/30",
                item.variant === "error" && "border-rose-500/30",
                item.variant === "info" && "border-white/15"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.24em]",
                      item.variant === "success" && "text-emerald-200",
                      item.variant === "error" && "text-rose-200",
                      item.variant === "info" && "text-zinc-100"
                    )}
                  >
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="text-sm leading-6 text-zinc-400">{item.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(item.id)}
                  className="text-xs uppercase tracking-[0.22em] text-zinc-500 transition hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast tem de ser usado dentro de ToastProvider.");
  }

  return context;
}
