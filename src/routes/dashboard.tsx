import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, MessageCircle, Globe, Settings, List } from "lucide-react";
import { PageShell, Disclaimer } from "@/components/PageShell";
import { EmergencyBar } from "@/components/EmergencyBar";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";
import { useHasMounted, useUser } from "@/lib/user-store";
import { TOPICS } from "@/lib/topics";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const mounted = useHasMounted();
  const user = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if (mounted && !user) nav({ to: "/" });
  }, [mounted, user, nav]);

  if (!user) return null;
  const dict = t[user.lang];

  return (
    <PageShell>
      <header className="mx-auto max-w-5xl px-5 py-5 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/settings" className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted transition">
            <Globe className="size-3.5 text-muted-foreground" /> {dict.changeLanguage}
          </Link>
          <Link to="/settings" aria-label={dict.settings} className="size-9 grid place-items-center rounded-full bg-card border border-border hover:bg-muted transition">
            <Settings className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-8">
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p className="text-sm text-muted-foreground">{dict.greeting}</p>
          <h1 className="text-3xl md:text-4xl font-bold">{user.name} 💖</h1>
          <p className="mt-2 text-muted-foreground">{dict.dashboardSub}</p>
        </motion.div>

        <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-3 items-stretch">
          <Link to="/chat" className="block rounded-3xl p-1 bg-gradient-primary shadow-glow hover:shadow-soft transition hover:scale-[1.01]">
            <div className="rounded-[1.4rem] bg-card p-5 flex items-center gap-4 h-full">
              <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center text-2xl shadow-soft animate-heartbeat">🌸</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{dict.chatWithAI}</div>
                <div className="text-sm text-muted-foreground">{dict.askAnything}</div>
              </div>
              <div className="size-10 grid place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                <MessageCircle className="size-5" />
              </div>
            </div>
          </Link>
          <Link to="/chats" className="rounded-3xl bg-card border border-border shadow-card hover:border-primary/40 transition p-5 flex items-center gap-3 sm:flex-col sm:justify-center sm:text-center sm:w-40">
            <List className="size-5 text-primary" />
            <div className="text-sm font-semibold leading-tight">{dict.myChats}</div>
          </Link>
        </div>

        <h2 className="mt-10 text-xl font-bold">{dict.dashboardTitle}</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic, i) => {
            const ti = dict.topics[topic.key];
            return (
              <motion.div
                key={topic.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {topic.key === "schemes" ? (
                  <Link
                    to="/schemes"
                    className="block rounded-3xl p-6 text-white relative overflow-hidden shadow-card hover:shadow-glow transition hover:-translate-y-1.5"
                  >
                    <div className={`absolute inset-0 ${topic.gradient}`} />
                    <div className="relative">
                      <div className="text-4xl">{topic.icon}</div>
                      <h3 className="mt-4 font-bold text-lg leading-tight">{ti.title}</h3>
                      <p className="mt-1 text-sm text-white/80">{ti.desc}</p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 rounded-full px-3 py-1">
                        {dict.exploreCta} <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/topic/$key"
                    params={{ key: topic.key }}
                    className="block rounded-3xl p-6 text-white relative overflow-hidden shadow-card hover:shadow-glow transition hover:-translate-y-1.5"
                  >
                    <div className={`absolute inset-0 ${topic.gradient}`} />
                    <div className="relative">
                      <div className="text-4xl">{topic.icon}</div>
                      <h3 className="mt-4 font-bold text-lg leading-tight">{ti.title}</h3>
                      <p className="mt-1 text-sm text-white/80">{ti.desc}</p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 rounded-full px-3 py-1">
                        {dict.exploreCta} <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10">
          <EmergencyBar dict={dict} female={user.gender === "female"} />
        </div>
        <Disclaimer text={dict.disclaimer} />
      </div>
    </PageShell>
  );
}
