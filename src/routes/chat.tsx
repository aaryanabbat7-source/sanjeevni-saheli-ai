import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, Send, Volume2, Phone, AlertTriangle, Square, Copy, Check, VolumeX, List } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { t, bcp47 } from "@/lib/i18n";
import { useUser, useAuthReady, ageFromDob } from "@/lib/user-store";
import { detectEmergency } from "@/lib/topics";
import { createThread, getThread, saveThread, useChatThreads } from "@/lib/chat-store";
import { z } from "zod";

const search = z.object({
  q: z.string().optional(),
  threadId: z.string().optional(),
});

export const Route = createFileRoute("/chat")({
  validateSearch: search,
  component: ChatPage,
});

function ChatPage() {
  const ready = useAuthReady();
  const user = useUser();
  const nav = useNavigate();
  const { q, threadId } = Route.useSearch();
  // subscribe to thread store so updates re-render
  useChatThreads();

  useEffect(() => {
    if (ready && !user) nav({ to: "/" });
  }, [ready, user, nav]);

  // Resolve / create active thread
  const activeThreadId = useMemo(() => {
    if (!mounted || !user) return null;
    if (threadId) {
      const existing = getThread(threadId);
      if (existing && existing.userId === user.id) return threadId;
    }
    const created = createThread(user.id);
    return created.id;
  }, [mounted, user, threadId]);

  useEffect(() => {
    if (activeThreadId && activeThreadId !== threadId) {
      nav({ to: "/chat", search: { threadId: activeThreadId, q }, replace: true });
    }
  }, [activeThreadId, threadId, q, nav]);

  const initialMessages = useMemo<UIMessage[]>(() => {
    if (!activeThreadId) return [];
    return getThread(activeThreadId)?.messages ?? [];
  }, [activeThreadId]);

  const lang = user?.lang ?? "en";
  const dict = t[lang] ?? t.en;
  const langCode = bcp47(lang);
  const age = ageFromDob(user?.dob ?? null);

  const { messages, sendMessage, status, stop } = useChat({
    id: activeThreadId ?? "pending",
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { lang, profile: { name: user?.name, age: age ?? undefined, gender: user?.gender ?? undefined } },
    }),
  });

  const [input, setInput] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [listening, setListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const recRef = useRef<unknown>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    if (q && !sentInitial.current && mounted && user && activeThreadId) {
      sentInitial.current = true;
      void sendMessage({ text: q });
    }
  }, [q, mounted, user, activeThreadId, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Persist messages
  useEffect(() => {
    if (!activeThreadId) return;
    if (status === "streaming" || status === "submitted") return;
    if (messages.length === 0) return;
    saveThread(activeThreadId, messages);
  }, [messages, status, activeThreadId]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  if (!user || !activeThreadId) return null;

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value) return;
    if (detectEmergency(value)) setEmergency(true);
    void sendMessage({ text: value });
    setInput("");
  }

  function speak(id: string, text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) { setSpeakingId(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode;
    u.rate = 0.95;
    u.onend = () => setSpeakingId((s) => (s === id ? null : s));
    u.onerror = () => setSpeakingId((s) => (s === id ? null : s));
    window.speechSynthesis.speak(u);
    setSpeakingId(id);
  }

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {/* noop */}
  }

  function toggleMic() {
    if (typeof window === "undefined") return;
    const SR = (window as unknown as { webkitSpeechRecognition?: new () => unknown; SpeechRecognition?: new () => unknown }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) { alert("Voice input is not supported in this browser. Please type your question."); return; }
    if (listening) {
      (recRef.current as { stop?: () => void } | null)?.stop?.();
      setListening(false);
      return;
    }
    const rec = new (SR as new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void; onerror: () => void; start: () => void; stop: () => void;
    })();
    rec.lang = langCode; rec.continuous = false; rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      handleSend(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
    recRef.current = rec;
  }

  const starterPrompts = lang === "hi"
    ? ["मासिक धर्म में दर्द क्यों होता है?", "गर्भावस्था में क्या खाएँ?", "बच्चे के टीके कब लगते हैं?"]
    : lang === "bn"
    ? ["মাসিকের সময় ব্যথা কেন হয়?", "গর্ভাবস্থায় কী খাব?", "শিশুর টিকা কখন?"]
    : lang === "or"
    ? ["ମାସିକ ସମୟରେ ବ୍ୟଥା କାହିଁକି?", "ଗର୍ଭାବସ୍ଥାରେ କ'ଣ ଖାଇବି?", "ଶିଶୁ ଟିକା କେବେ?"]
    : ["Why do I get period cramps?", "What should I eat in pregnancy?", "When are baby vaccines due?"];

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl flex flex-col h-dvh">
        <header className="px-5 py-3 flex items-center justify-between border-b border-border/50 glass">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="size-4" /> <Logo size={32} />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/chats" aria-label={dict.myChats} className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition">
              <List className="size-3.5" /> {dict.myChats}
            </Link>
            <a href="tel:108" className="inline-flex items-center gap-1.5 rounded-full bg-emergency/10 text-emergency px-3 py-1.5 text-xs font-bold">
              <Phone className="size-3.5" /> 108
            </a>
          </div>
        </header>

        <AnimatePresence>
          {emergency && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="m-3 rounded-2xl border-2 border-emergency bg-emergency/5 p-4 animate-emergency">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-6 text-emergency shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-emergency">This sounds urgent</div>
                    <p className="text-sm mt-1 text-foreground/80">Please call emergency services right now. While waiting, stay calm and keep the person safe.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href="tel:108" className="inline-flex items-center gap-2 rounded-full bg-emergency text-white px-4 py-2 text-sm font-bold">
                        <Phone className="size-4" /> Call 108
                      </a>
                      {user.gender === "female" && (
                        <a href="tel:181" className="inline-flex items-center gap-2 rounded-full bg-pregnancy text-white px-4 py-2 text-sm font-bold">
                          <Phone className="size-4" /> 181
                        </a>
                      )}
                      <button onClick={() => setEmergency(false)} className="rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="mx-auto size-20 rounded-full bg-gradient-primary grid place-items-center text-4xl shadow-glow animate-heartbeat">🌸</div>
              <h2 className="mt-5 text-xl font-bold">{dict.askAnything}</h2>
              <p className="text-sm text-muted-foreground mt-1">Sanjeevni · {lang === "hi" ? "हिन्दी" : lang === "bn" ? "বাংলা" : lang === "or" ? "ଓଡ଼ିଆ" : "English"}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {starterPrompts.map((s) => (
                  <button key={s} onClick={() => handleSend(s)} className="rounded-full glass-pink px-4 py-2 text-xs text-foreground hover:bg-white transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            const threadMeta = activeThreadId ? getThread(activeThreadId)?.meta?.[m.id] : undefined;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
                {!isUser && (
                  <div className="size-8 rounded-full bg-gradient-primary grid place-items-center text-sm shrink-0 shadow-soft">🌸</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-gradient-primary text-primary-foreground rounded-tr-md shadow-soft"
                    : "bg-card border border-border text-foreground rounded-tl-md shadow-card"
                }`}>
                  {text}
                  {!isUser && threadMeta?.translated && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground italic">
                      🌐 Translated to your preferred language automatically.
                    </div>
                  )}
                  {!isUser && text && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => copy(m.id, text)}
                        className="inline-flex items-center gap-1 rounded-full bg-muted hover:bg-muted/70 px-2.5 py-1 text-xs text-foreground transition"
                        aria-label={dict.copy}
                      >
                        {copiedId === m.id ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}
                        {copiedId === m.id ? dict.copied : dict.copy}
                      </button>
                      <button
                        onClick={() => speak(m.id, text)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition ${
                          speakingId === m.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70 text-foreground"
                        }`}
                        aria-label={speakingId === m.id ? dict.stop : dict.listen}
                      >
                        {speakingId === m.id ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
                        {speakingId === m.id ? dict.stop : dict.listen}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {(status === "submitted" || status === "streaming") && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2">
              <div className="size-8 rounded-full bg-gradient-primary grid place-items-center text-sm shadow-soft">🌸</div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-card">
                <div className="flex gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary typing-dot" />
                  <span className="size-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="size-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border/50 glass">
          {listening && (
            <div className="text-center text-xs text-primary font-semibold mb-2 animate-pulse">🎤 {dict.listening}</div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2">
            <button
              type="button"
              onClick={toggleMic}
              aria-label="Voice input"
              className={`size-11 rounded-full grid place-items-center shrink-0 transition ${
                listening ? "bg-emergency text-white animate-pulse-ring" : "bg-gradient-primary text-primary-foreground shadow-soft"
              }`}
            >
              <Mic className="size-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={dict.chatPlaceholder}
              rows={1}
              className="flex-1 rounded-2xl bg-card border border-border px-4 py-3 text-sm outline-none focus:border-primary resize-none max-h-32"
            />
            {status === "streaming" ? (
              <button type="button" onClick={() => stop()} aria-label="Stop" className="size-11 rounded-full bg-muted text-foreground grid place-items-center shrink-0">
                <Square className="size-4" />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} aria-label="Send"
                className="size-11 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shrink-0 shadow-glow disabled:opacity-40">
                <Send className="size-5" />
              </button>
            )}
          </form>
          <p className="text-[10px] text-muted-foreground text-center mt-2">⚕️ {dict.disclaimer}</p>
        </div>
      </div>
    </PageShell>
  );
}
