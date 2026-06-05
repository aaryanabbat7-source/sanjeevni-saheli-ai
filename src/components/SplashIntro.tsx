import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoMark from "@/assets/sanjeevni-mark.png";

const KEY = "sanjeevni.splash.v2";

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
            initial={{ scale: 0.4, opacity: 0, x: 0, y: 0 }}
            animate={
              phase === "fly"
                ? {
                    scale: 0.32,
                    opacity: 1,
                    x: "calc(-50vw + 38px)",
                    y: "calc(-50vh + 38px)",
                  }
                : { scale: 1, opacity: 1, x: 0, y: 0 }
            }
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src={logoMark}
              alt="Project Sanjeevni"
              width={140}
              height={140}
              className="object-contain drop-shadow-[0_10px_36px_rgba(212,102,74,0.35)]"
            />
            {phase !== "fly" && (
              <>
                <div className="text-center leading-tight">
                  <div className="font-bold text-foreground text-lg tracking-tight">PROJECT SANJEEVNI</div>
                  <div className="text-[11px] tracking-[0.25em] text-primary mt-1">• जीवन को नई चेतना •</div>
                </div>
                {phase === "loading" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="size-8 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin"
                  />
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
