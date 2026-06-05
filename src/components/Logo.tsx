import { motion } from "framer-motion";
import logoMark from "@/assets/sanjeevni-mark.png";

export function Logo({ size = 44, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        src={logoMark}
        alt="Project Sanjeevni"
        width={size}
        height={size}
        className="object-contain drop-shadow-[0_4px_18px_rgba(212,102,74,0.25)]"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-bold text-foreground text-base tracking-tight">Project Sanjeevni</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">जीवन को नई चेतना</div>
        </div>
      )}
    </div>
  );
}

export function LogoFull({ height = 56 }: { height?: number }) {
  return (
    <div className="flex items-center gap-3">
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        src={logoMark}
        alt="Project Sanjeevni"
        width={height}
        height={height}
        style={{ height, width: height }}
        className="object-contain drop-shadow-[0_6px_22px_rgba(212,102,74,0.30)]"
      />
      <div className="leading-tight">
        <div className="font-bold text-foreground text-lg md:text-xl tracking-tight">Project Sanjeevni</div>
        <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted-foreground">जीवन को नई चेतना</div>
      </div>
    </div>
  );
}

// Used on 404 + loading states — symbol + the full wordmark stacked vertically
export function LogoStacked({ size = 120 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={logoMark}
        alt="Project Sanjeevni"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain drop-shadow-[0_8px_28px_rgba(212,102,74,0.30)]"
      />
      <div className="text-center leading-tight">
        <div className="font-bold text-foreground text-xl tracking-tight">PROJECT SANJEEVNI</div>
        <div className="text-xs tracking-[0.25em] text-primary mt-1">• जीवन को नई चेतना •</div>
      </div>
    </div>
  );
}
