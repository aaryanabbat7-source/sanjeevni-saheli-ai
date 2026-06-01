import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { LANGUAGES, t, type Lang } from "@/lib/i18n";
import { setDraft, useDraft } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/language")({
  component: LanguagePage,
});

function LanguagePage() {
  const draft = useDraft();
  const nav = useNavigate();
  const lang: Lang = draft.lang ?? "en";
  const dict = t[lang];

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex justify-center"><Logo /></div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
            <Globe className="size-3.5" /> {dict.changeLanguage}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">{dict.chooseLang}</h1>
          <p className="mt-2 text-muted-foreground">{dict.chooseLangSub}</p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {LANGUAGES.map((l, i) => {
            const active = draft.lang === l.code;
            return (
              <motion.button
                key={l.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDraft({ lang: l.code })}
                className={`rounded-3xl p-6 text-center transition border-2 ${
                  active
                    ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card hover:border-primary/40 shadow-card"
                }`}
              >
                <div className="text-4xl">{l.flag}</div>
                <div className={`mt-3 text-2xl font-bold ${active ? "" : "text-foreground"}`}>{l.native}</div>
                <div className={`text-xs uppercase tracking-widest mt-1 ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{l.english}</div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            disabled={!draft.lang}
            onClick={() => nav({ to: "/onboarding/mobile" })}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {dict.continue} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
