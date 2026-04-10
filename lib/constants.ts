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
  `Hi Matt, $600M+ raised, valuation approaching $2B, 3rd largest RIA custodian behind Schwab and Fidelity, and Hazel bringing AI directly into the advisor workflow - Altruist is scaling at the pace where the CEO needs a force multiplier who can context-switch between a financial model, a board deck, and a cross-functional execution gap in the same afternoon. I recently applied for the Chief of Staff role and wanted to share why I'm a fit: • Finance + Ops DNA: Software engineering at UBS, prop trading at OSTC, then 5th hire at Borderless Capital ($500M AUM) where I built the full ops backbone from scratch during a 5x growth phase - OKRs, financial modeling, board prep, cross-functional cadences, investor reporting. CFA Level 3 candidate. • AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools - so I engage substantively on AI strategy, not just facilitate the conversation. Happy to share more on how I'd approach the role. GitHub | LinkedIn 15 minutes this or next week? Resume attached.`,
  `Hi Sam, $10M seed from a16z crypto, Paxos/Bridge/MoonPay already committed as issuers, and GENIUS Act compliance as the moat - Better Money is building the clearing layer that makes stablecoins fungible, the same infrastructure jump that turned fragmented 19th-century banknotes into a unified dollar. Timing couldn't be sharper. I'd love to explore how I can contribute. Quick context on fit: • Crypto-Native Ops: 5th hire at Borderless Capital, a crypto-native VC ($500M AUM). Built the full ops backbone from scratch during a 5x growth phase - OKRs, financial modeling, board prep, cross-functional cadences, LP reporting. Partnered directly with the Managing Partners and 25+ portfolio company founders (including stablecoin and DeFi projects) as de facto Chief of Staff. • AI-Native Builder: Currently at Handshake AI building LLM validation pipelines (partnering with OpenAI/Perplexity). Shipped 8+ independent AI tools. I build systems, not just manage them. UC Berkeley Haas MBA, CFA Level 3 candidate, previously software engineering at UBS and prop trading at OSTC. I've operated at the intersection of crypto infrastructure, financial services, and high-growth ops - exactly where Better Money sits. GitHub | LinkedIn 15 minutes this or next week?`,
];
