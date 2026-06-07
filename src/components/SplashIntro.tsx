import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import markAsset from "@/assets/sanjeevni-mark.png.asset.json";

const KEY = "sanjeevni.splash.v4";

export function SplashIntro() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"center" | "loading" | "fly">("center");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch { /* ignore */ }
    setShow(true);
    const t1 = setTimeout(() => setPhase("loading"), 700);
    const t2 = setTimeout(() => setPhase("fly"), 1700);
    const t3 = setTimeout(() => setShow(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-gradient-hero pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, x: 0, y: 0 }}
            animate={
              phase === "fly"
                ? { scale: 0.18, opacity: 1, x: "calc(-50vw + 44px)", y: "calc(-50vh + 44px)" }
                : { scale: 1, opacity: 1, x: 0, y: 0 }
            }
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="flex flex-col items-center gap-5"
          >
            <img
              src={markAsset.url}
              alt="Project Sanjeevni"
              width={220}
              height={220}
              className="object-contain drop-shadow-[0_10px_36px_oklch(0.535_0.052_122/0.35)]"
            />
            {phase === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="size-9 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
