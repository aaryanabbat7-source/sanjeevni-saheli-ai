import { motion } from "framer-motion";
import logoMark from "@/assets/logo-mark.png";

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        src={logoMark}
        alt="Sanjeevni Saheli AI"
        width={size}
        height={size}
        className="object-contain drop-shadow-[0_4px_18px_rgba(212,102,74,0.30)]"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-semibold text-foreground text-base">Sanjeevni Saheli</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI · Wellness for All</div>
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
        alt="Sanjeevni Saheli AI"
        width={height}
        height={height}
        style={{ height, width: height }}
        className="object-contain drop-shadow-[0_4px_18px_rgba(212,102,74,0.30)]"
      />
      <div className="leading-tight">
        <div className="font-bold text-foreground text-lg md:text-xl tracking-tight">Sanjeevni Saheli</div>
        <div className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted-foreground">AI · Trusted Health Companion</div>
      </div>
    </div>
  );
}

