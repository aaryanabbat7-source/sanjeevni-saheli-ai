import type { TopicKey } from "./i18n";
export type { TopicKey };

export interface Topic {
  key: TopicKey;
  icon: string;
  gradient: string;
  color: string;
}

export const TOPICS: Topic[] = [
  { key: "menstrual", icon: "🌸", gradient: "bg-gradient-menstrual", color: "menstrual" },
  { key: "nutrition", icon: "🥗", gradient: "bg-gradient-nutrition", color: "nutrition" },
  { key: "pregnancy", icon: "🤱", gradient: "bg-gradient-pregnancy", color: "pregnancy" },
  { key: "vaccine", icon: "💉", gradient: "bg-gradient-vaccine", color: "vaccine" },
  { key: "emergency", icon: "🚨", gradient: "bg-gradient-emergency", color: "emergency" },
  { key: "schemes", icon: "🏛️", gradient: "bg-gradient-schemes", color: "schemes" },
];

export const EMERGENCY_KEYWORDS = [
  "chest pain", "severe bleeding", "unconscious", "cannot breathe", "can't breathe",
  "seizure", "stroke", "heart attack", "baby not moving", "suicide", "kill myself",
  "सीने में दर्द", "बेहोश", "साँस नहीं", "दौरा",
  "বুকে ব্যথা", "অজ্ঞান", "শ্বাস",
];

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}
