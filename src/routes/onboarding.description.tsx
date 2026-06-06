import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft, commitDraft } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/description")({
  component: DescriptionPage,
});

function DescriptionPage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [desc, setDesc] = useState(draft.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function finish() {
    setBusy(true);
    setDraft({ description: desc.trim() || undefined });
    const res = await commitDraft();
    setBusy(false);
    if ("error" in res) return setError(res.error);
    nav({ to: "/dashboard" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/gender" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-white animate-float">
          <Sparkles className="size-12" />
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">Tell us a little about you</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Optional — anything you'd like Sanjeevni to know (health goals, conditions, family context). Skip if you prefer.
        </p>

        <div className="mt-8 space-y-4">
          <textarea
            value={desc}
            onChange={(e) => { setDesc(e.target.value.slice(0, 500)); setError(""); }}
            rows={5}
            placeholder="e.g. I'm a college student in Pune, mild PCOS, mostly vegetarian, want help tracking my cycle and iron intake."
            className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary px-5 py-4 text-base outline-none transition shadow-soft focus:shadow-glow resize-none"
            aria-label="About you"
          />
          <div className="text-right text-[11px] text-muted-foreground">{desc.length}/500</div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setDesc(""); void finish(); }}
              disabled={busy}
              className="flex-1 rounded-full bg-card border border-border px-5 py-3.5 font-semibold text-muted-foreground hover:text-foreground transition disabled:opacity-50"
            >
              Skip
            </button>
            <button
              onClick={finish}
              disabled={busy}
              className="flex-[2] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition disabled:opacity-50"
            >
              {busy ? "Finishing…" : "Finish & Start"} <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
