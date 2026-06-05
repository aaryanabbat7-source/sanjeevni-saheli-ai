export type CountryCode = "IN" | "BD" | "NP" | "BT" | "KE" | "NG" | "UG";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  dialPrefix: string;
  mobileRegex: RegExp;
  mobileLength: number;
  pincodeLabel: string;
  emergency: {
    ambulance?: { number: string; label: string };
    health?: { number: string; label: string };
    women?: { number: string; label: string };
    universal?: { number: string; label: string };
  };
  schemesScope: string; // free-text passed to the AI to scope answers
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "IN", name: "India", flag: "🇮🇳", dialPrefix: "+91",
    mobileRegex: /^[6-9]\d{9}$/, mobileLength: 10,
    pincodeLabel: "PIN code (optional)",
    emergency: {
      ambulance: { number: "108", label: "Ambulance" },
      health: { number: "104", label: "Health helpline" },
      women: { number: "181", label: "Women helpline" },
    },
    schemesScope: "Government of India (central, state and local schemes)",
  },
  {
    code: "BD", name: "Bangladesh", flag: "🇧🇩", dialPrefix: "+880",
    mobileRegex: /^[1]\d{9}$/, mobileLength: 10,
    pincodeLabel: "Postal code (optional)",
    emergency: {
      universal: { number: "999", label: "Emergency 999" },
      women: { number: "109", label: "Women & Child" },
    },
    schemesScope: "Government of Bangladesh (national & district health/welfare schemes)",
  },
  {
    code: "NP", name: "Nepal", flag: "🇳🇵", dialPrefix: "+977",
    mobileRegex: /^9\d{9}$/, mobileLength: 10,
    pincodeLabel: "Postal code (optional)",
    emergency: {
      ambulance: { number: "102", label: "Ambulance" },
      universal: { number: "100", label: "Police 100" },
      women: { number: "1145", label: "Women helpline" },
    },
    schemesScope: "Government of Nepal (federal, provincial & municipal health schemes)",
  },
  {
    code: "BT", name: "Bhutan", flag: "🇧🇹", dialPrefix: "+975",
    mobileRegex: /^[12]\d{7}$/, mobileLength: 8,
    pincodeLabel: "Postal code (optional)",
    emergency: {
      universal: { number: "112", label: "Emergency 112" },
      ambulance: { number: "112", label: "Ambulance" },
    },
    schemesScope: "Royal Government of Bhutan (national health & welfare schemes)",
  },
  {
    code: "KE", name: "Kenya", flag: "🇰🇪", dialPrefix: "+254",
    mobileRegex: /^[17]\d{8}$/, mobileLength: 9,
    pincodeLabel: "Postal code (optional)",
    emergency: {
      universal: { number: "999", label: "Emergency 999" },
      ambulance: { number: "112", label: "Ambulance 112" },
      women: { number: "1195", label: "GBV helpline" },
    },
    schemesScope: "Government of Kenya (national & county health and welfare programs)",
  },
  {
    code: "NG", name: "Nigeria", flag: "🇳🇬", dialPrefix: "+234",
    mobileRegex: /^[789]\d{9}$/, mobileLength: 10,
    pincodeLabel: "Postal code (optional)",
    emergency: {
      universal: { number: "112", label: "Emergency 112" },
      ambulance: { number: "112", label: "Ambulance" },
      women: { number: "0803-200-0028", label: "Women helpline" },
    },
    schemesScope: "Government of Nigeria (federal & state health/welfare programs)",
  },
  {
    code: "UG", name: "Uganda", flag: "🇺🇬", dialPrefix: "+256",
    mobileRegex: /^[7]\d{8}$/, mobileLength: 9,
    pincodeLabel: "Postal code (optional)",
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
