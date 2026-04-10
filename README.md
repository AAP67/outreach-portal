# Outreach Portal

Cold outreach pipeline: generate emails from examples + JD, auto-check for hallucinations, batch-create Gmail drafts.

## Architecture

```
Next.js 14 (App Router)
├── /app/page.tsx            → Portal UI (client component)
├── /app/api/generate        → Claude API: picks best example, generates email
├── /app/api/evaluate        → Claude API: hallucination detection
├── /app/api/gmail-draft     → Google Gmail API: creates one draft per recipient
├── /app/api/auth/init       → OAuth: redirects to Google consent
├── /app/api/auth/callback   → OAuth: receives code, shows refresh token
└── /lib/constants.ts        → Background, prompts, example emails
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/AAP67/outreach-portal.git
cd outreach-portal
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `GOOGLE_CLIENT_ID` | Google Cloud Console (see below) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console (see below) |
| `GOOGLE_REFRESH_TOKEN` | Generated via OAuth flow (Step 4) |

### 3. Google Cloud Setup (one-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. **APIs & Services → Library** → Enable **Gmail API**
4. **APIs & Services → Credentials** → Create **OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback`
5. Copy Client ID and Client Secret into `.env.local`

### 4. Get Gmail Refresh Token (one-time)

```bash
npm run dev
```

Visit `http://localhost:3000/api/auth/init` → Sign in with your Gmail → Copy the refresh token → Paste into `.env.local` as `GOOGLE_REFRESH_TOKEN` → Restart dev server.

### 5. Run

```bash
npm run dev
```

Open `http://localhost:3000`

## Codespaces

Click **Code → Codespaces → New codespace** on this repo. The `.devcontainer` config auto-installs dependencies. Add your `.env.local` secrets via Codespaces Settings → Secrets.

For the Gmail OAuth redirect in Codespaces, update `GOOGLE_REDIRECT_URI` to your Codespace URL:
```
https://YOUR-CODESPACE-3000.app.github.dev/api/auth/callback
```
And add this URL to your Google Cloud OAuth redirect URIs.

## Deploying to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all env vars in Vercel project settings
4. Update `GOOGLE_REDIRECT_URI` to `https://your-domain.vercel.app/api/auth/callback`
5. Add that URL to Google Cloud OAuth redirect URIs
6. Visit `https://your-domain.vercel.app/api/auth/init` to get a new refresh token for production

## Usage

1. **Examples tab** — your template emails are pre-loaded. Edit or add more.
2. **JD + Generate** — enter company, founder, paste JD → generates email matching your best template
3. **Review** — auto hallucination check. Edit freely. Must pass before proceeding.
4. **Send** — paste recipient emails → creates one Gmail draft per person. Open Gmail, review, hit send.

## Customization

Edit `lib/constants.ts` to update:
- `USER_BACKGROUND` — your resume summary
- `LINKS` — signature links
- `HTML_SIGNATURE` — what gets appended to every email
- `DEFAULT_EXAMPLES` — starter templates
