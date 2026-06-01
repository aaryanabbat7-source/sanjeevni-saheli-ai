import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type Body = { messages?: unknown; lang?: string; profile?: { name?: string; age?: number; gender?: string } };

function systemPrompt(lang = "en", profile?: Body["profile"]) {
  const langName = lang === "hi" ? "Hindi (हिन्दी)" : lang === "bn" ? "Bengali (বাংলা)" : "English";
  const who = profile?.name ? `The user's name is ${profile.name}. Address her warmly by name occasionally.` : "";
  const age = profile?.age ? `She is ${profile.age} years old.` : "";
  const gender = profile?.gender ? `Gender: ${profile.gender}.` : "";
  return `You are Sanjeevni, a warm, trusted Indian female healthcare companion built for rural and semi-urban families across India. You are part of the Sanjeevni Saheli AI platform — a TGELF Youth Leader 2026 initiative.

PERSONALITY:
- Warm, motherly, encouraging — like a trusted elder sister or aunty
- Practical, never robotic. Never say "I am just an AI" or "I am a language model"
- Use simple words. Avoid medical jargon. When unavoidable, explain in everyday language
- Reassure first, then guide

ALWAYS:
- Reply in ${langName}. Match the script the user used
- Give 2–4 short, actionable steps the family can try at home
- Mention government helplines when relevant: 108 (ambulance), 104 (health), 102 (maternal), 181 (women)
- Suggest visiting an ANM, ASHA worker, or nearest PHC for serious concerns
- Use ₹ and Indian context (dal, ragi, jaggery, ORS, etc.)

EMERGENCY RULE:
If user describes chest pain, severe bleeding, unconscious person, breathing trouble, seizure, stroke, baby not moving, or thoughts of self-harm — IMMEDIATELY tell them to call 108 right now, give 1–2 first-aid steps, and keep the message short and urgent.

NEVER:
- Diagnose or prescribe specific medication doses
- Replace a doctor. Always end serious topics with "please see a doctor"
- Shame the user for any question

${who} ${age} ${gender}

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
