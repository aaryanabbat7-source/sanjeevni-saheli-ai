import { Phone, AlertCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { getCountry } from "@/lib/countries";

export function EmergencyBar({ dict, female, country }: { dict: Dict; female?: boolean; country?: string }) {
  const info = getCountry(country);
  const e = info.emergency;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1 text-emergency font-medium">
        <AlertCircle className="size-4" /> {dict.emergencyHelp}:
      </span>
      {e.ambulance && (
        <a href={`tel:${e.ambulance.number}`} className="inline-flex items-center gap-1.5 rounded-full bg-emergency/10 text-emergency px-3 py-1.5 font-semibold hover:bg-emergency/20 transition">
          <Phone className="size-3.5" /> {e.ambulance.label} {e.ambulance.number}
        </a>
      )}
      {e.universal && (
        <a href={`tel:${e.universal.number}`} className="inline-flex items-center gap-1.5 rounded-full bg-emergency/10 text-emergency px-3 py-1.5 font-semibold hover:bg-emergency/20 transition">
          <Phone className="size-3.5" /> {e.universal.label}
        </a>
      )}
      {e.health && (
        <a href={`tel:${e.health.number}`} className="inline-flex items-center gap-1.5 rounded-full bg-vaccine/10 text-vaccine px-3 py-1.5 font-semibold hover:bg-vaccine/20 transition">
          <Phone className="size-3.5" /> {e.health.label} {e.health.number}
        </a>
      )}
      {female && e.women && (
        <a href={`tel:${e.women.number.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-1.5 rounded-full bg-pregnancy/10 text-pregnancy px-3 py-1.5 font-semibold hover:bg-pregnancy/20 transition">
          <Phone className="size-3.5" /> {e.women.label}
        </a>
      )}
    </div>
  );
}
