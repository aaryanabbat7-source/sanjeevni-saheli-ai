import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export const GATE_PASSWORD = "HALA-MADRID";
const GATE_KEY = "sanjeevni.employee.gate.v1";

export interface EmployeeInfo {
  id: string;
  name: string;
  email: string;
}

interface State {
  gateUnlocked: boolean;
  authed: boolean;
  employee: EmployeeInfo | null;
  hydrated: boolean;
}

let state: State = { gateUnlocked: false, authed: false, employee: null, hydrated: false };
const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function set(p: Partial<State>) { state = { ...state, ...p }; emit(); }

function readGate(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(GATE_KEY) === "1"
      || window.sessionStorage.getItem(GATE_KEY) === "1";
  } catch { return false; }
}
function writeGate(unlocked: boolean, remember: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(GATE_KEY);
    window.sessionStorage.removeItem(GATE_KEY);
    if (unlocked) {
      (remember ? window.localStorage : window.sessionStorage).setItem(GATE_KEY, "1");
    }
  } catch {}
}

async function refreshEmployee() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) { set({ authed: false, employee: null }); return; }
  // Check role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", u.user.id);
  const isEmployee = (roles ?? []).some((r) => r.role === "employee");
  if (!isEmployee) { set({ authed: false, employee: null }); return; }
  const { data: emp } = await supabase
    .from("employees")
    .select("id, name, email")
    .eq("id", u.user.id)
    .maybeSingle();
  set({
    authed: true,
    employee: emp ?? { id: u.user.id, name: u.user.email ?? "Team", email: u.user.email ?? "" },
  });
}

let inited = false;
export function initEmployeeStore() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  set({ gateUnlocked: readGate() });
  void refreshEmployee().finally(() => set({ hydrated: true }));
  supabase.auth.onAuthStateChange(() => { void refreshEmployee(); });
}

export function gateUnlock(password: string, remember: boolean): boolean {
  const ok = password.trim().toUpperCase().replace(/[\s_]/g, "-") === GATE_PASSWORD;
  if (!ok) return false;
  writeGate(true, remember);
  set({ gateUnlocked: true });
  return true;
}

export function gateLock() {
  writeGate(false, false);
  set({ gateUnlocked: false });
}

export async function employeeSignIn(email: string, password: string): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };
  await refreshEmployee();
  if (!state.authed) return { error: "This account is not an employee account." };
  return {};
}

export async function employeeSignUp(name: string, email: string, password: string, gatePassword: string): Promise<{ error?: string }> {
  if (gatePassword.trim().toUpperCase().replace(/[\s_]/g, "-") !== GATE_PASSWORD) {
    return { error: "Invalid team passcode." };
  }
  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/employee` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { emailRedirectTo: redirectUrl, data: { name, employee: true } },
  });
  if (error) return { error: error.message };
  // Insert employee + role rows (RLS: self-insert allowed)
  if (data.user) {
    // user_roles INSERT is blocked by RLS for anon; we need a server function.
    const { claimEmployeeRole } = await import("@/lib/employee-claim.functions");
    const res = await claimEmployeeRole({ data: { name, gatePassword } });
    if (!res?.ok) return { error: res?.error ?? "Could not register as employee." };
  }
  await refreshEmployee();
  return {};
}

export async function employeeLogout() {
  await supabase.auth.signOut();
  gateLock();
  set({ authed: false, employee: null });
}

const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useEmployeeState(): State {
  return useSyncExternalStore(sub, () => state, () => state);
}
export function useEmployeeAuth(): boolean {
  return useEmployeeState().authed;
}
export function useEnsureEmployeeInit() {
  useEffect(() => { initEmployeeStore(); }, []);
}
