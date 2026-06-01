import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Phone, ArrowRight, UserPlus } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";
import { useStore, setActive, profilesByMobile, clearDraft, setDraft } from "@/lib/user-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const MOBILE_RX = /^[6-9]\d{9}$/;

function LoginPage() {
  const store = useStore();
  const nav = useNavigate();
  const dict = t.en;
  const [mobile, setMobile] = useState("");
  const valid = MOBILE_RX.test(mobile);
  const matches = valid ? profilesByMobile(mobile) : [];

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
        <p className="mt-2 text-center text-muted-foreground text-sm">{dict.loginEnterMobile}</p>

        <div className="mt-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" /> <span className="text-sm font-semibold">+91</span>
          </div>
          <input
            autoFocus
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={dict.mobilePlaceholder}
            className="w-full rounded-2xl bg-card border-2 border-border focus:border-primary pl-20 pr-5 py-4 text-lg outline-none transition shadow-soft focus:shadow-glow tracking-wider"
            maxLength={10}
            aria-label={dict.mobile}
          />
        </div>

        {valid && matches.length === 0 && (
          <div className="mt-6 rounded-2xl bg-card border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">{dict.loginNoMatch}</p>
            <button onClick={registerNew} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow text-sm">
              <UserPlus className="size-4" /> {dict.register}
            </button>
          </div>
        )}

        {valid && matches.length > 0 && (
          <>
            <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground font-semibold">{dict.loginPickProfile}</div>
            <div className="mt-3 space-y-2">
              {matches.map((p) => (
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
            </div>
            {matches.length < 3 && (
              <button onClick={registerNew} className="mt-4 w-full rounded-2xl border-2 border-dashed border-border hover:border-primary px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2">
                <UserPlus className="size-4" /> {dict.addAnotherProfile}
              </button>
            )}
          </>
        )}

        {!valid && store.profiles.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{dict.noProfilesYet}</p>
        )}

        <div className="mt-8 text-center text-xs text-muted-foreground">
          {dict.register}? <button onClick={registerNew} className="text-primary font-semibold hover:underline">{dict.register}</button>
        </div>
      </div>
    </PageShell>
  );
}
