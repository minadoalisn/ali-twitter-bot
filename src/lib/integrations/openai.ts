import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export function getImageModel() {
  return process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
}
