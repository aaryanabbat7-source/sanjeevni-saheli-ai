import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogOut, MessageSquare, User, Phone, Send, Edit2, Check, X, Languages, Loader2, Users, Activity, Globe2, RefreshCw, Menu } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { employeeLogout, useEmployeeAuth } from "@/lib/employee-store";
import { useStore, ageFromDob, fetchProfiles } from "@/lib/user-store";
import { useChatThreads, listThreads, appendAssistantMessage, editMessageText, getThread, fetchAllThreads, allThreads } from "@/lib/chat-store";
import { LANG_NAME } from "@/lib/i18n";

export const Route = createFileRoute("/employee/")({ component: EmployeePanel });

function EmployeePanel() {
  const nav = useNavigate();
  const authed = useEmployeeAuth();
  const store = useStore();
  useChatThreads();
  const threads = allThreads();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pane, setPane] = useState<"users" | "chats" | "convo">("users");

  useEffect(() => { if (!authed) nav({ to: "/employee/login" }); }, [authed, nav]);
  useEffect(() => { if (authed) { void fetchProfiles(); void fetchAllThreads(); } }, [authed]);
  if (!authed) return null;

  const selectedUser = store.profiles.find((p) => p.id === selectedUserId) ?? null;
  const userThreads = selectedUser ? listThreads(selectedUser.id) : [];
  const selectedThread = selectedThreadId ? getThread(selectedThreadId) : null;

  // ---------- Global stats ----------
  const totalUsers = store.profiles.length;
  const totalThreads = threads.length;
  const totalMsgs = threads.reduce((n, t) => n + t.messages.length, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const today = Date.now() - dayMs;
  const week = Date.now() - 7 * dayMs;
  const newToday = store.profiles.filter((p) => p.createdAt >= today).length;
  const newWeek = store.profiles.filter((p) => p.createdAt >= week).length;
  const activeWeek = new Set(threads.filter((t) => t.updatedAt >= week).map((t) => t.userId)).size;
  const langCounts: Record<string, number> = {};
  store.profiles.forEach((p) => { langCounts[p.lang] = (langCounts[p.lang] ?? 0) + 1; });
  const genderCounts: Record<string, number> = { female: 0, male: 0, other: 0 };
  store.profiles.forEach((p) => { if (p.gender) genderCounts[p.gender] = (genderCounts[p.gender] ?? 0) + 1; });

  function doLogout() { employeeLogout(); nav({ to: "/" }); }
  async function refresh() {
    setRefreshing(true);
    await Promise.all([fetchProfiles(), fetchAllThreads()]);
    setRefreshing(false);
  }

  return (
    <PageShell>
      <header className="mx-auto max-w-7xl px-4 sm:px-5 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/" className="text-muted-foreground hover:text-foreground shrink-0"><ArrowLeft className="size-4" /></Link>
          <Logo size={32} withText={false} />
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold">Team Console</div>
            <div className="text-xs sm:text-sm font-semibold truncate">Sanjeevni Operations</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={refresh} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 sm:px-3 py-1.5 text-xs hover:bg-muted">
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={doLogout} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 sm:px-3 py-1.5 text-xs hover:bg-muted">
            <LogOut className="size-3.5" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Global stats */}
      <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
          <StatCard icon={<Users className="size-4" />} label="Total users (global)" value={totalUsers} sub={`${newToday} today · ${newWeek}/wk`} />
          <StatCard icon={<MessageSquare className="size-4" />} label="Chats" value={totalThreads} sub={`${totalMsgs} messages`} />
          <StatCard icon={<Activity className="size-4" />} label="Active (7d)" value={activeWeek} sub="users w/ activity" />
          <StatCard icon={<Globe2 className="size-4" />} label="Languages" value={Object.keys(langCounts).length}
            sub={Object.entries(langCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v]) => `${k} ${v}`).join(" · ") || "—"} />
          <StatCard icon={<User className="size-4" />} label="Gender mix" value={`${genderCounts.female}♀ ${genderCounts.male}♂`}
            sub={`Other ${genderCounts.other}`} />
        </div>
      </div>

      {/* Mobile pane switcher */}
      <div className="md:hidden mx-auto max-w-7xl px-4 mt-4 flex gap-2">
        {(["users","chats","convo"] as const).map((p) => (
          <button key={p} onClick={() => setPane(p)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold border ${pane === p ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-card border-border text-muted-foreground"}`}>
            {p === "users" ? `Users (${totalUsers})` : p === "chats" ? `Chats (${userThreads.length})` : "Conversation"}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-5 py-4 grid md:grid-cols-[260px_300px_1fr] gap-3 sm:gap-4 md:h-[calc(100dvh-220px)]">
        {/* Users */}
        <aside className={`${pane !== "users" ? "hidden md:flex" : "flex"} rounded-2xl bg-card border border-border overflow-hidden flex-col min-h-[40vh] md:min-h-0`}>
          <div className="px-4 py-3 border-b border-border/50 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Members · {totalUsers}
          </div>
          <div className="overflow-y-auto flex-1">
            {store.profiles.length === 0 && (
              <p className="p-4 text-xs text-muted-foreground">No registered users yet.</p>
            )}
            {store.profiles
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((p) => {
                const active = p.id === selectedUserId;
                const age = ageFromDob(p.dob);
                const userMsgCount = threads.filter((t) => t.userId === p.id).reduce((n, t) => n + t.messages.length, 0);
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedUserId(p.id); setSelectedThreadId(null); setPane("chats"); }}
                    className={`w-full text-left px-3 sm:px-4 py-3 border-b border-border/40 hover:bg-muted/50 transition ${active ? "bg-primary/10" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-white text-sm font-bold">
                        {p.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Phone className="size-3" /> +91 {p.mobile}
                        </div>
                      </div>
                      {userMsgCount > 0 && (
                        <span className="text-[10px] font-bold rounded-full bg-primary/15 text-primary px-2 py-0.5">{userMsgCount}</span>
                      )}
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground flex flex-wrap gap-x-2">
                      <span>{p.gender}</span>
                      {age !== null && <span>{age} yrs</span>}
                      <span className="inline-flex items-center gap-1"><Languages className="size-2.5" /> {LANG_NAME[p.lang]}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </aside>

        {/* Threads */}
        <aside className={`${pane !== "chats" ? "hidden md:flex" : "flex"} rounded-2xl bg-card border border-border overflow-hidden flex-col min-h-[40vh] md:min-h-0`}>
          <div className="px-4 py-3 border-b border-border/50 text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
            <MessageSquare className="size-3.5" /> Chats
          </div>
          <div className="overflow-y-auto flex-1">
            {!selectedUser && <p className="p-4 text-xs text-muted-foreground">Select a member to view chats.</p>}
            {selectedUser && userThreads.length === 0 && (
              <p className="p-4 text-xs text-muted-foreground">No chats yet for this member.</p>
            )}
            {userThreads.map((t) => {
              const active = t.id === selectedThreadId;
              return (
                <button
                  key={t.id}
                  onClick={() => { setSelectedThreadId(t.id); setPane("convo"); }}
                  className={`w-full text-left px-4 py-3 border-b border-border/40 hover:bg-muted/50 ${active ? "bg-primary/10" : ""}`}
                >
                  <div className="text-sm font-semibold truncate">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(t.updatedAt).toLocaleString()} · {t.messages.length} msgs</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section className={`${pane !== "convo" ? "hidden md:flex" : "flex"} rounded-2xl bg-card border border-border overflow-hidden flex-col min-h-[50vh] md:min-h-0`}>
          {selectedThread && selectedUser ? (
            <ConversationView userId={selectedUser.id} userLang={selectedUser.lang} userName={selectedUser.name} threadId={selectedThread.id} />
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-muted-foreground p-6 text-center">
              <div>
                <User className="size-8 mx-auto opacity-30" />
                <p className="mt-2">Pick a member and a chat to view, edit, or reply as Sanjeevni.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-3 py-2.5 shadow-card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        <span className="text-primary">{icon}</span>{label}
      </div>
      <div className="mt-0.5 text-lg sm:text-xl font-extrabold">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground truncate">{sub}</div>}
    </div>
  );
}

function ConversationView({ userId, userLang, userName, threadId }: { userId: string; userLang: string; userName: string; threadId: string }) {
  useChatThreads();
  const thread = getThread(threadId);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messages = thread?.messages ?? [];
  const meta = thread?.meta ?? {};

  const langName = useMemo(() => LANG_NAME[userLang as keyof typeof LANG_NAME] ?? userLang, [userLang]);

  async function sendAsAI() {
    const txt = draft.trim();
    if (!txt) return;
    setSending(true);
    try {
      let translated = txt;
      let didTranslate = false;
      if (userLang !== "en") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: txt, targetLang: userLang, targetName: langName }),
        });
        if (res.ok) {
          const data = await res.json() as { translated: string };
          translated = data.translated;
          didTranslate = true;
        }
      }
      appendAssistantMessage(threadId, translated, {
        fromEmployee: true,
        translated: didTranslate,
        originalText: didTranslate ? txt : undefined,
        translatedLang: userLang,
      });
      setDraft("");
    } catch {
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function startEdit(id: string, text: string) { setEditId(id); setEditText(text); }
  function saveEdit() {
    if (editId) { editMessageText(threadId, editId, editText); setEditId(null); }
  }

  return (
    <>
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{userName} · {thread?.title}</div>
          <div className="text-[11px] text-muted-foreground">Replies auto-translate to {langName}.</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 && <p className="text-xs text-muted-foreground">Empty conversation.</p>}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          const mm = meta[m.id];
          const editing = editId === m.id;
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 text-sm relative group ${
                isUser ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground border border-border"
              }`}>
                {editing ? (
                  <div className="space-y-2 min-w-[220px]">
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background p-2 text-foreground text-xs" />
                    <div className="flex gap-1 justify-end">
                      <button onClick={saveEdit} className="size-7 rounded-full bg-primary text-white grid place-items-center"><Check className="size-3.5" /></button>
                      <button onClick={() => setEditId(null)} className="size-7 rounded-full bg-muted text-foreground grid place-items-center"><X className="size-3.5" /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap">{text}</div>
                    {mm?.translated && mm.originalText && (
                      <div className="mt-1.5 pt-1.5 border-t border-foreground/10 text-[10px] opacity-70">
                        EN: {mm.originalText}
                      </div>
                    )}
                    {mm?.fromEmployee && (
                      <div className="mt-1 text-[10px] font-semibold opacity-80">👤 Team{mm.fromEmployeeName ? ` · ${mm.fromEmployeeName}` : ""}</div>
                    )}
                    <button onClick={() => startEdit(m.id, text)} className="absolute -top-2 -right-2 size-6 rounded-full bg-background border border-border grid place-items-center opacity-0 group-hover:opacity-100 transition" aria-label="Edit">
                      <Edit2 className="size-3 text-muted-foreground" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border/50 p-3 bg-background/50">
        <div className="text-[11px] text-muted-foreground mb-2 inline-flex items-center gap-1">
          <Languages className="size-3" /> Type in English. Auto-translated to {langName}.
        </div>
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendAsAI(); } }}
            placeholder="Reply as Sanjeevni…"
            rows={2}
            className="flex-1 rounded-2xl bg-muted border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
          />
          <button
            onClick={sendAsAI}
            disabled={sending || !draft.trim()}
            className="size-11 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow disabled:opacity-40"
            aria-label="Send"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
