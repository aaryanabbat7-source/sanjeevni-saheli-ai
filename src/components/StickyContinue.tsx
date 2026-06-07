import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Mobile-first sticky Continue button. Appears fixed at the bottom of the
 * viewport on small screens (respects iOS safe-area), inline on larger ones.
 * Becomes visible only when `show` is true (e.g. user has made a valid choice).
 */
export function StickyContinue({
  label,
  onClick,
  show = true,
  disabled = false,
  type = "button",
}: {
  label: string;
  onClick?: () => void;
  show?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <>
      {/* Spacer so content doesn't sit under the fixed bar on mobile */}
      <div aria-hidden className="h-24 sm:h-0" />
      <AnimatePresence>
        {show && (
          <motion.div
            key="sticky-continue"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/95 to-background/0 sm:static sm:px-0 sm:pt-0 sm:pb-0 sm:bg-none"
          >
            <button
              type={type}
              onClick={onClick}
              disabled={disabled}
              className="w-full max-w-2xl mx-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-glow active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition"
            >
              {label} <ArrowRight className="size-4 rtl:rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
