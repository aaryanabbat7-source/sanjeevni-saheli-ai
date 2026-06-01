import { useSyncExternalStore } from "react";

export const EMPLOYEE_PASSWORD = "HALA MADRID";
const KEY = "sanjeevni.employee.auth.v1";

let authed = false;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try { authed = window.localStorage.getItem(KEY) === "1"; } catch {}
}
function emit() { listeners.forEach((l) => l()); }

export function employeeLogin(password: string): boolean {
  if (password.trim().toUpperCase() !== EMPLOYEE_PASSWORD) return false;
  authed = true;
  try { window.localStorage.setItem(KEY, "1"); } catch {}
  emit();
  return true;
}
export function employeeLogout() {
  authed = false;
  try { window.localStorage.removeItem(KEY); } catch {}
  emit();
}
export function isEmployee(): boolean { hydrate(); return authed; }

const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useEmployeeAuth(): boolean {
  return useSyncExternalStore(sub, () => { hydrate(); return authed; }, () => false);
}
