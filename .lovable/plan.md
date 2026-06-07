This is a large multi-area change. I want to confirm scope and call out one tradeoff before I start, so I don't burn a long session in the wrong direction.

## 1. Branding (brand kit as source of truth)
- Replace logo with the uploaded background-removed mark (`WhatsApp_…removebg`). Use it across header, splash, 404, loading. Keep symbol-only in nav.
- Rewrite design tokens in `src/styles.css` to the brand kit palette:
  - Sage `#6E7D5A`, Terracotta `#C68C7A`, Warm Ivory `#F2E9DF`, Earth Brown `#5B4A3B`, Moss `#A8B69A`.
  - Replace current vivid coral/teal vibrant theme with this calmer earthy palette. Primary = Sage, accent = Terracotta, background = Warm Ivory.
- Typography: Playfair Display (headings) + Lato (body) via Google Fonts, wired in `__root.tsx` head links and `src/styles.css` font tokens.
- I will NOT copy brand-kit layouts, business cards, tote bag, etc. — only tokens, type, logo.

## 2. Countries
Add Ethiopia (ET), Somalia (SO), Djibouti (DJ) to `src/lib/countries.ts` with mobile lengths and postal config per your table. Already have IN, BD, NP, BT, KE, NG, NE, TD, UG. Update emergency numbers for the 3 new ones.

## 3. Languages
Add Urdu (ur), Arabic (ar), Somali (so), Amharic (am) to `src/lib/i18n.ts`. Add RTL support for Urdu/Arabic (set `dir="rtl"` on `<html>` when active).

## 4. Global i18n (the big one)
Today only the chatbot translates. To make EVERY screen switch language I will:
- Expand the `Dict` in `src/lib/i18n.ts` with the full key set used across dashboard, settings, onboarding, auth, employee console, errors, toasts, schemes, chat header, emergency bar, etc.
- Replace hard-coded English strings in routes/components with `dict.*` lookups.
- Hook language change to: persist to Supabase profile, mirror to `localStorage`, set `<html lang dir>`, and re-render via the user store (already reactive).
- For the 12 supported languages I will machine-translate the dictionary at build-authoring time using Lovable AI (one-off, committed as static JSON), not at runtime. This keeps it fast and offline.

Scope note: I will translate the full UI surface. Long-form marketing copy on the landing page will be translated too.

## 5. TTS per-language
- In chat TTS handler, pick `SpeechSynthesisUtterance.lang` from the message's language (detect via simple Unicode-script heuristics: Devanagari→hi, Bengali→bn, Arabic script→ur/ar, Ethiopic→am, Latin→en/so/sw/etc., fall back to user's selected lang).
- Strip emoji + icon glyphs before speaking (regex on emoji ranges + lucide icon text).
- Use the best matching `speechSynthesis.getVoices()` voice for that BCP-47 tag.

## 6. Postal code validation — IMPORTANT tradeoff
You asked for real DB validation (e.g. India 302017 valid, 999999 invalid). The honest situation:
- Comprehensive postal datasets exist only for some countries (India ~155k PINs, Bangladesh ~600, Kenya ~600, Nigeria ~700, Nepal ~900, Ethiopia ~700, Bhutan ~200). Chad/Uganda/Somalia/Djibouti have no national postal system — those countries will only accept "no postal code" or any format, per your own table.
- Importing 155k Indian PINs into Supabase is fine but adds ~5MB of seed data and a migration.

**My proposal**, unless you say otherwise:
- Create `public.postal_codes (country_code, postal_code, region, district, is_active)` with index on `(country_code, postal_code)`.
- Seed India, Bangladesh, Nepal, Bhutan, Kenya, Nigeria, Ethiopia from public GeoNames postal datasets (free, public domain).
- For Niger / Chad / Somalia / Djibouti / Uganda: keep format-only validation since no authoritative DB exists. Show a note "postal code optional / not verified" instead of false rejection.
- Validation runs server-side via a `createServerFn` so it can't be bypassed.

If you'd rather skip the heavy seed and ship only format validation for now, say so — I'll do that instead and we can add the dataset later.

## 7. Mobile-first onboarding
- Add a shared `<StickyContinue>` component used by every onboarding step: fixed bottom, respects `env(safe-area-inset-bottom)`, becomes enabled when step is valid, hides until first valid selection.
- Remove duplicate inline Continue buttons from each step.
- Compact the per-step layouts so primary content fits in one mobile viewport on a 360×640 device.
- Add `scroll-behavior: smooth`, `overscroll-behavior: contain`, `-webkit-overflow-scrolling: touch`, and `content-visibility: auto` on long lists (chats, employee user table) for perf.

## 8. Mobile number validation
Already country-driven in `countries.ts`. I'll tighten regexes per your table (Ethiopia `^9\d{8}$`, Somalia `^[67]\d{7,8}$`, Djibouti `^77\d{6}$`), store as E.164 (`{dialPrefix}{digits}`) in DB, and revalidate in the `commitDraft` server path.

---

## What I need from you before I start

1. **Postal validation**: go with the GeoNames seed (heavier, real DB for 7 countries) or stay format-only for now?
2. **Translation source**: OK to machine-translate the UI dictionary via Lovable AI and commit the result, or do you want to provide your own translations for any language?
3. **Existing pink/coral theme**: confirm full replacement with the brand-kit sage/terracotta/ivory earthy palette — landing page included.

Once you answer, I'll execute in this order: tokens+logo → countries+languages → i18n dictionary + RTL → postal DB → TTS → sticky continue + scroll perf.