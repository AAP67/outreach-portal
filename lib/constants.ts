export const LINKS = {
  github: "https://github.com/AAP67",
  linkedin: "https://www.linkedin.com/in/krajpal/",
};

export const HTML_SIGNATURE = `<br><br>—<br>
<a href="${LINKS.linkedin}" style="color:#4F8CFF;text-decoration:none">LinkedIn</a> · 
<a href="${LINKS.github}" style="color:#4F8CFF;text-decoration:none">GitHub</a>`;

export const USER_BACKGROUND = `MBA from UC Berkeley Haas (2025). 5th hire at Borderless Capital, scaled from $100M to $500M AUM as de facto Chief of Staff to 25+ portfolio CEOs. Experience at KAUST Investment Management Company driving $100M allocation increase. CFA Level 3 candidate. STEM OPT visa valid through mid-2028. Dual STEM degrees (EE + Bio) from BITS Pilani. 740 GMAT. Built 8+ AI tools independently including Francium (personal AI platform), Morning Brief (multi-model LLM pipeline). Current contract LLM validation work at Handshake AI (OpenAI/Perplexity). Prior: software engineering at UBS, proprietary futures trading at OSTC. Strong in Python, React, TypeScript, financial modeling, operations.`;

export const SYSTEM_PROMPT_SELECTOR = `You are an expert cold outreach strategist. You will be given:
1. A set of example outreach emails written by the user
2. A job description (JD)
3. The user's background summary

Your task:
- Pick the example email whose tone, structure, and angle best fits the JD
- Explain WHY you picked it (1 sentence)
- Generate a new outreach email modeled after that example, tailored to the JD
- The email MUST only reference facts from the user's background or the JD. Do NOT invent achievements, metrics, or experiences.
- Do NOT include any links or URLs in the email body. Links are in the signature.
- Do NOT include vague phrases like "find more context here"
- Keep it concise (under 200 words), confident, and human-sounding
- Do NOT include a signature — that is appended separately
- Include a subject line

Respond ONLY in JSON (no markdown, no backticks):
{
  "selected_example_index": 0,
  "selection_reason": "...",
  "subject": "...",
  "body": "..."
}`;

export const SYSTEM_PROMPT_EVALUATOR = `You are a hallucination detector for cold outreach emails. You will be given:
1. The generated email
2. The user's background summary
3. The job description

Check every factual claim in the email against the background and JD. Flag anything that:
- References achievements, metrics, or roles NOT in the background
- Misrepresents the JD requirements
- Invents company names, project names, or statistics

Respond ONLY in JSON (no markdown, no backticks):
{
  "passed": true/false,
  "issues": ["issue1", "issue2"],
  "corrected_body": "...(only if passed is false, otherwise null)"
}`;

export const DEFAULT_EXAMPLES = [
  // 1. VC CoS — investor/fund ops heavy
  `Hi Ian,

$4B+ under management, 400+ founders backed from pre-seed through scale, and a portfolio thesis shifting hard into the AI frontier with bets on OpenAI, Hippocratic AI, and TogetherAI - the coordination complexity across network, portfolio, and LPs at this stage demands a CoS who's already operated inside a scaling investment firm, not just a startup.

I recently applied for the Chief of Staff role and wanted to share why I'm a fit:

• VC Ops DNA: 5th hire at Borderless Capital ($500M AUM), de facto Chief of Staff to the Managing Partners through a 5x growth phase. Built the full ops backbone from scratch - LP reporting, board prep, cross-functional cadences, financial modeling, and network coordination across 25+ portfolio company founders.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools. I use AI to build systems and automations daily - not just as a productivity layer.

UC Berkeley Haas MBA, CFA Level 3 candidate, STEM undergrad. Happy to share how I'd approach multiplying your capacity across network intelligence, LP prep, and portfolio ops.

15 minutes this or next week? Resume attached.`,

  // 2. CEO CoS — finance + ops DNA
  `Hi Matt,

$600M+ raised, valuation approaching $2B, 3rd largest RIA custodian behind Schwab and Fidelity, and Hazel bringing AI directly into the advisor workflow - Altruist is scaling at the pace where the CEO needs a force multiplier who can context-switch between a financial model, a board deck, and a cross-functional execution gap in the same afternoon.

I recently applied for the Chief of Staff role and wanted to share why I'm a fit:

• Finance + Ops DNA: Software engineering at UBS, prop trading at OSTC, then 5th hire at Borderless Capital ($500M AUM) where I built the full ops backbone from scratch during a 5x growth phase - OKRs, financial modeling, board prep, cross-functional cadences, investor reporting. CFA Level 3 candidate.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools - so I engage substantively on AI strategy, not just facilitate the conversation.

Happy to share more on how I'd approach the role.

15 minutes this or next week? Resume attached.`,

  // 3. BizOps — enterprise/AI governance
  `Hi Brian,

$4.8B KKR acquisition, a $1B revenue target by 2028, an OpenAI partnership embedding AI directly into Canvas, and Parchment scaling the credentialing layer - Instructure is in the phase where BizOps needs to connect strategy to execution across pricing, AI investment governance, and go-to-market at enterprise scale.

I recently applied for the Senior Business Operations Manager role and wanted to share why I'm a fit:

• Finance + Ops DNA: Software engineering at UBS, prop trading at OSTC, then 5th hire at Borderless Capital ($500M AUM) where I built the full ops backbone from scratch during a 5x growth phase - OKRs, financial modeling, board prep, cross-functional cadences, investor reporting. CFA Level 3 candidate.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools - so I can engage substantively on AI investment governance, not just facilitate the conversation.

Happy to share more on how I'd approach scaling BizOps at Instructure.

15 minutes this or next week? Resume attached.`,

  // 4. Business Generalist — flexible role framing
  `Hi Marco,

$560M raised in under four years, valuation tripled to $3B in eight months, $50M+ ARR with 150% net revenue retention, and a Fortune 200 customer base from Booking.com to Allianz - Parloa is scaling at the pace where you need generalists who can own ambiguous, cross-functional problems end-to-end without a playbook.

I recently applied for the Business Generalist role and wanted to share why I'm a fit:

• Early-stage Ops + Finance: Software engineering at UBS, prop trading at OSTC, then 5th hire at Borderless Capital ($500M AUM) where I built the full ops backbone from scratch during a 5x growth phase - OKRs, financial modeling, board prep, cross-functional cadences, investor reporting. CFA Level 3 candidate.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools - I don't just strategize around AI, I build with it.

Whether this maps to CoS, BizOps, or Strategic Finance, I've operated across all three and can plug in wherever the highest-leverage gap is.

15 minutes this or next week? Resume attached.`,

  // 5. Crypto-native — COO CoS
  `Hi Shan,

USDC scaling as a payments rail, stock trading live, Base growing as the onchain platform - Coinbase is running three company-defining bets simultaneously. The COO's Chief of Staff needs to be someone who understands the crypto ecosystem natively, not someone who'll need six months to get up to speed.

I wanted to reach out and share why I'm a fit:

• Early-stage Ops + Crypto Native: As the 5th hire at Borderless Capital ($500M AUM), I built the entire ops backbone from scratch during a 5x growth phase - OKRs, cross-functional cadences, vendor stacks, GTM processes. Partnered directly with the CEO and 25+ portfolio company founders as de facto Chief of Staff. This is a crypto-native fund - I've lived in the ecosystem, not just studied it.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). I've shipped 8+ independent AI tools, including a Personal AI Platform - relevant as Coinbase invests heavily in automation across all three priorities.

I don't just manage projects - I build the systems that scale without me.

15 minutes this or next week? Resume attached.`,

  // 6. BizOps — consumer/health/hardware
  `Hi Matteo,

Fresh $50M at a $1.5B valuation, Pod 5, a predictive AI agent, FDA filings for sleep apnea - Eight Sleep is crossing from consumer wellness into a regulated health platform. That kind of multi-surface complexity needs a generalist operator who's built the playbook before. That's been my entire career.

I recently applied for Business Operations Manager role and wanted to share why I'm a fit:

• Early-stage Ops: As the 5th hire at Borderless Capital ($500M AUM), I built the entire ops backbone from scratch during a 5x growth phase - OKRs, cross-functional cadences, vendor stacks, GTM processes. Took ambiguous 0-to-1 problems and shipped with minimal oversight.

• AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI, Perplexity). I've shipped 8+ independent AI tools, including a Personal AI Platform.

I don't just manage projects - I build the systems that make them unnecessary.

15 minutes this or next week? Resume attached.`,
];