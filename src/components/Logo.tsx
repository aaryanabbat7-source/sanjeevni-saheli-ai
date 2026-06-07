import { motion } from "framer-motion";
import markAsset from "@/assets/sanjeevni-mark.png.asset.json";
import fullAsset from "@/assets/sanjeevni-logo-full.jpeg.asset.json";

const MARK_URL = markAsset.url; // transparent symbol-only
const FULL_URL = fullAsset.url; // wordmark version (used in 404/loading where text is welcome)

/** Symbol-only logo (for headers/nav). Transparent PNG, no text. */
export function Logo({ size = 44, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ width: size, height: size }}
        className="grid place-items-center"
      >
        <img
          src={MARK_URL}
          alt="Project Sanjeevni"
          width={size}
          height={size}
          className="block object-contain w-full h-full"
        />
      </motion.div>
      {withText && (
        <div className="leading-tight">
          <div className="font-display font-bold text-foreground text-base tracking-tight">Project Sanjeevni</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">जीवन को नई चेतना</div>
        </div>
      )}
    </div>
  );
}

/** Full logo with symbol + wordmark — for hero/landing. */
export function LogoFull({ height = 64 }: { height?: number }) {
  return (
    <motion.img
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      src={FULL_URL}
      alt="Project Sanjeevni — जीवन को नई चेतना"
      style={{ height, width: "auto" }}
      className="object-contain drop-shadow-[0_6px_22px_oklch(0.535_0.052_122/0.25)]"
    />
  );
}

/** Stacked / large version for 404 + loading splash. Uses the wordmark image. */
export function LogoStacked({ size = 220 }: { size?: number }) {
  return (
    <img
      src={FULL_URL}
      alt="Project Sanjeevni"
      width={size}
      height={size}
      style={{ width: size, height: "auto" }}
      className="object-contain drop-shadow-[0_10px_36px_oklch(0.535_0.052_122/0.30)]"
    />
  );
}
