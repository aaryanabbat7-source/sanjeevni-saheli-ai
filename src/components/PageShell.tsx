import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`relative min-h-dvh bg-gradient-hero overflow-x-hidden ${className}`}>
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-secondary/20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </main>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return (
    <p className="mx-auto max-w-2xl px-6 py-6 text-center text-xs text-muted-foreground">
      ⚕️ {text}
    </p>
  );
}
