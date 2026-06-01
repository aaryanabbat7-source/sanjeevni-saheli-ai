import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

type Body = { text?: string; targetLang?: string; targetName?: string };

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { text, targetLang, targetName } = (await request.json()) as Body;
        if (!text || !targetLang) return new Response("text and targetLang required", { status: 400 });

        // Same language → return as-is
        if (targetLang === "en") {
          return Response.json({ translated: text });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const langName = targetName ?? targetLang;

        const { text: translated } = await generateText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are a professional healthcare translator for an Indian women's health platform (Sanjeevni Saheli). Translate the user's English message into ${langName} using the native script. Preserve a warm, motherly, professional, and reassuring healthcare tone. Keep emojis, numbers, helpline codes (108, 104, 102, 181), ₹ amounts, and proper nouns unchanged. Do NOT add commentary, do NOT prefix with "Translation:". Output ONLY the translated text.`,
          prompt: text,
        });

        return Response.json({ translated: translated.trim() });
      },
    },
  },
});
