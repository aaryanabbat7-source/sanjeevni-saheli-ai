import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/dob")({
  component: DobPage,
});

function DobPage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [dob, setDob] = useState(draft.dob ?? "");
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dob) return setError(dict.dobInvalid);
    const d = new Date(dob);
    const now = new Date();
    if (isNaN(d.getTime()) || d > now || d.getFullYear() < 1900) return setError(dict.dobInvalid);
    // Enforce minimum age of 9 years
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    if (age < 9) return setError("Minimum age allowed is 9 years.");
    setDraft({ dob });
    nav({ to: "/onboarding/gender" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/name" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-pregnancy shadow-glow grid place-items-center text-5xl animate-float">
          🎂
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">{dict.dobQ}</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">{dict.dobP}</p>

        <div className="mt-4 mx-auto inline-flex items-center gap-1.5 text-[11px] text-pregnancy bg-pregnancy/10 rounded-full px-3 py-1 font-semibold">
          <Lock className="size-3" /> {dict.dobLocked}
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="date"
            value={dob}
            max={today}
            min="1900-01-01"
            onChange={(e) => { setDob(e.target.value); setError(""); }}
            className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary px-5 py-4 text-lg text-center font-semibold outline-none transition shadow-soft focus:shadow-glow"
            aria-label={dict.dobQ}
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
            {dict.continue} <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
