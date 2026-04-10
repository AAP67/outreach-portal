import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT_SELECTOR, USER_BACKGROUND } from "@/lib/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { examples, companyName, founderName, jd } = await req.json();

    const prompt = `EXAMPLES:\n${examples
      .filter((e: string) => e.trim())
      .map((e: string, i: number) => `--- Example ${i + 1} ---\n${e}`)
      .join("\n\n")}\n\nJOB DESCRIPTION:\nCompany: ${companyName}\nFounder/Hiring Manager: ${founderName}\n${jd}\n\nUSER BACKGROUND:\n${USER_BACKGROUND}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT_SELECTOR,
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
