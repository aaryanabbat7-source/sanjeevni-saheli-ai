import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, MessageCircle, Search } from "lucide-react";
import { PageShell, Disclaimer } from "@/components/PageShell";
import { t, type TopicKey } from "@/lib/i18n";
import { useUser, useAuthReady } from "@/lib/user-store";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/topic/$key")({
  component: TopicPage,
});

function TopicPage() {
  const { key } = Route.useParams();
  const ready = useAuthReady();
  const user = useUser();
  const nav = useNavigate();
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");

  const topicKey = key as TopicKey;
  const topic = TOPICS.find((tp) => tp.key === topicKey);

  useEffect(() => {
    if (!topic) nav({ to: "/dashboard" });
    else if (ready && !user) nav({ to: "/" });
  }, [topic, ready, user, nav]);

  if (!topic || !user) return null;

  const dict = t[user.lang];
  const ti = dict.topics[topicKey];
  const subs = dict.subtopics[topicKey].filter(
    (s) => !q || (s.title + s.preview + s.detail).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PageShell>
      <div className={`relative ${topic.gradient} text-white`}>
        <div className="mx-auto max-w-3xl px-5 py-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-white/90 hover:text-white">
            <ArrowLeft className="size-4" /> {dict.backToTopics}
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <div className="text-5xl">{topic.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{ti.title}</h1>
              <p className="text-white/80 mt-1">{ti.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 -mt-6">
        <div className="rounded-2xl bg-card shadow-card flex items-center gap-2 px-4 py-3 border border-border">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={dict.searchTopics}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="mt-6 space-y-3">
          {subs.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-card shadow-card border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 text-left flex items-center gap-3"
              >
                <div className="size-2 rounded-full" style={{ background: `var(--${topic.color})` }} />
                <div className="flex-1">
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.preview}</div>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-sm text-foreground/80 leading-relaxed border-t border-border">
                      <p>{s.detail}</p>
                      <div className="mt-4">
                        <Link
                          to="/chat"
                          search={{ q: s.title }}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-4 py-2 text-xs font-semibold shadow-soft hover:shadow-glow transition"
                        >
                          <MessageCircle className="size-3.5" /> {dict.askSanjeevniAbout}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {subs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">{dict.noResults}</p>
          )}
        </div>

        <Disclaimer text={dict.disclaimer} />
      </div>
    </PageShell>
  );
}
