import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, MapPin, MessageCircle, Search, Sparkles } from "lucide-react";
import { PageShell, Disclaimer } from "@/components/PageShell";
import { t } from "@/lib/i18n";
import { useHasMounted, useUser } from "@/lib/user-store";
import { TOPICS } from "@/lib/topics";

const LOCATION_KEY = "saheli.schemesLocation.v1";

interface SavedLocation { city: string; state: string }

function loadLocation(): SavedLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as SavedLocation) : null;
  } catch { return null; }
}

function saveLocation(loc: SavedLocation) {
  try { localStorage.setItem(LOCATION_KEY, JSON.stringify(loc)); } catch { /* ignore */ }
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

export const Route = createFileRoute("/schemes")({
  component: SchemesPage,
});

function SchemesPage() {
  const mounted = useHasMounted();
  const user = useUser();
  const nav = useNavigate();
  const [loc, setLoc] = useState<SavedLocation | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");

  useEffect(() => { if (mounted && !user) nav({ to: "/" }); }, [mounted, user, nav]);
  useEffect(() => { if (mounted) setLoc(loadLocation()); }, [mounted]);

  if (!user) return null;
  const dict = t[user.lang] ?? t.en;
  const topic = TOPICS.find((tp) => tp.key === "schemes")!;
  const ti = dict.topics.schemes;
  const subs = dict.subtopics.schemes.filter(
    (s) => !q || (s.title + s.preview + s.detail).toLowerCase().includes(q.toLowerCase()),
  );

  function submitLocation(e: React.FormEvent) {
    e.preventDefault();
    const c = city.trim();
    const s = state.trim();
    if (!c || !s) return;
    const next = { city: c, state: s };
    saveLocation(next);
    setLoc(next);
  }

  function clearLocation() {
    try { localStorage.removeItem(LOCATION_KEY); } catch { /* ignore */ }
    setLoc(null);
    setCity("");
    setState("");
  }

  const stateSchemesQuery = loc
    ? `List the most important state government health, maternity, nutrition, vaccination and women's welfare schemes in ${loc.state} (India) — give scheme name, who it is for, the benefit amount or item, and how to apply. Use simple words.`
    : "";
  const localSchemesQuery = loc
    ? `List the local district / municipal health and women's welfare schemes available in ${loc.city}, ${loc.state} (India) — include city-level helplines, urban PHC/UHC services, free ambulance numbers and any city-specific maternal or sanitary scheme. Use simple words.`
    : "";

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
              <p className="text-white/85 mt-1">{ti.desc}</p>
            </div>
          </div>
          {loc && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs">
              <MapPin className="size-3.5" />
              {loc.city}, {loc.state}
              <button onClick={clearLocation} className="ml-2 underline">Change</button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 -mt-6 pb-10">
        {!loc && (
          <motion.form
            onSubmit={submitLocation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card shadow-card border border-border p-5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" />
              Tell us your city to get state & local schemes
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              We'll show central schemes for everyone, plus schemes specific to your state and city.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city (e.g. Lucknow)"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                required
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={!city.trim() || !state}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-glow disabled:opacity-50"
            >
              Show schemes for me
            </button>
          </motion.form>
        )}

        {loc && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/chat"
              search={{ q: stateSchemesQuery }}
              className="block rounded-2xl bg-card border border-border shadow-card p-5 hover:border-primary/40 hover:shadow-glow transition"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> State schemes
              </div>
              <div className="mt-1 font-bold">Schemes in {loc.state}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask Sanjeevni for every important state government scheme available to you.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <MessageCircle className="size-3.5" /> Ask now
              </div>
            </Link>
            <Link
              to="/chat"
              search={{ q: localSchemesQuery }}
              className="block rounded-2xl bg-card border border-border shadow-card p-5 hover:border-primary/40 hover:shadow-glow transition"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> Local schemes
              </div>
              <div className="mt-1 font-bold">Schemes in {loc.city}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                District-level helplines, free ambulances and city-specific welfare schemes.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <MessageCircle className="size-3.5" /> Ask now
              </div>
            </Link>
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-card shadow-card flex items-center gap-2 px-4 py-3 border border-border">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={dict.searchTopics}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <h2 className="mt-6 text-sm font-bold text-muted-foreground uppercase tracking-wide">
          Central Government schemes
        </h2>
        <div className="mt-3 space-y-3">
          {subs.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
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
                          search={{ q: `Tell me more about ${s.title} — who is eligible, how to apply, and what documents are needed. Include the state-specific implementation in ${loc?.state ?? "my state"} if relevant.` }}
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
