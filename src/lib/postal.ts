import { getCountry } from "./countries";

export interface PostalResult {
  ok: boolean;
  city?: string;
  state?: string;
  error?: string;
}

const cache = new Map<string, PostalResult>();

/**
 * Validates a postal code for the selected country and, when possible,
 * resolves the city/state it belongs to.
 * Uses zippopotam.us (free, CORS-enabled). When the country is not covered,
 * we fall back to the local format check only.
 */
export async function lookupPostal(countryCode: string, pin: string): Promise<PostalResult> {
  const country = getCountry(countryCode);
  const code = pin.trim();
  if (!code) return { ok: true };

  if (country.pincodeRegex && !country.pincodeRegex.test(code)) {
    return { ok: false, error: `That doesn't look like a valid ${country.name} ${country.pincodeLabel.replace(" (optional)", "").toLowerCase()}.` };
  }

  const key = `${countryCode}:${code}`;
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const res = await fetch(`https://api.zippopotam.us/${countryCode.toLowerCase()}/${encodeURIComponent(code)}`);
    if (res.status === 404) {
      // Country covered by the service but code unknown → genuinely invalid
      const covered = ["IN", "IN"].includes(countryCode);
      const out: PostalResult = covered
        ? { ok: false, error: `No place found for ${code} in ${country.name}. Please check it.` }
        : { ok: true };
      cache.set(key, out);
      return out;
    }
    if (!res.ok) return { ok: true };
    const data = (await res.json()) as { places?: { "place name"?: string; state?: string }[] };
    const place = data.places?.[0];
    const out: PostalResult = { ok: true, city: place?.["place name"], state: place?.state };
    cache.set(key, out);
    return out;
  } catch {
    return { ok: true };
  }
}
