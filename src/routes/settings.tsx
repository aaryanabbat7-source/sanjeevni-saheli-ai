import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Globe, LogOut, Check, UserPlus, Trash2, Lock, Phone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Logo } from "@/components/Logo";
import { LANGUAGES, t, type Lang } from "@/lib/i18n";
import {
  useUser, useStore, useAuthReady, setActive, logout, removeProfile,
  updateActiveLang, clearDraft, setDraft, profilesByMobile, MAX_PER_MOBILE,
} from "@/lib/user-store";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const ready = useAuthReady();
  const hasSession = useHasSession();
  const user = useUser();
  const store = useStore();
  const nav = useNavigate();
  const [showLangs, setShowLangs] = useState(false);

  useEffect(() => {
    if (ready && !user && !hasSession) nav({ to: "/" });
  }, [ready, user, nav]);

  if (!user) return null;
  const dict = t[user.lang];

  const sameMobile = profilesByMobile(user.mobile);
  const canAddMore = sameMobile.length < MAX_PER_MOBILE;

  function changeLang(l: Lang) {
    updateActiveLang(l);
    setShowLangs(false);
  }

  function doLogout() {
    logout();
    nav({ to: "/" });
  }

  function addProfile() {
    clearDraft();
    setDraft({ mobile: user!.mobile });
    nav({ to: "/onboarding/language" });
  }

  function remove(id: string) {
    if (!confirm(dict.removeConfirm)) return;
    removeProfile(id);
    if (id === user!.id) nav({ to: "/" });
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

      <div className="mx-auto max-w-2xl px-5 pb-10 space-y-6">
        <h1 className="text-3xl font-bold">{dict.settings}</h1>

        {/* Language */}
        <section className="rounded-3xl bg-card border border-border p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted grid place-items-center">
              <Globe className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{dict.language}</div>
              <div className="text-xs text-muted-foreground">{LANGUAGES.find((l) => l.code === user.lang)?.native}</div>
            </div>
            <button onClick={() => setShowLangs((s) => !s)} className="text-xs font-semibold text-primary hover:underline">
              {dict.changeLanguage}
            </button>
          </div>
          {showLangs && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => {
                const active = l.code === user.lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={`rounded-2xl p-3 text-center border-2 transition ${
                      active ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xl">{l.flag}</div>
                    <div className="text-sm font-bold mt-1">{l.native}</div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Profile details */}
        <section className="rounded-3xl bg-card border border-border p-5 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">{dict.profileDetails}</div>
          <Row label={dict.mobile} value={`+91 ${user.mobile}`} />
          <Row label="Name" value={user.name} locked lockedLabel={dict.cannotEdit} />
          <Row label={dict.dob} value={user.dob ?? "—"} locked lockedLabel={dict.cannotEdit} />
          <Row label={dict.gender} value={dict[user.gender ?? "other"]} locked lockedLabel={dict.cannotEdit} />
        </section>

        {/* Switch profiles */}
        <section className="rounded-3xl bg-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{dict.switchProfile}</div>
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Phone className="size-3" /> +91 {user.mobile} · {sameMobile.length}/{MAX_PER_MOBILE}
            </div>
          </div>
          <div className="space-y-2">
            {sameMobile.map((p) => {
              const active = p.id === user.id;
              return (
                <div key={p.id} className={`rounded-2xl border p-3 flex items-center gap-3 transition ${active ? "border-primary bg-primary/5" : "border-border"}`}>
                  <button
                    onClick={() => setActive(p.id)}
                    className="flex-1 text-left flex items-center gap-3"
                    disabled={active}
                  >
                    <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-white font-bold">
                      {p.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {p.name}
                        {active && <Check className="size-3.5 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.gender} · {p.lang.toUpperCase()}</div>
                    </div>
                  </button>
                  <button onClick={() => remove(p.id)} aria-label={dict.removeProfile} className="size-8 grid place-items-center rounded-full text-muted-foreground hover:text-emergency hover:bg-emergency/10 transition">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
          {canAddMore && (
            <button onClick={addProfile} className="mt-3 w-full rounded-2xl border-2 border-dashed border-border hover:border-primary px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2">
              <UserPlus className="size-4" /> {dict.addAnotherProfile}
            </button>
          )}
        </section>

        {/* Other profiles on device (different mobile) */}
        {store.profiles.some((p) => p.mobile !== user.mobile) && (
          <section className="rounded-3xl bg-card border border-border p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Other profiles on this device</div>
            <div className="space-y-2">
              {store.profiles.filter((p) => p.mobile !== user.mobile).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className="w-full text-left rounded-2xl border border-border hover:border-primary p-3 flex items-center gap-3 transition"
                >
                  <div className="size-10 rounded-full bg-muted grid place-items-center font-bold text-muted-foreground">
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">+91 {p.mobile}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <button onClick={doLogout} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-emergency/40 text-emergency px-6 py-3 font-semibold hover:bg-emergency/10 transition">
          <LogOut className="size-4" /> {dict.logout}
        </button>
      </div>
    </PageShell>
  );
}

function Row({ label, value, locked, lockedLabel }: { label: string; value: string; locked?: boolean; lockedLabel?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold inline-flex items-center gap-2">
        {value}
        {locked && <Lock className="size-3 text-muted-foreground" aria-label={lockedLabel} />}
      </span>
    </div>
  );
}
