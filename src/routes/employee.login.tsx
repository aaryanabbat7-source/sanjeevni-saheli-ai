import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Flower2, Lock, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { employeeLogin, useEmployeeAuth } from "@/lib/employee-store";
import { useEffect } from "react";

export const Route = createFileRoute("/employee/login")({ component: EmployeeLogin });

function EmployeeLogin() {
  const nav = useNavigate();
  const authed = useEmployeeAuth();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (authed) nav({ to: "/employee" }); }, [authed, nav]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (employeeLogin(pw)) nav({ to: "/employee" });
    else setErr("Access denied.");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-5 py-16">
        <button onClick={() => nav({ to: "/" })} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="size-4" /> Back
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border shadow-card p-8 text-center">
          <div className="mx-auto size-16 rounded-full bg-gradient-primary grid place-items-center text-white shadow-glow">
            <Flower2 className="size-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Sanjeevni Team Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Internal use only.</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                autoFocus
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                placeholder="Passcode"
                className="w-full rounded-2xl bg-muted border border-border pl-10 pr-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            {err && <p className="text-xs text-emergency">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-gradient-primary text-primary-foreground py-3 font-semibold shadow-glow">
              Enter
            </button>
          </form>
        </motion.div>
      </div>
    </PageShell>
  );
}
