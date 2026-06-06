import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Globe2 } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { t } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/country")({
  component: CountryPage,
});

function CountryPage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [code, setCode] = useState(draft.country ?? "IN");
  const [pincode, setPincode] = useState(draft.pincode ?? "");
  const [error, setError] = useState("");
  const country = getCountry(code);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = pincode.trim();
    if (trimmed && country.pincodeRegex && !country.pincodeRegex.test(trimmed)) {
      return setError(`Please enter a valid ${country.name} ${country.pincodeLabel.replace(" (optional)", "")}.`);
    }
    setDraft({ country: code, pincode: trimmed || undefined });
    nav({ to: "/onboarding/language" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-24 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-4xl animate-float">
          <Globe2 className="size-10 text-primary-foreground" />
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">Where are you from?</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          We'll show emergency numbers and government schemes for your country.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COUNTRIES.map((c) => {
              const active = code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { setCode(c.code); setError(""); }}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    active
                      ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card hover:border-primary/40 shadow-card"
                  }`}
                >
                  <div className="text-3xl">{c.flag}</div>
                  <div className={`mt-2 font-bold ${active ? "" : "text-foreground"}`}>{c.name}</div>
                  <div className={`text-[11px] tracking-wider ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.dialPrefix} · {c.mobileLengths.join("/")}d</div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {country.pincodeLabel}
            </label>
            <input
              value={pincode}
              onChange={(e) => { setPincode(e.target.value.replace(/[^a-zA-Z0-9 -]/g, "").slice(0, 12)); setError(""); }}
              placeholder={country.pincodePlaceholder ?? "Postal code"}
              className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary px-5 py-3.5 text-base outline-none transition shadow-soft focus:shadow-glow tracking-wider"
              aria-label={country.pincodeLabel}
            />
            {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
            {!error && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Optional — used for local schemes & helplines.
              </p>
            )}
          </div>

          <button type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
            {dict.continue} <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
