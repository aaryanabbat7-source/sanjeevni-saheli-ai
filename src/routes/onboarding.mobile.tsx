import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";
import { getCountry } from "@/lib/countries";

export const Route = createFileRoute("/onboarding/mobile")({
  component: MobilePage,
});

function MobilePage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const country = getCountry(draft.country);
  const [mobile, setMobile] = useState(draft.mobile ?? "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!country.mobileRegex.test(mobile)) return setError(dict.mobileInvalid);
    setDraft({ mobile });
    nav({ to: "/onboarding/password" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/country" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-5xl animate-float">
          📱
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">{dict.mobileQ}</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          {country.flag} {country.name} · {country.dialPrefix}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" /> <span className="text-sm font-semibold">{country.dialPrefix}</span>
            </div>
            <input
              autoFocus
              inputMode="numeric"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, country.mobileLength)); setError(""); }}
              placeholder={dict.mobilePlaceholder}
              className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-24 pr-5 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow tracking-wider"
              maxLength={country.mobileLength}
              aria-label={dict.mobileQ}
            />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
            {dict.continue} <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
