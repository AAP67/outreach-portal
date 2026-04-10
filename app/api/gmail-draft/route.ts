import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { HTML_SIGNATURE } from "@/lib/constants";

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback"
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

function buildRawEmail(to: string, subject: string, htmlBody: string): string {
  const boundary = "boundary_" + Date.now();
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    htmlBody,
    `--${boundary}--`,
  ].join("\r\n");

  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const { recipients, subject, body } = await req.json();

    const emails: string[] = recipients
      .split(/[,;\n]+/)
      .map((e: string) => e.trim())
      .filter(Boolean);

    if (!emails.length) {
      return NextResponse.json({ error: "No recipients" }, { status: 400 });
    }

    const htmlBody = body.replace(/\n/g, "<br>") + HTML_SIGNATURE;

    const auth = getOAuth2Client();
    const gmail = google.gmail({ version: "v1", auth });

    const results = [];
    for (const to of emails) {
      const raw = buildRawEmail(to, subject, htmlBody);
      const draft = await gmail.users.drafts.create({
        userId: "me",
        requestBody: { message: { raw } },
      });
      results.push({ to, draftId: draft.data.id });
    }

    return NextResponse.json({ drafts: results, count: results.length });
  } catch (error: any) {
    console.error("Gmail draft error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
