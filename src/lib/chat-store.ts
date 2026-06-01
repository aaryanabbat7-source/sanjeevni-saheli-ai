import { useSyncExternalStore } from "react";
import type { UIMessage } from "ai";

export interface MessageMeta {
  fromEmployee?: boolean;
  translated?: boolean;
  originalText?: string;
  translatedLang?: string; // language code
}

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  messages: UIMessage[];
  meta?: Record<string, MessageMeta>; // keyed by message id
  updatedAt: number;
  createdAt: number;
}

const KEY = "sanjeevni.chats.v1";
let threads: ChatThread[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) threads = JSON.parse(raw);
  } catch {}
}
function persist() {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(KEY, JSON.stringify(threads)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }

export function listThreads(userId: string): ChatThread[] {
  hydrate();
  return threads.filter((t) => t.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
}
export function allThreads(): ChatThread[] {
  hydrate();
  return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
}
export function getThread(id: string): ChatThread | undefined {
  hydrate();
  return threads.find((t) => t.id === id);
}

export function createThread(userId: string, title = "New chat"): ChatThread {
  hydrate();
  const now = Date.now();
  const t: ChatThread = { id: crypto.randomUUID(), userId, title, messages: [], meta: {}, updatedAt: now, createdAt: now };
  threads = [t, ...threads];
  persist(); emit();
  return t;
}

export function saveThread(id: string, messages: UIMessage[]) {
  hydrate();
  const idx = threads.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const firstUser = messages.find((m) => m.role === "user");
  const title = firstUser
    ? firstUser.parts.map((p) => (p.type === "text" ? p.text : "")).join("").slice(0, 60) || threads[idx].title
    : threads[idx].title;
  threads = threads.map((t, i) => i === idx ? { ...t, messages, title, updatedAt: Date.now() } : t);
  persist(); emit();
}

export function appendAssistantMessage(threadId: string, text: string, meta?: MessageMeta) {
  hydrate();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx === -1) return;
  const id = crypto.randomUUID();
  const msg = { id, role: "assistant", parts: [{ type: "text", text }] } as UIMessage;
  const t = threads[idx];
  const updatedMeta = { ...(t.meta ?? {}), ...(meta ? { [id]: meta } : {}) };
  const updated = [...t.messages, msg];
  threads = threads.map((x, i) => i === idx ? { ...x, messages: updated, meta: updatedMeta, updatedAt: Date.now() } : x);
  persist(); emit();
}

export function editMessageText(threadId: string, messageId: string, text: string) {
  hydrate();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx === -1) return;
  const t = threads[idx];
  const messages = t.messages.map((m) => m.id === messageId
    ? ({ ...m, parts: [{ type: "text", text }] } as UIMessage)
    : m
  );
  threads = threads.map((x, i) => i === idx ? { ...x, messages, updatedAt: Date.now() } : x);
  persist(); emit();
}

export function deleteThread(id: string) {
  hydrate();
  threads = threads.filter((t) => t.id !== id);
  persist(); emit();
}

const sub = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useChatThreads() {
  return useSyncExternalStore(sub, () => { hydrate(); return threads; }, () => threads);
}
