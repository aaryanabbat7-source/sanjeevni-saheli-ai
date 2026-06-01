import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Phone, ArrowRight, UserPlus, Lock, Eye, EyeOff } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";
import { useStore, setActive, signInWithPassword, clearDraft, setDraft } from "@/lib/user-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const MOBILE_RX = /^[6-9]\d{9}$/;

function LoginPage() {
  const store = useStore();
  const nav = useNavigate();
  const dict = t.en;
  const [mobile, setMobile] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const valid = MOBILE_RX.test(mobile);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return setError("Enter a valid 10-digit mobile number.");
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    const res = await signInWithPassword(mobile, pw);
    setBusy(false);
    if (res.error) return setError(res.error);
    setSignedIn(true);
    // If only one profile, jump directly
    setTimeout(() => {
      if (store.profiles.length === 1) {
        setActive(store.profiles[0].id);
        nav({ to: "/dashboard" });
      }
    }, 200);
  }

  function pick(id: string) {
    setActive(id);
    nav({ to: "/dashboard" });
  }

  function registerNew() {
    clearDraft();
    if (valid) setDraft({ mobile });
    nav({ to: "/onboarding/language" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>
        <div className="mt-6 flex justify-center"><Logo /></div>

        <motion.h1 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8 text-3xl font-bold text-center text-gradient">
          {dict.login}
        </motion.h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">Log in with your mobile number and password.</p>

        {!signedIn ? (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4" /> <span className="text-sm font-semibold">+91</span>
              </div>
              <input
                autoFocus
                inputMode="numeric"
                value={mobile}
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                placeholder="10-digit mobile"
                className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-20 pr-5 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow tracking-wider"
                maxLength={10}
              />
            </div>
            <div className="relative">
              <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                placeholder="Password"
                className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-11 pr-11 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow"
                minLength={6}
                maxLength={72}
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow disabled:opacity-50">
              {busy ? "Signing in…" : dict.login} <ArrowRight className="size-4" />
            </button>
          </form>
        ) : (
          <>
            <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground font-semibold">Choose a profile</div>
            <div className="mt-3 space-y-2">
              {store.profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pick(p.id)}
                  className="w-full text-left rounded-2xl bg-card border border-border hover:border-primary px-4 py-3 flex items-center gap-3 transition shadow-card"
                >
                  <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-white font-bold">
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.gender} · {p.lang.toUpperCase()}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              ))}
              {store.profiles.length < 3 && (
                <button onClick={registerNew} className="mt-3 w-full rounded-2xl border-2 border-dashed border-border hover:border-primary px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2">
                  <UserPlus className="size-4" /> Add another profile
                </button>
              )}
              {store.profiles.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">No profiles found for this account.</p>
              )}
            </div>
          </>
        )}

        <div className="mt-8 text-center text-xs text-muted-foreground">
          New here? <button onClick={registerNew} className="text-primary font-semibold hover:underline">{dict.register}</button>
        </div>
      </div>
    </PageShell>
  );
}
