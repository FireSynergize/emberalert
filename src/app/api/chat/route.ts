import { streamText } from "ai";
import { getAIModel } from "@/lib/ai/providers";
import { WILDFIRE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: getAIModel(),
      system: WILDFIRE_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 1024,
    });
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "AI unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
