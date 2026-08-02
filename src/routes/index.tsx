import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Heart, Globe, Mic, MessageCircle, LogIn, UserPlus, Settings, Flower2 } from "lucide-react";
import { Logo, LogoFull } from "@/components/Logo";
import { PageShell, Disclaimer } from "@/components/PageShell";
import { EmergencyBar } from "@/components/EmergencyBar";
import { t } from "@/lib/i18n";
import { TOPICS } from "@/lib/topics";
import { useHasMounted, useUser, clearDraft } from "@/lib/user-store";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanjeevni Saheli AI — Healthcare for every Indian family" },
      { name: "description", content: "Warm, multilingual AI health companion. Guidance on menstrual health, nutrition, pregnancy, vaccination & emergencies. Hindi · Bengali · English." },
      { property: "og:title", content: "Sanjeevni Saheli AI — Healthcare for every Indian family" },
      { property: "og:description", content: "Warm, multilingual AI health companion for India." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const mounted = useHasMounted();
  const user = useUser();
  const lang = user?.lang ?? "en";
  const dict = t[lang];
  const loggedIn = mounted && !!user;

  return (
    <PageShell>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <LogoFull height={56} />
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#topics" className="hover:text-foreground transition">Topics</a>
          <a href="#impact" className="hover:text-foreground transition">Impact</a>
          <a href="#mission" className="hover:text-foreground transition">Mission</a>
        </nav>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link to="/settings" aria-label={dict.settings} className="size-9 grid place-items-center rounded-full bg-card border border-border hover:bg-muted transition">
                <Settings className="size-4 text-muted-foreground" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition">
                {dict.openApp} <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition">
                <LogIn className="size-4" /> {dict.login}
              </Link>
              <Link
                to="/onboarding/country"
                onClick={() => clearDraft()}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition"
              >
                <UserPlus className="size-4" /> {dict.register}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-16 md:pt-12 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="size-3.5" /> A student-led healthcare initiative for India
          </motion.div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Healthcare guidance for <span className="text-gradient">every Indian family</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            Multilingual AI-powered health support designed for accessibility, awareness, and empowerment — from a teenage daughter's first period to a grandmother's medicine question.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {loggedIn ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:shadow-soft transition hover:scale-[1.02]">
                {dict.openApp} <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/onboarding/country"
                  onClick={() => clearDraft()}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:shadow-soft transition hover:scale-[1.02]"
                >
                  <UserPlus className="size-4" /> {dict.register}
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold text-foreground hover:bg-white transition">
                  <LogIn className="size-4" /> {dict.login}
                </Link>
              </>
            )}
            <a href="#topics" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold text-foreground hover:bg-white transition">
              {dict.explore}
            </a>
          </div>
          <div className="mt-8">
            <EmergencyBar dict={dict} female country={user?.country} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] max-w-md rounded-[2.5rem] bg-gradient-primary p-1 shadow-glow">
            <div className="relative h-full w-full rounded-[2.3rem] bg-card p-6 overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="grid place-items-center size-6 rounded-full bg-gradient-primary text-white text-[10px]">🌸</span>
                Sanjeevni
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 max-w-[80%] text-sm">
                  Namaste! I'm here to help you with any health question. 💖
                </div>
                <div className="ml-auto rounded-2xl rounded-tr-md bg-gradient-primary text-primary-foreground px-4 py-2.5 max-w-[80%] text-sm">
                  मेरी बेटी को बुखार है, क्या करूँ?
                </div>
                <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 max-w-[85%] text-sm">
                  चिंता मत कीजिए। माथे पर ठंडी पट्टी रखें, पानी पिलाएँ, और पैरासिटामोल दें। 102°F से अधिक हो तो डॉक्टर के पास जाएँ।
                </div>
                <div className="flex gap-1.5 px-4">
                  <span className="size-1.5 rounded-full bg-primary typing-dot" />
                  <span className="size-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="size-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-4 rounded-full glass-pink flex items-center gap-2 px-4 py-2.5">
                <Mic className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground flex-1">Tap to speak in Hindi…</span>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-2 rounded-2xl glass px-3 py-2 text-xs font-semibold text-secondary shadow-soft"
          >
            🇮🇳 हिन्दी
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/3 -right-3 rounded-2xl glass px-3 py-2 text-xs font-semibold text-secondary shadow-soft"
          >
            🩺 24/7
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-3 left-6 rounded-2xl glass px-3 py-2 text-xs font-semibold text-secondary shadow-soft"
          >
            💖 Free for all
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Built for India, with care</h2>
          <p className="mt-2 text-muted-foreground">Every feature designed for trust, simplicity and reach.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Globe, title: "Multilingual", desc: "English, हिन्दी, বাংলা today — more Indian languages coming.", color: "text-vaccine" },
            { icon: Mic, title: "Voice First", desc: "Speak naturally — no typing needed. Listens in your language.", color: "text-pregnancy" },
            { icon: Shield, title: "Privacy First", desc: "Your data stays on your device. No medical records stored.", color: "text-nutrition" },
            { icon: Heart, title: "Emergency Aware", desc: "Detects danger words and instantly shows 108 & first-aid steps.", color: "text-emergency" },
          ].map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-card p-6 shadow-card border border-border/50 hover:shadow-glow transition"
            >
              <f.icon className={`size-7 ${f.color}`} />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Topics that matter</h2>
          <p className="mt-2 text-muted-foreground">From first period to first vaccine — guidance you can trust.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TOPICS.map((topic) => {
            const ti = dict.topics[topic.key];
            return (
              <Link
                key={topic.key}
                to={loggedIn ? "/topic/$key" : "/login"}
                params={loggedIn ? { key: topic.key } : undefined}
                className="group rounded-3xl p-5 text-white relative overflow-hidden shadow-card hover:shadow-glow transition hover:-translate-y-1.5"
              >
                <div className={`absolute inset-0 ${topic.gradient}`} />
                <div className="relative">
                  <div className="text-3xl">{topic.icon}</div>
                  <h3 className="mt-3 font-bold leading-tight">{ti.title}</h3>
                  <p className="mt-1 text-xs text-white/80 leading-snug">{ti.desc}</p>
                  <ArrowRight className="size-4 mt-3 opacity-70 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-3xl bg-gradient-primary p-8 md:p-12 text-primary-foreground shadow-glow text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Healthcare access, reimagined</h2>
          <p className="mt-3 text-primary-foreground/85 max-w-2xl mx-auto">
            India has 1.4 billion people and just 1 doctor per 1,500. Sanjeevni Saheli AI bridges that gap with trustworthy, vernacular guidance — anywhere, anytime.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { k: "3+", v: "Languages" },
              { k: "5", v: "Care areas" },
              { k: "24/7", v: "Always on" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl md:text-5xl font-extrabold">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/80 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-3xl glass p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center">
          <div className="size-20 rounded-2xl bg-gradient-primary grid place-items-center text-3xl shadow-glow">🌍</div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-xs uppercase tracking-widest text-primary font-bold">Our Mission</div>
            <h3 className="mt-1 text-2xl font-bold">A student-led initiative for a healthier India</h3>
            <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
              Sanjeevni Saheli AI is built as a non-profit, open-access health companion. Our mission: empower every woman, mother and family with the right health information, in their own language.
            </p>
          </div>
          <Link
            to={loggedIn ? "/dashboard" : "/onboarding/country"}
            onClick={() => { if (!loggedIn) clearDraft(); }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow whitespace-nowrap"
          >
            {loggedIn ? dict.openApp : dict.register} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-10 border-t border-border/50 mt-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Logo />
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
            ⚕️ {dict.disclaimer} Built with ❤️ for India.
          </p>
        </div>
      </footer>
      <Disclaimer text="" />
      <span className="sr-only"><MessageCircle /></span>

      {/* Hidden team-access flower (internal) */}
      <Link
        to="/employee/login"
        aria-label="Sanjeevni"
        className="fixed bottom-3 left-3 z-50 size-8 rounded-full bg-transparent text-foreground/20 hover:text-primary/70 grid place-items-center transition opacity-40 hover:opacity-100"
      >
        <Flower2 className="size-4" />
      </Link>
    </PageShell>
  );
}
