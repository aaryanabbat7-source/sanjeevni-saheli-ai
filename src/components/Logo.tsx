import { motion } from "framer-motion";
import logoMark from "@/assets/logo-mark.png";
import logoFull from "@/assets/logo-full.png";

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        src={logoMark}
        alt="Sanjeevni Saheli AI"
        className="rounded-full object-contain drop-shadow-[0_4px_18px_rgba(233,30,140,0.35)]"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-semibold text-foreground text-base">Sanjeevni Saheli</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI · Health Companion</div>
        </div>
      )}
    </div>
  );
}

export function LogoFull({ height = 56 }: { height?: number }) {
  return (
    <motion.img
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      src={logoFull}
      alt="Sanjeevni Saheli AI — Your Trusted Health Companion"
      style={{ height }}
      className="w-auto object-contain"
    />
  );
}
