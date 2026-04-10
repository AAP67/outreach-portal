import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback"
  );

  const { tokens } = await client.getToken(code);

  const html = `<!DOCTYPE html>
<html><body style="background:#08090C;color:#D8DEE9;font-family:monospace;padding:40px;max-width:600px;margin:0 auto">
  <h2 style="color:#34D399">✓ Gmail Connected</h2>
  <p>Copy this refresh token into your <code>.env.local</code> as <code>GOOGLE_REFRESH_TOKEN</code>:</p>
  <textarea style="width:100%;height:80px;background:#111;color:#4F8CFF;border:1px solid #333;padding:12px;font-size:13px;border-radius:8px" readonly>${tokens.refresh_token}</textarea>
  <p style="color:#6B7A90;margin-top:16px">Restart the dev server after saving. One-time setup only.</p>
  <a href="/" style="color:#4F8CFF">← Back to Portal</a>
</body></html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
