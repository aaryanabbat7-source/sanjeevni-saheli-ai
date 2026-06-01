import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Flower2, Lock, ArrowLeft, Mail, User, Eye, EyeOff } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  gateUnlock, employeeSignIn, employeeSignUp,
  useEmployeeState, useEnsureEmployeeInit,
} from "@/lib/employee-store";
import { useEffect } from "react";

export const Route = createFileRoute("/employee/login")({ component: EmployeeLogin });

function EmployeeLogin() {
  useEnsureEmployeeInit();
  const nav = useNavigate();
  const { gateUnlocked, authed, hydrated } = useEmployeeState();

  const [gatePw, setGatePw] = useState("");
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (hydrated && authed) nav({ to: "/employee" }); }, [hydrated, authed, nav]);

  function submitGate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!gateUnlock(gatePw, remember)) setErr("Invalid passcode.");
  }

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = mode === "signin"
      ? await employeeSignIn(email.trim(), pw)
      : await employeeSignUp(name.trim(), email.trim(), pw, gatePw || "HALA-MADRID");
    setBusy(false);
    if (res.error) return setErr(res.error);
    nav({ to: "/employee" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-16">
        <button onClick={() => nav({ to: "/" })} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="size-4" /> Back
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border shadow-card p-8">
          <div className="text-center">
            <div className="mx-auto size-16 rounded-full bg-gradient-primary grid place-items-center text-white shadow-glow">
              <Flower2 className="size-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Sanjeevni Team Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Internal use only.</p>
          </div>

          {!gateUnlocked ? (
            <form onSubmit={submitGate} className="mt-6 space-y-3">
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  autoFocus
                  value={gatePw}
                  onChange={(e) => { setGatePw(e.target.value); setErr(""); }}
                  placeholder="Team passcode"
                  className="w-full rounded-2xl bg-muted border border-border pl-10 pr-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                Remember this device
              </label>
              {err && <p className="text-xs text-emergency">{err}</p>}
              <button type="submit" className="w-full rounded-full bg-gradient-primary text-primary-foreground py-3 font-semibold shadow-glow">
                Continue
              </button>
            </form>
          ) : (
            <>
              <div className="mt-5 flex rounded-full bg-muted p-1 text-xs font-semibold">
                <button onClick={() => { setMode("signin"); setErr(""); }} className={`flex-1 py-2 rounded-full transition ${mode === "signin" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Sign in</button>
                <button onClick={() => { setMode("signup"); setErr(""); }} className={`flex-1 py-2 rounded-full transition ${mode === "signup" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Register</button>
              </div>

              <form onSubmit={submitAuth} className="mt-5 space-y-3">
                {mode === "signup" && (
                  <div className="relative">
                    <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      required minLength={1} maxLength={120}
                      className="w-full rounded-2xl bg-muted border border-border pl-10 pr-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email" required autoComplete="email"
                    className="w-full rounded-2xl bg-muted border border-border pl-10 pr-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)}
                    placeholder="Password" required minLength={6} maxLength={72}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full rounded-2xl bg-muted border border-border pl-10 pr-10 py-3 text-sm outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                  Remember this device
                </label>
                {err && <p className="text-xs text-emergency">{err}</p>}
                <button type="submit" disabled={busy} className="w-full rounded-full bg-gradient-primary text-primary-foreground py-3 font-semibold shadow-glow disabled:opacity-50">
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create employee account"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
