import { useEffect, useState, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "./i18n";

export type Gender = "female" | "male" | "other";

export interface UserProfile {
  id: string;
  mobile: string;
  name: string;
  dob: string | null;
  gender: Gender | null;
  lang: Lang;
  createdAt: number;
}

export type Draft = Partial<Omit<UserProfile, "id" | "createdAt">> & { password?: string };

interface Store {
  profiles: UserProfile[];
  activeId: string | null;
  draft: Draft;
  hydrated: boolean;
  loading: boolean;
}

export const MAX_PER_MOBILE = 3;
const DRAFT_KEY = "sanjeevni.draft.v1";
const ACTIVE_KEY = "sanjeevni.active.v1";

const empty: Store = { profiles: [], activeId: null, draft: {}, hydrated: false, loading: false };
let state: Store = empty;
const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function set(patch: Partial<Store>) { state = { ...state, ...patch }; emit(); }

function loadLocal() {
  if (typeof window === "undefined") return;
  try {
    const d = window.localStorage.getItem(DRAFT_KEY);
    const a = window.localStorage.getItem(ACTIVE_KEY);
    state = { ...state, draft: d ? JSON.parse(d) : {}, activeId: a };
  } catch {}
}
function saveDraft(d: Draft) {
  try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
}
function saveActive(id: string | null) {
  try {
    if (id) window.localStorage.setItem(ACTIVE_KEY, id);
    else window.localStorage.removeItem(ACTIVE_KEY);
  } catch {}
}

function mobileToEmail(mobile: string) {
  return `m${mobile}@user.sanjeevni.local`;
}

function rowToProfile(r: {
  id: string; mobile: string; name: string; dob: string | null;
  gender: string | null; lang: string; created_at: string;
}): UserProfile {
  return {
    id: r.id,
    mobile: r.mobile,
    name: r.name,
    dob: r.dob,
    gender: (r.gender as Gender) ?? null,
    lang: (r.lang as Lang) ?? "en",
    createdAt: new Date(r.created_at).getTime(),
  };
}

export async function fetchProfiles() {
  set({ loading: true });
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    set({ loading: false, hydrated: true });
    return;
  }
  const profiles = (data ?? []).map(rowToProfile);
  let activeId = state.activeId;
  if (!activeId || !profiles.some((p) => p.id === activeId)) {
    activeId = profiles[0]?.id ?? null;
    saveActive(activeId);
  }
  set({ profiles, activeId, loading: false, hydrated: true });
}

export function clearProfiles() {
  saveActive(null);
  set({ profiles: [], activeId: null, hydrated: true, loading: false });
}

// Init: load local draft/activeId, then if a session exists, fetch profiles
let inited = false;
export function initUserStore() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  loadLocal();
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) void fetchProfiles();
    else set({ hydrated: true });
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) void fetchProfiles();
    else clearProfiles();
  });
}

// ---------- Draft ----------
export function setDraft(patch: Draft) {
  const draft = { ...state.draft, ...patch };
  saveDraft(draft);
  set({ draft });
}
export function clearDraft() {
  saveDraft({});
  set({ draft: {} });
}

// ---------- Auth ----------
export async function signUpWithPassword(mobile: string, password: string): Promise<{ error?: string }> {
  const email = mobileToEmail(mobile);
  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { emailRedirectTo: redirectUrl, data: { mobile } },
  });
  if (error && !/already/i.test(error.message ?? "")) {
    return { error: error.message };
  }
  // Ensure active session (auto-confirm is enabled)
  const { data: sess } = await supabase.auth.getSession();
  if (!sess.session) {
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) {
      return { error: error?.message?.toLowerCase().includes("already")
        ? "This mobile number is already registered. Please log in."
        : signErr.message };
    }
  }
  await fetchProfiles();
  return {};
}

export async function signInWithPassword(mobile: string, password: string): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email: mobileToEmail(mobile), password });
  if (error) return { error: "Invalid mobile or password." };
  await fetchProfiles();
  return {};
}

// ---------- Profile selection ----------
export function setActive(id: string) {
  saveActive(id);
  set({ activeId: id });
}

export async function logout() {
  await supabase.auth.signOut();
  clearProfiles();
  clearDraft();
}

export async function removeProfile(id: string) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) return { error: error.message };
  await fetchProfiles();
  return {};
}

export async function updateActiveLang(lang: Lang) {
  if (!state.activeId) return;
  // optimistic
  set({
    profiles: state.profiles.map((p) => (p.id === state.activeId ? { ...p, lang } : p)),
  });
  const { error } = await supabase
    .from("profiles")
    .update({ lang })
    .eq("id", state.activeId)
    .select("id")
    .single();
  if (error) {
    console.error("updateActiveLang", error.message);
    // rollback by refetching
    await fetchProfiles();
  }
}

// commitDraft: requires authed session; insert profile row
export async function commitDraft(): Promise<UserProfile | { error: string }> {
  const d = state.draft;
  if (!d.lang || !d.mobile || !d.name || !d.dob || !d.gender) {
    return { error: "Please complete all steps." };
  }
  const { data: sess } = await supabase.auth.getUser();
  if (!sess.user) return { error: "Not signed in. Please log in." };
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: sess.user.id,
      mobile: d.mobile,
      name: d.name,
      dob: d.dob,
      gender: d.gender,
      lang: d.lang,
    })
    .select("*")
    .single();
  if (error) {
    const msg = error.message?.includes("Minimum age")
      ? "Minimum age allowed is 9 years."
      : error.message?.includes("Only 3")
      ? `Only ${MAX_PER_MOBILE} profiles allowed per mobile number.`
      : error.message;
    return { error: msg };
  }
  const profile = rowToProfile(data);
  set({
    profiles: [...state.profiles, profile],
    activeId: profile.id,
    draft: {},
  });
  saveActive(profile.id);
  saveDraft({});
  return profile;
}

// Legacy helper kept for routes that ask by mobile (always = current authed mobile)
export function profilesByMobile(mobile: string): UserProfile[] {
  return state.profiles.filter((p) => p.mobile === mobile);
}

// ---------- React glue ----------
const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function useStore(): Store {
  return useSyncExternalStore(sub, () => state, () => empty);
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

// True only once we know whether the user is logged in or not
// (avoids flicker-redirects to landing on page refresh).
export function useAuthReady(): boolean {
  const mounted = useHasMounted();
  const s = useStore();
  return mounted && s.hydrated && !s.loading;
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
