import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/name")({
  component: NamePage,
});

const NAME_RX = /^[\p{L}\s.'-]+$/u;

function NamePage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [name, setName] = useState(draft.name ?? "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 3 || !NAME_RX.test(trimmed)) return setError(dict.nameError);
    setDraft({ name: trimmed });
    nav({ to: "/onboarding/dob" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/mobile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-5xl animate-float">
          🌸
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">{dict.nameQ}</h1>
        <p className="mt-2 text-center text-muted-foreground">{dict.nameP}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder={dict.namePlaceholder}
            className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary px-5 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow"
            maxLength={60}
            aria-label={dict.namePlaceholder}
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
