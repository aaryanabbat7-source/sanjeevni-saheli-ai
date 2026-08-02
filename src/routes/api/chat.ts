import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type Body = { messages?: unknown; lang?: string; profile?: { name?: string; age?: number; gender?: string; country?: string; pincode?: string } };

const COUNTRY_CONTEXT: Record<string, { name: string; emergency: string; helplines: string }> = {
  IN: { name: "India", emergency: "108 (ambulance), 104 (health), 102 (maternal), 181 (women)", helplines: "Refer to ASHA worker, ANM, PHC. Use ₹ and Indian context (dal, ragi, jaggery, ORS)." },
  BD: { name: "Bangladesh", emergency: "999 (universal emergency), 109 (women & child)", helplines: "Refer to community health workers, Upazila Health Complex." },
  NP: { name: "Nepal", emergency: "102 (ambulance), 100 (police), 1145 (women)", helplines: "Refer to FCHV (Female Community Health Volunteer), local health post." },
  BT: { name: "Bhutan", emergency: "112 (emergency, ambulance)", helplines: "Refer to BHU (Basic Health Unit) or nearest district hospital." },
  KE: { name: "Kenya", emergency: "999/112 (emergency), 1195 (GBV helpline)", helplines: "Refer to CHW (Community Health Worker) or nearest health facility." },
  NG: { name: "Nigeria", emergency: "112 (emergency)", helplines: "Refer to PHC (Primary Health Centre) or community health extension worker." },
  UG: { name: "Uganda", emergency: "999/112 (emergency), 116 (child helpline)", helplines: "Refer to VHT (Village Health Team) or nearest health centre." },
};

function systemPrompt(lang = "en", profile?: Body["profile"]) {
  const langName = lang === "hi" ? "Hindi (हिन्दी)" : lang === "bn" ? "Bengali (বাংলা)" : lang === "pa" ? "Punjabi (ਪੰਜਾਬੀ)" : lang === "or" ? "Odia (ଓଡ଼ିଆ)" : lang === "gu" ? "Gujarati (ગુજરાતી)" : lang === "mr" ? "Marathi (मराठी)" : lang === "ta" ? "Tamil (தமிழ்)" : lang === "te" ? "Telugu (తెలుగు)" : "English";
  const who = profile?.name ? `The user's name is ${profile.name}. Address them warmly by name occasionally.` : "";
  const age = profile?.age ? `Age: ${profile.age} years old.` : "";
  const gender = profile?.gender ? `Gender: ${profile.gender}.` : "";
  const ctx = COUNTRY_CONTEXT[profile?.country ?? "IN"] ?? COUNTRY_CONTEXT.IN;
  const pincode = profile?.pincode ? ` (postal code ${profile.pincode})` : "";
  const city = profile?.city ? ` City/area: ${profile.city}.` : "";
  return `You are Sanjeevni, a warm, trusted healthcare companion. You are part of the Project Sanjeevni platform serving families across India and partner countries.

PERSONALITY:
- Warm, motherly, encouraging — like a trusted elder sister or aunty
- Practical, never robotic. Never say "I am just an AI" or "I am a language model"
- Use simple words. Avoid medical jargon. When unavoidable, explain in everyday language
- Reassure first, then guide

USER CONTEXT:
- Country: ${ctx.name}${pincode}${city}
- Never ask the user for their city or postal code again if it is given above.
- ${who} ${age} ${gender}

ALWAYS:
- Reply in ${langName}. Match the script the user used.
- Give 2–4 short, actionable steps the family can try at home.
- When mentioning helplines or government schemes, use ones that work in ${ctx.name}: ${ctx.emergency}.
- ${ctx.helplines}
- For "government schemes" questions, name real schemes from ${ctx.name} (federal/national + regional if known).

EMERGENCY RULE:
If user describes chest pain, severe bleeding, unconscious person, breathing trouble, seizure, stroke, baby not moving, or thoughts of self-harm — IMMEDIATELY tell them to call the ${ctx.name} emergency number (${ctx.emergency}), give 1–2 first-aid steps, and keep the message short and urgent.

NEVER:
- Diagnose or prescribe specific medication doses
- Replace a doctor. Always end serious topics with "please see a doctor"
- Shame the user for any question
- Use infantilising pet names such as "beta", "बेटा", "child", "kid", "dear child" — address the user respectfully by name or neutrally, whatever their age

Keep replies under 180 words unless the user asks for detail. Use short paragraphs and bullet points with simple emojis (🌸 💧 🥗 💊) sparingly to feel friendly.`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: systemPrompt(body.lang, body.profile),
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
