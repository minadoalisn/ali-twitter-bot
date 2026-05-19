import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getImageModel, getOpenAI } from "@/lib/integrations/openai";
import { getSeries } from "@/lib/noirven-data";
import { generateDesignSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await requireAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const payload = generateDesignSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid design generation payload", issues: payload.error.flatten() }, { status: 400 });
  }

  const series = getSeries(payload.data.seriesId);
  if (!series) {
    return NextResponse.json({ error: "Story series not found" }, { status: 404 });
  }

  const prompt = [
    "Create an original Noirven jewelry concept with minimalist light-luxury identity.",
    `Story series: ${series.name}. Emotional line: ${series.emotionalLine}.`,
    `Category: ${payload.data.category}. Inspiration: ${payload.data.inspiration}.`,
    `Materials: ${payload.data.materials.join(", ")}.`,
    "Use asymmetric curve, negative space, subtle abstract facet language, hidden N mark or N-0001 serial engraving.",
    "Avoid copying any existing luxury brand, iconic jewelry silhouette, logo, motif, or trade dress.",
  ].join(" ");

  try {
    const client = getOpenAI();
    const result = await client.images.generate({
      model: getImageModel(),
      prompt,
      n: 4,
      size: "1024x1024",
    });

    return NextResponse.json({ prompt, images: result.data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "OpenAI image generation is not configured for this environment",
        prompt,
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
