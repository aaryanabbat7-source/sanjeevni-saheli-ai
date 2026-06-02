import { useEffect, useSyncExternalStore } from "react";
import type { UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";

export interface MessageMeta {
  fromEmployee?: boolean;
  fromEmployeeName?: string;
  translated?: boolean;
  originalText?: string;
  translatedLang?: string;
}

export interface ChatThread {
  id: string;
  userId: string; // profile id
  ownerAuthId?: string;
  title: string;
  messages: UIMessage[];
  meta?: Record<string, MessageMeta>;
  updatedAt: number;
  createdAt: number;
}

let threads: ChatThread[] = [];
const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

function pushThread(t: ChatThread) {
  threads = [t, ...threads.filter((x) => x.id !== t.id)];
  emit();
}
function patchThread(id: string, patch: Partial<ChatThread>) {
  threads = threads.map((t) => (t.id === id ? { ...t, ...patch } : t));
  emit();
}

interface ThreadRow {
  id: string; user_id: string; profile_id: string; title: string;
  created_at: string; updated_at: string;
}
interface MessageRow {
  id: string; thread_id: string; role: string; text: string; client_id: string | null;
  translated: boolean; original_text: string | null; translated_lang: string | null;
  from_employee_id: string | null; from_employee_name: string | null;
  created_at: string;
}

function rowsToThread(t: ThreadRow, msgs: MessageRow[]): ChatThread {
  const messages: UIMessage[] = msgs.map((m) => ({
    id: m.client_id ?? m.id,
    role: m.role as "user" | "assistant",
    parts: [{ type: "text", text: m.text }],
  }) as UIMessage);
  const meta: Record<string, MessageMeta> = {};
  msgs.forEach((m) => {
    const key = m.client_id ?? m.id;
    if (m.translated || m.from_employee_id || m.original_text) {
      meta[key] = {
        translated: m.translated,
        originalText: m.original_text ?? undefined,
        translatedLang: m.translated_lang ?? undefined,
        fromEmployee: !!m.from_employee_id,
        fromEmployeeName: m.from_employee_name ?? undefined,
      };
    }
  });
  return {
    id: t.id,
    userId: t.profile_id,
    ownerAuthId: t.user_id,
    title: t.title,
    messages,
    meta,
    createdAt: new Date(t.created_at).getTime(),
    updatedAt: new Date(t.updated_at).getTime(),
  };
}

export async function fetchAllThreads() {
  const { data: ts, error } = await supabase
    .from("chat_threads")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !ts) return;
  if (ts.length === 0) { threads = []; emit(); return; }
  const ids = ts.map((t) => t.id);
  const { data: ms } = await supabase
    .from("chat_messages")
    .select("*")
    .in("thread_id", ids)
    .order("created_at", { ascending: true });
  const byThread: Record<string, MessageRow[]> = {};
  (ms ?? []).forEach((m) => { (byThread[m.thread_id] ??= []).push(m as MessageRow); });
  threads = ts.map((t) => rowsToThread(t as ThreadRow, byThread[t.id] ?? []));
  emit();
  subscribeRealtime();
}

let realtimeSub: { unsubscribe: () => void } | null = null;
function subscribeRealtime() {
  if (realtimeSub) return;
  const channel = supabase
    .channel("chat-msgs")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
      const m = payload.new as MessageRow;
      const t = threads.find((x) => x.id === m.thread_id);
      if (!t) return;
      const id = m.client_id ?? m.id;
      if (t.messages.some((x) => x.id === id)) return; // dedupe own inserts
      const msg = { id, role: m.role as "user" | "assistant", parts: [{ type: "text", text: m.text }] } as UIMessage;
      const meta: MessageMeta | undefined = (m.translated || m.from_employee_id || m.original_text)
        ? {
            translated: m.translated,
            originalText: m.original_text ?? undefined,
            translatedLang: m.translated_lang ?? undefined,
            fromEmployee: !!m.from_employee_id,
            fromEmployeeName: m.from_employee_name ?? undefined,
          }
        : undefined;
      patchThread(t.id, {
        messages: [...t.messages, msg],
        meta: { ...(t.meta ?? {}), ...(meta ? { [id]: meta } : {}) },
        updatedAt: new Date(m.created_at).getTime(),
      });
    })
    .subscribe();
  realtimeSub = { unsubscribe: () => { void supabase.removeChannel(channel); realtimeSub = null; } };
}
  if (error || !ts) return;
  if (ts.length === 0) { threads = []; emit(); return; }
  const ids = ts.map((t) => t.id);
  const { data: ms } = await supabase
    .from("chat_messages")
    .select("*")
    .in("thread_id", ids)
    .order("created_at", { ascending: true });
  const byThread: Record<string, MessageRow[]> = {};
  (ms ?? []).forEach((m) => { (byThread[m.thread_id] ??= []).push(m as MessageRow); });
  threads = ts.map((t) => rowsToThread(t as ThreadRow, byThread[t.id] ?? []));
  emit();
}

export function clearChats() { threads = []; emit(); }

// ---------- Selectors ----------
export function listThreads(profileId: string): ChatThread[] {
  return threads.filter((t) => t.userId === profileId).sort((a, b) => b.updatedAt - a.updatedAt);
}
export function allThreads(): ChatThread[] {
  return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
}
export function getThread(id: string): ChatThread | undefined {
  return threads.find((t) => t.id === id);
}

// ---------- Mutations (optimistic local + async cloud sync) ----------
export function createThread(profileId: string, title = "New chat"): ChatThread {
  const now = Date.now();
  const t: ChatThread = {
    id: crypto.randomUUID(), userId: profileId, title,
    messages: [], meta: {}, createdAt: now, updatedAt: now,
  };
  pushThread(t);
  // async insert
  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) return;
    supabase.from("chat_threads").insert({
      id: t.id, user_id: data.user.id, profile_id: profileId, title,
    }).then(({ error }) => {
      if (error) console.error("createThread", error.message);
    });
  });
  return t;
}

export function saveThread(id: string, messages: UIMessage[]) {
  const t = threads.find((x) => x.id === id);
  if (!t) return;
  const firstUser = messages.find((m) => m.role === "user");
  const title = firstUser
    ? firstUser.parts.map((p) => (p.type === "text" ? p.text : "")).join("").slice(0, 60) || t.title
    : t.title;
  const prevIds = new Set(t.messages.map((m) => m.id));
  const newMsgs = messages.filter((m) => !prevIds.has(m.id));
  patchThread(id, { messages, title, updatedAt: Date.now() });
  // persist title
  supabase.from("chat_threads").update({ title, updated_at: new Date().toISOString() }).eq("id", id).then(() => {});
  // insert new messages
  if (newMsgs.length === 0) return;
  const rows = newMsgs.map((m) => ({
    thread_id: id,
    role: m.role,
    text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""),
    client_id: m.id,
  }));
  supabase.from("chat_messages").insert(rows).then(({ error }) => {
    if (error) console.error("saveThread msgs", error.message);
  });
}

export function appendAssistantMessage(threadId: string, text: string, meta?: MessageMeta) {
  const t = threads.find((x) => x.id === threadId);
  if (!t) return;
  const id = crypto.randomUUID();
  const msg = { id, role: "assistant", parts: [{ type: "text", text }] } as UIMessage;
  const updatedMeta = { ...(t.meta ?? {}), ...(meta ? { [id]: meta } : {}) };
  patchThread(threadId, {
    messages: [...t.messages, msg],
    meta: updatedMeta,
    updatedAt: Date.now(),
  });
  supabase.from("chat_messages").insert({
    thread_id: threadId,
    role: "assistant",
    text,
    client_id: id,
    translated: meta?.translated ?? false,
    original_text: meta?.originalText ?? null,
    translated_lang: meta?.translatedLang ?? null,
    from_employee_id: null,
    from_employee_name: meta?.fromEmployeeName ?? null,
  }).then(() => {});
  supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId).then(() => {});
}

export function editMessageText(threadId: string, messageId: string, text: string) {
  const t = threads.find((x) => x.id === threadId);
  if (!t) return;
  const messages = t.messages.map((m) => m.id === messageId
    ? ({ ...m, parts: [{ type: "text", text }] } as UIMessage)
    : m,
  );
  patchThread(threadId, { messages, updatedAt: Date.now() });
  supabase.from("chat_messages").update({ text }).eq("thread_id", threadId).eq("client_id", messageId).then(() => {});
}

export function deleteThread(id: string) {
  threads = threads.filter((t) => t.id !== id);
  emit();
  supabase.from("chat_threads").delete().eq("id", id).then(() => {});
}

const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useChatThreads() {
  return useSyncExternalStore(sub, () => threads, () => threads);
}

// Optional: ensure threads load when component mounts and we're authed
export function useEnsureChatsLoaded() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && threads.length === 0) void fetchAllThreads();
    });
  }, []);
}
