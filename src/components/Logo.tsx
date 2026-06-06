import { motion } from "framer-motion";
import logoAsset from "@/assets/sanjeevni-logo-full.jpeg.asset.json";

const LOGO_URL = logoAsset.url;

/**
 * Symbol-only logo (for headers/nav). Uses object-cover with top focus
 * to crop the wordmark out of the full uploaded image.
 */
export function Logo({ size = 44, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ width: size, height: size }}
        className="overflow-hidden rounded-full bg-card shadow-soft"
      >
        <img
          src={LOGO_URL}
          alt="Project Sanjeevni"
          className="block w-full h-auto"
          style={{ marginTop: `-${size * 0.05}px`, transform: "scale(1.35)", transformOrigin: "center 32%" }}
        />
      </motion.div>
      {withText && (
        <div className="leading-tight">
          <div className="font-bold text-foreground text-base tracking-tight">Project Sanjeevni</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">जीवन को नई चेतना</div>
        </div>
      )}
    </div>
  );
}

/** Full logo with symbol + wordmark (uses entire uploaded image as-is). */
export function LogoFull({ height = 64 }: { height?: number }) {
  return (
    <motion.img
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      src={LOGO_URL}
      alt="Project Sanjeevni — जीवन को नई चेतना"
      style={{ height, width: "auto" }}
      className="object-contain drop-shadow-[0_6px_22px_rgba(212,102,74,0.25)]"
    />
  );
}

/** Stacked / large version for 404 + loading splash. */
export function LogoStacked({ size = 220 }: { size?: number }) {
  return (
    <img
      src={LOGO_URL}
      alt="Project Sanjeevni"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="object-contain drop-shadow-[0_10px_36px_rgba(212,102,74,0.30)]"
    />
  );
}
