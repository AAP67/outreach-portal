import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT_EVALUATOR, USER_BACKGROUND } from "@/lib/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { subject, body, jd } = await req.json();

    const prompt = `EMAIL:\nSubject: ${subject}\n${body}\n\nUSER BACKGROUND:\n${USER_BACKGROUND}\n\nJOB DESCRIPTION:\n${jd}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT_EVALUATOR,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const result = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
