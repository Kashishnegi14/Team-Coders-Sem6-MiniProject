import {
  chatbotImageMap,
  findRelevantImages,
} from "../constants/chatbotAssets";

type ChatbotReply = {
  text: string;
  images: string[];
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function buildSystemPrompt(userMessage: string) {
  return `
You are an AI Campus Assistant for a sustainability project called GreenAudit.

Your job:
- answer campus sustainability questions clearly
- focus on solar panels, water systems, waste, recycling, leaks, drainage, and renewable energy
- keep replies concise, practical, and demo-friendly
- if the user asks about campus sources or infrastructure, answer as if explaining available campus sustainability resources
- avoid making extreme claims or fabricated numbers
- if unsure, say "Based on the available campus assets and sustainability setup..."

User question:
${userMessage}
`;
}

export async function getCampusAssistantReply(
  userMessage: string,
): Promise<ChatbotReply> {
  const localImages = findRelevantImages(userMessage);

  if (!GEMINI_API_KEY) {
    return {
      text: `Based on the available campus assets and sustainability setup, here is a quick answer:\n\n${fallbackLocalAnswer(
        userMessage,
      )}`,
      images: localImages,
    };
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildSystemPrompt(userMessage) }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      fallbackLocalAnswer(userMessage);

    return {
      text,
      images: localImages,
    };
  } catch (error) {
    return {
      text: fallbackLocalAnswer(userMessage),
      images: localImages,
    };
  }
}

function fallbackLocalAnswer(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes("solar") ||
    lower.includes("renewable") ||
    lower.includes("energy source")
  ) {
    return "The campus uses solar panel infrastructure as one of its visible renewable energy sources. Relevant rooftop solar images have been attached for reference.";
  }

  if (
    lower.includes("waste") ||
    lower.includes("trash") ||
    lower.includes("garbage") ||
    lower.includes("recycling")
  ) {
    return "The campus waste system includes bins, disposal areas, and waste-handling points. Relevant waste-related images have been attached.";
  }

  if (
    lower.includes("water") ||
    lower.includes("leak") ||
    lower.includes("pipeline") ||
    lower.includes("drainage") ||
    lower.includes("tank")
  ) {
    return "The campus water system includes water-related infrastructure such as pipes, tanks, drainage paths, and possible leak-prone points. Relevant images have been attached.";
  }

  return "Based on the available campus assets and sustainability setup, the campus assistant can help with questions about solar infrastructure, water systems, waste management, and related environmental resources.";
}
