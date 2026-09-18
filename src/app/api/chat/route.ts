import { streamText } from "ai";
import { getAIProvider } from "@/lib/ai/providers";
import { WILDFIRE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { AIProvider } from "@/types/fire";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, provider = "anthropic" } = await req.json();

  try {
    const model = getAIProvider(provider as AIProvider);
    const result = streamText({
      model,
      system: WILDFIRE_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 1024,
    });
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "AI provider unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
