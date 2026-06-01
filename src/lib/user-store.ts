import { useEffect, useState, useSyncExternalStore } from "react";
import type { Lang } from "./i18n";

export type Gender = "female" | "male" | "other";

export interface UserProfile {
  id: string;
  mobile: string;        // 10-digit
  name: string;
  dob: string | null;    // ISO yyyy-mm-dd — locked after creation
  gender: Gender | null; // locked after creation
  lang: Lang;            // can be changed in settings
  createdAt: number;
}

export type Draft = Partial<Omit<UserProfile, "id" | "createdAt">>;

interface Store {
  profiles: UserProfile[];
  activeId: string | null;
  draft: Draft;
}

export const MAX_PER_MOBILE = 3;
const KEY = "sanjeevni.store.v2";
const empty: Store = { profiles: [], activeId: null, draft: {} };

const listeners = new Set<() => void>();
let state: Store = empty;
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch {}
}
function persist() {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }

export function getStore(): Store { hydrate(); return state; }

export function setDraft(patch: Draft) {
  hydrate();
  state = { ...state, draft: { ...state.draft, ...patch } };
  persist(); emit();
}
export function clearDraft() {
  state = { ...state, draft: {} };
  persist(); emit();
}

export function profilesByMobile(mobile: string): UserProfile[] {
  hydrate();
  return state.profiles.filter((p) => p.mobile === mobile);
}

export function commitDraft(): UserProfile | { error: string } {
  hydrate();
  const d = state.draft;
  if (!d.lang || !d.mobile || !d.name || !d.dob || !d.gender) {
    return { error: "Please complete all steps." };
  }
  const same = profilesByMobile(d.mobile);
  if (same.length >= MAX_PER_MOBILE) {
    return { error: `Only ${MAX_PER_MOBILE} profiles allowed per mobile number.` };
  }
  const profile: UserProfile = {
    id: crypto.randomUUID(),
    mobile: d.mobile,
    name: d.name,
    dob: d.dob,
    gender: d.gender,
    lang: d.lang,
    createdAt: Date.now(),
  };
  state = {
    profiles: [...state.profiles, profile],
    activeId: profile.id,
    draft: {},
  };
  persist(); emit();
  return profile;
}

export function setActive(id: string) {
  hydrate();
  state = { ...state, activeId: id };
  persist(); emit();
}

export function logout() {
  hydrate();
  state = { ...state, activeId: null, draft: {} };
  persist(); emit();
}

export function removeProfile(id: string) {
  hydrate();
  const profiles = state.profiles.filter((p) => p.id !== id);
  const activeId = state.activeId === id ? null : state.activeId;
  state = { ...state, profiles, activeId };
  persist(); emit();
}

export function updateActiveLang(lang: Lang) {
  hydrate();
  if (!state.activeId) return;
  state = {
    ...state,
    profiles: state.profiles.map((p) => (p.id === state.activeId ? { ...p, lang } : p)),
  };
  persist(); emit();
}

const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function useStore(): Store {
  return useSyncExternalStore(sub, () => { hydrate(); return state; }, () => empty);
}

export function useUser(): UserProfile | null {
  const s = useStore();
  return s.profiles.find((p) => p.id === s.activeId) ?? null;
}

export function useDraft(): Draft {
  return useStore().draft;
}

export function useHasMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function ageFromDob(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}
