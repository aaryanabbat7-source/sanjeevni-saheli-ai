import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft, profilesByMobile, MAX_PER_MOBILE } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/mobile")({
  component: MobilePage,
});

const MOBILE_RX = /^[6-9]\d{9}$/;

function MobilePage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [mobile, setMobile] = useState(draft.mobile ?? "");
  const [error, setError] = useState("");

  const existing = MOBILE_RX.test(mobile) ? profilesByMobile(mobile).length : 0;
  const full = existing >= MAX_PER_MOBILE;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!MOBILE_RX.test(mobile)) return setError(dict.mobileInvalid);
    if (full) return setError(dict.loginMobileFull);
    setDraft({ mobile });
    nav({ to: "/onboarding/name" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/language" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-5xl animate-float">
          📱
        </motion.div>

        <h1 className="mt-8 text-3xl font-bold text-center">{dict.mobileQ}</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">{dict.mobileP}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" /> <span className="text-sm font-semibold">+91</span>
            </div>
            <input
              autoFocus
              inputMode="numeric"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
              placeholder={dict.mobilePlaceholder}
              className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-20 pr-5 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow tracking-wider"
              maxLength={10}
              aria-label={dict.mobileQ}
            />
          </div>
          {existing > 0 && !full && (
            <p className="text-sm text-pregnancy text-center">{dict.mobileExistingCount(existing)}</p>
          )}
          {full && (
            <div className="rounded-2xl bg-emergency/10 border border-emergency/30 p-4 text-sm text-emergency text-center">
              {dict.loginMobileFull}
              <button type="button" onClick={() => nav({ to: "/login" })} className="block mt-3 mx-auto rounded-full bg-emergency text-white px-4 py-2 font-semibold">
                {dict.login}
              </button>
            </div>
          )}
          {error && !full && <p className="text-sm text-destructive text-center">{error}</p>}
          {!full && (
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
              {dict.continue} <ArrowRight className="size-4" />
            </button>
          )}
        </form>
      </div>
    </PageShell>
  );
}
