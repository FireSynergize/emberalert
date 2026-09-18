import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AIProvider } from "@/types/fire";

export function getAIProvider(provider: AIProvider) {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      return openai("gpt-4o");
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      return anthropic("claude-sonnet-4-6");
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
      return google("gemini-2.0-flash");
    }
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

export const AI_PROVIDER_INFO: Record<
  AIProvider,
  { name: string; model: string; description: string; color: string }
> = {
  openai: {
    name: "OpenAI",
    model: "GPT-4o",
    description: "Advanced reasoning and multimodal capabilities",
    color: "#10a37f",
  },
  anthropic: {
    name: "Anthropic",
    model: "Claude Sonnet 4.6",
    description: "Safety-focused with strong analysis skills",
    color: "#d97706",
  },
  google: {
    name: "Google",
    model: "Gemini 2.0 Flash",
    description: "Fast responses with up-to-date knowledge",
    color: "#4285f4",
  },
};
