export type CountryCode = "IN" | "BD" | "NP" | "BT" | "KE" | "NG" | "UG" | "NE" | "TD";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  dialPrefix: string;
  mobileLengths: number[]; // allowed digit counts (excluding country prefix)
  mobileRegex: RegExp;
  pincodeLabel: string;
  pincodeRegex?: RegExp;
  pincodePlaceholder?: string;
  emergency: {
    ambulance?: { number: string; label: string };
    health?: { number: string; label: string };
    women?: { number: string; label: string };
    universal?: { number: string; label: string };
  };
  schemesScope: string;
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "IN", name: "India", flag: "🇮🇳", dialPrefix: "+91",
    mobileLengths: [10], mobileRegex: /^[6-9]\d{9}$/,
    pincodeLabel: "PIN code (optional)",
    pincodeRegex: /^\d{6}$/, pincodePlaceholder: "6-digit PIN (e.g. 110001)",
    emergency: {
      ambulance: { number: "108", label: "Ambulance" },
      health: { number: "104", label: "Health helpline" },
      women: { number: "181", label: "Women helpline" },
    },
    schemesScope: "Government of India (central, state and local schemes)",
  },
  {
    code: "BD", name: "Bangladesh", flag: "🇧🇩", dialPrefix: "+880",
    mobileLengths: [10, 11], mobileRegex: /^0?1\d{9}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{4}$/, pincodePlaceholder: "4-digit postal code",
    emergency: {
      universal: { number: "999", label: "Emergency 999" },
      women: { number: "109", label: "Women & Child" },
    },
    schemesScope: "Government of Bangladesh (national & district health/welfare schemes)",
  },
  {
    code: "NP", name: "Nepal", flag: "🇳🇵", dialPrefix: "+977",
    mobileLengths: [10], mobileRegex: /^9\d{9}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{5}$/, pincodePlaceholder: "5-digit postal code",
    emergency: {
      ambulance: { number: "102", label: "Ambulance" },
      universal: { number: "100", label: "Police 100" },
      women: { number: "1145", label: "Women helpline" },
    },
    schemesScope: "Government of Nepal (federal, provincial & municipal health schemes)",
  },
  {
    code: "BT", name: "Bhutan", flag: "🇧🇹", dialPrefix: "+975",
    mobileLengths: [8], mobileRegex: /^[12]\d{7}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{5}$/, pincodePlaceholder: "5-digit postal code",
    emergency: {
      universal: { number: "112", label: "Emergency 112" },
      ambulance: { number: "112", label: "Ambulance" },
    },
    schemesScope: "Royal Government of Bhutan (national health & welfare schemes)",
  },
  {
    code: "KE", name: "Kenya", flag: "🇰🇪", dialPrefix: "+254",
    mobileLengths: [9], mobileRegex: /^[17]\d{8}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{5}$/, pincodePlaceholder: "5-digit postal code",
    emergency: {
      universal: { number: "999", label: "Emergency 999" },
      ambulance: { number: "112", label: "Ambulance 112" },
      women: { number: "1195", label: "GBV helpline" },
    },
    schemesScope: "Government of Kenya (national & county health and welfare programs)",
  },
  {
    code: "NG", name: "Nigeria", flag: "🇳🇬", dialPrefix: "+234",
    mobileLengths: [10], mobileRegex: /^[789]\d{9}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{6}$/, pincodePlaceholder: "6-digit postal code",
    emergency: {
      universal: { number: "112", label: "Emergency 112" },
      ambulance: { number: "112", label: "Ambulance" },
      women: { number: "0803-200-0028", label: "Women helpline" },
    },
    schemesScope: "Government of Nigeria (federal & state health/welfare programs)",
  },
  {
    code: "NE", name: "Niger", flag: "🇳🇪", dialPrefix: "+227",
    mobileLengths: [8], mobileRegex: /^[89]\d{7}$/,
    pincodeLabel: "Postal code (optional)",
    pincodeRegex: /^\d{4}$/, pincodePlaceholder: "4-digit postal code",
    emergency: {
      universal: { number: "15", label: "Emergency 15" },
      ambulance: { number: "15", label: "Ambulance 15" },
    },
    schemesScope: "Government of Niger (national health & welfare programs)",
  },
  {
    code: "TD", name: "Chad", flag: "🇹🇩", dialPrefix: "+235",
    mobileLengths: [8], mobileRegex: /^[679]\d{7}$/,
    pincodeLabel: "Postal code (optional)",
    pincodePlaceholder: "Postal code",
    emergency: {
      universal: { number: "2251-4242", label: "Emergency" },
      ambulance: { number: "2251-4242", label: "Ambulance" },
    },
    schemesScope: "Government of Chad (national health & welfare programs)",
  },
  {
    code: "UG", name: "Uganda", flag: "🇺🇬", dialPrefix: "+256",
    mobileLengths: [9], mobileRegex: /^[7]\d{8}$/,
    pincodeLabel: "Postal code (optional)",
    pincodePlaceholder: "Postal code",
    emergency: {
      universal: { number: "999", label: "Emergency 999" },
      ambulance: { number: "112", label: "Ambulance 112" },
      women: { number: "116", label: "Child helpline" },
    },
    schemesScope: "Government of Uganda (national & district health/welfare programs)",
  },
];

export function getCountry(code: string | null | undefined): CountryInfo {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function maxMobileLength(c: CountryInfo): number {
  return Math.max(...c.mobileLengths);
}
