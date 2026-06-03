import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, MessageCircle, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";
import { useAuthReady, useUser, useHasSession } from "@/lib/user-store";
import { listThreads, deleteThread, useChatThreads } from "@/lib/chat-store";

export const Route = createFileRoute("/chats")({
  component: ChatsPage,
});

function ChatsPage() {
  const ready = useAuthReady();
  const hasSession = useHasSession();
  const user = useUser();
  const nav = useNavigate();
  useChatThreads();

  useEffect(() => {
    if (ready && !user && !hasSession) nav({ to: "/" });
  }, [ready, user, nav]);

  if (!user) return null;
  const dict = t[user.lang];
  const threads = listThreads(user.id).filter((th) => th.messages.length > 0);

  function fmt(ts: number) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" }) + " · " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <PageShell>
      <header className="mx-auto max-w-2xl px-5 py-5 flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {dict.back}
        </Link>
        <Logo size={36} />
        <div className="w-10" />
      </header>

      <div className="mx-auto max-w-2xl px-5 pb-12">
        <h1 className="text-3xl font-bold">{dict.myChats}</h1>
        <p className="text-sm text-muted-foreground mt-1">{dict.dashboardSub}</p>

        <Link
          to="/chat"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="size-4" /> {dict.newChat}
        </Link>

        <div className="mt-6 space-y-2">
          {threads.length === 0 && (
            <div className="rounded-3xl bg-card border border-border p-8 text-center text-sm text-muted-foreground shadow-card">
              {dict.noChatsYet}
            </div>
          )}
          {threads.map((th) => {
            const last = th.messages[th.messages.length - 1];
            const lastText = last?.parts.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "";
            return (
              <div key={th.id} className="rounded-2xl bg-card border border-border shadow-card flex items-center gap-3 p-3 hover:border-primary/40 transition">
                <Link to="/chat" search={{ threadId: th.id }} className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-full bg-gradient-primary grid place-items-center shrink-0 text-white">
                    <MessageCircle className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{th.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{lastText}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mt-0.5">{fmt(th.updatedAt)}</div>
                  </div>
                </Link>
                <button
                  onClick={() => { if (confirm(dict.deleteChat + "?")) deleteThread(th.id); }}
                  aria-label={dict.deleteChat}
                  className="size-9 grid place-items-center rounded-full text-muted-foreground hover:text-emergency hover:bg-emergency/10 transition"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
