import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Lock } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";
import type { Gender } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/gender")({
  component: GenderPage,
});

function GenderPage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [error, setError] = useState("");

  const options: { key: Gender; label: string; icon: string; gradient: string }[] = [
    { key: "female", label: dict.female, icon: "👩", gradient: "bg-gradient-menstrual" },
    { key: "male", label: dict.male, icon: "👨", gradient: "bg-gradient-vaccine" },
    { key: "other", label: dict.other, icon: "🌈", gradient: "bg-gradient-pregnancy" },
  ];

  const [busy, setBusy] = useState(false);

  async function finish() {
    if (!draft.gender) return;
    setBusy(true);
    // Save gender into draft (already done) and advance to description step
    setBusy(false);
    nav({ to: "/onboarding/description" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/onboarding/dob" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-center">{dict.genderQ}</h1>
        <p className="mt-2 text-center text-muted-foreground">{dict.genderP}</p>

        <div className="mt-3 flex justify-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-pregnancy bg-pregnancy/10 rounded-full px-3 py-1 font-semibold">
            <Lock className="size-3" /> {dict.genderLocked}
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {options.map((o, i) => {
            const active = draft.gender === o.key;
            return (
              <motion.button
                key={o.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.08 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setDraft({ gender: o.key })}
                className={`relative rounded-3xl p-6 text-center transition shadow-card border-2 ${
                  active ? "border-primary shadow-glow scale-[1.02]" : "border-transparent hover:border-primary/30"
                }`}
              >
                <div className={`absolute inset-0 rounded-3xl ${o.gradient} transition ${active ? "opacity-100" : "opacity-20"}`} />
                <div className="relative">
                  <div className="text-5xl">{o.icon}</div>
                  <div className={`mt-3 font-bold ${active ? "text-white" : "text-foreground"}`}>{o.label}</div>
                  {active && <Check className="absolute top-0 right-0 size-5 text-white" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {error && <p className="mt-6 text-center text-sm text-destructive">{error}</p>}

        <div className="mt-10 flex justify-center">
          <button
            disabled={!draft.gender || busy}
            onClick={finish}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
          >
            {busy ? "Saving…" : dict.start} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
