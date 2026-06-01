import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { setDraft, useDraft, signUpWithPassword } from "@/lib/user-store";

export const Route = createFileRoute("/onboarding/password")({
  component: PasswordPage,
});

function PasswordPage() {
  const draft = useDraft();
  const nav = useNavigate();
  const dict = t[draft.lang ?? "en"];
  const [pw, setPw] = useState(draft.password ?? "");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    if (pw !== pw2) return setError("Passwords do not match.");
    if (!draft.mobile) return setError("Mobile missing. Please restart.");
    setBusy(true);
    const res = await signUpWithPassword(draft.mobile, pw);
    setBusy(false);
    if (res.error) return setError(res.error);
    setDraft({ password: pw });
    nav({ to: "/onboarding/name" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/onboarding/mobile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mt-8 mx-auto size-28 rounded-full bg-gradient-primary shadow-glow grid place-items-center text-5xl animate-float">
          🔐
        </motion.div>
        <h1 className="mt-8 text-3xl font-bold text-center">Create a password</h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">Used to log in on any device. Minimum 6 characters.</p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <div className="relative">
            <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              placeholder="Password"
              className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-11 pr-11 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow"
              minLength={6}
              maxLength={72}
              aria-label="Password"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              value={pw2}
              onChange={(e) => { setPw2(e.target.value); setError(""); }}
              placeholder="Confirm password"
              className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-11 pr-4 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow"
              minLength={6}
              maxLength={72}
              aria-label="Confirm"
            />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition disabled:opacity-50">
            {busy ? "Creating account…" : dict.continue} <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
