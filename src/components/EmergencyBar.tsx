import { Phone, AlertCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";

export function EmergencyBar({ dict, female }: { dict: Dict; female?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1 text-emergency font-medium">
        <AlertCircle className="size-4" /> {dict.emergencyHelp}:
      </span>
      <a href="tel:108" className="inline-flex items-center gap-1.5 rounded-full bg-emergency/10 text-emergency px-3 py-1.5 font-semibold hover:bg-emergency/20 transition">
        <Phone className="size-3.5" /> {dict.callAmbulance}
      </a>
      <a href="tel:104" className="inline-flex items-center gap-1.5 rounded-full bg-vaccine/10 text-vaccine px-3 py-1.5 font-semibold hover:bg-vaccine/20 transition">
        <Phone className="size-3.5" /> {dict.callHealth}
      </a>
      {female && (
        <a href="tel:181" className="inline-flex items-center gap-1.5 rounded-full bg-pregnancy/10 text-pregnancy px-3 py-1.5 font-semibold hover:bg-pregnancy/20 transition">
          <Phone className="size-3.5" /> {dict.callWomen}
        </a>
      )}
    </div>
  );
}
