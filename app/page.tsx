"use client";

import { useState, useEffect } from "react";
import { DEFAULT_EXAMPLES } from "@/lib/constants";

const STEPS = ["Examples", "JD + Generate", "Review", "Send"];
const STEP_ICONS = ["📝", "🎯", "🔍", "📤"];
const STORAGE_KEY = "outreach_examples";
const HISTORY_KEY = "outreach_history";

interface Generated {
  selected_example_index: number;
  selection_reason: string;
  subject: string;
  body: string;
}

interface Evaluation {
  passed: boolean;
  issues: string[];
  corrected_body: string | null;
}

interface HistoryEntry {
  date: string;
  company: string;
  founder: string;
  subject: string;
  recipients: string[];
}

export default function Portal() {
  const [step, setStep] = useState(0);
  const [examples, setExamples] = useState<string[]>([""]);
  const [jd, setJd] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed?.length && parsed.some((e: string) => e.trim())) {
      setExamples(parsed);
}     else {
      setExamples(DEFAULT_EXAMPLES);
}
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist));
    } catch {}
  }, []);

  // Persist examples
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(examples)); } catch {}
  }, [examples]);

  const addExample = () => setExamples((e) => [...e, ""]);
  const removeExample = (i: number) => setExamples((e) => e.filter((_, idx) => idx !== i));
  const updateExample = (i: number, v: string) =>
    setExamples((e) => e.map((x, idx) => (idx === i ? v : x)));

  const generate = async () => {
    setLoading(true);
    setGenerated(null);
    setEvaluation(null);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examples, companyName, founderName, jd }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGenerated(data);
      setStep(2);

      // Auto-evaluate
      setEvalLoading(true);
      const evalRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: data.subject, body: data.body, jd }),
      });
      const evalData = await evalRes.json();
      if (evalData.error) throw new Error(evalData.error);
      setEvaluation(evalData);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
    setEvalLoading(false);
  };

  const regenWithFix = async () => {
    if (!evaluation?.corrected_body || !generated) return;
    setGenerated((g) => g ? { ...g, body: evaluation.corrected_body! } : g);
    setEvalLoading(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: generated.subject,
          body: evaluation.corrected_body,
          jd,
        }),
      });
      const data = await res.json();
      setEvaluation(data);
    } catch (e: any) {
      setError(e.message);
    }
    setEvalLoading(false);
  };

  const handleCreateDrafts = async () => {
    if (!generated) return;
    setSendStatus("creating");
    setError(null);
    try {
      const res = await fetch("/api/gmail-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: generated.subject,
          body: generated.body,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendStatus("created");

      const emails = recipients.split(/[,;\n]+/).map((e) => e.trim()).filter(Boolean);
      const entry: HistoryEntry = {
        date: new Date().toISOString(),
        company: companyName,
        founder: founderName,
        subject: generated.subject,
        recipients: emails,
      };
      const newHist = [entry, ...history].slice(0, 50);
      setHistory(newHist);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
    } catch (e: any) {
      setError(e.message);
      setSendStatus("error");
    }
  };

  const resetForNew = () => {
    setStep(1);
    setJd("");
    setCompanyName("");
    setFounderName("");
    setGenerated(null);
    setEvaluation(null);
    setRecipients("");
    setSendStatus(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 28px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: "8px",
              background: "linear-gradient(135deg, var(--accent), var(--purple))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Outreach Portal
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
              Generate · Evaluate · Draft
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: "12px", padding: "6px 14px" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            📋 History{history.length ? ` (${history.length})` : ""}
          </button>
          {generated && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: "12px", padding: "6px 14px", color: "var(--accent)" }}
              onClick={resetForNew}
            >
              + New
            </button>
          )}
          <a
            href="/api/auth/init"
            className="btn btn-ghost"
            style={{ fontSize: "12px", padding: "6px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            🔗 Connect Gmail
          </a>
        </div>
      </div>

      {/* History drawer */}
      {showHistory && (
        <div
          style={{
            padding: "16px 28px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-alt)",
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          <span className="label">Send History</span>
          {history.length === 0 ? (
            <div style={{ fontSize: "13px", color: "var(--text-dim)" }}>No drafts created yet.</div>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "var(--radius)",
                  background: "var(--surface)",
                  marginBottom: 6,
                  fontSize: "12px",
                }}
              >
                <div>
                  <b style={{ color: "var(--accent)" }}>{h.company}</b> — {h.subject}
                  <span style={{ color: "var(--text-dim)", marginLeft: 8 }}>
                    → {h.recipients.join(", ")}
                  </span>
                </div>
                <div style={{ color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                  {new Date(h.date).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Step nav */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "14px 28px",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
        }}
      >
        {STEPS.map((st, i) => (
          <button
            key={st}
            className={`pill ${step === i ? "active" : ""}`}
            onClick={() => {
              if (i >= 2 && !generated) return;
              setStep(i);
            }}
          >
            <span style={{ marginRight: 6 }}>{STEP_ICONS[i]}</span>
            {st}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            margin: "16px 28px 0",
            padding: "12px 16px",
            borderRadius: "var(--radius)",
            background: "var(--red-soft)",
            color: "var(--red)",
            fontSize: "13px",
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              color: "var(--red)",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "22px 28px", maxWidth: 720 }}>
        {/* STEP 0: Examples */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: 4 }}>
              Your Example Emails
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: 18 }}>
              These persist in your browser. The AI picks the best fit for each JD.
            </div>
            {examples.map((ex, i) => (
              <div className="card" key={i} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span className="label" style={{ margin: 0 }}>
                    Example {i + 1}
                  </span>
                  {examples.length > 1 && (
                    <button
                      onClick={() => removeExample(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--red)",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  value={ex}
                  onChange={(e) => updateExample(i, e.target.value)}
                  placeholder="Paste an outreach email..."
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={addExample}>
                + Add
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(1)}
                disabled={examples.every((e) => !e.trim())}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: JD + Generate */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: 14 }}>
              Target Details
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <span className="label">Company</span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme AI"
                />
              </div>
              <div style={{ flex: 1 }}>
                <span className="label">Founder / HM</span>
                <input
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
            </div>
            <span className="label">Job Description</span>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full JD..."
              style={{ minHeight: 200 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={generate}
                disabled={!jd.trim() || loading}
              >
                {loading ? "⏳ Generating..." : "Generate ⚡"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review */}
        {step === 2 && generated && (
          <div>
            {/* Template match */}
            <div
              className="card"
              style={{
                marginBottom: 14,
                borderLeft: "3px solid var(--purple)",
              }}
            >
              <span className="label">Template Match</span>
              <span style={{ fontSize: "13px" }}>
                Example #{(generated.selected_example_index || 0) + 1} —{" "}
                {generated.selection_reason}
              </span>
            </div>

            {/* Email */}
            <div className="card" style={{ marginBottom: 14 }}>
              <span className="label">Subject</span>
              <input
                value={generated.subject}
                onChange={(e) =>
                  setGenerated((g) => g ? { ...g, subject: e.target.value } : g)
                }
                style={{ marginBottom: 10 }}
              />
              <span className="label">Body</span>
              <textarea
                value={generated.body}
                onChange={(e) =>
                  setGenerated((g) => g ? { ...g, body: e.target.value } : g)
                }
                style={{ minHeight: 200 }}
              />
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  borderRadius: "var(--radius)",
                  background: "var(--surface-alt)",
                  fontSize: "12px",
                  color: "var(--text-dim)",
                }}
              >
                <b style={{ color: "var(--text)" }}>Signature:</b> —{" "}
                <a href="https://www.linkedin.com/in/krajpal/" style={{ color: "var(--accent)" }}>
                  LinkedIn
                </a>{" "}
                ·{" "}
                <a href="https://github.com/AAP67" style={{ color: "var(--accent)" }}>
                  GitHub
                </a>
              </div>
            </div>

            {/* Hallucination check */}
            <div
              className="card"
              style={{
                borderLeft: `3px solid var(${
                  evalLoading ? "--yellow" : evaluation?.passed ? "--green" : "--red"
                })`,
              }}
            >
              <span className="label">Hallucination Check</span>
              {evalLoading ? (
                <div style={{ color: "var(--yellow)", fontSize: "13px" }}>
                  ⏳ Checking...
                </div>
              ) : evaluation ? (
                <>
                  <div className={`badge ${evaluation.passed ? "badge-green" : "badge-red"}`}>
                    {evaluation.passed ? "✓ CLEAN" : "✗ ISSUES"}
                  </div>
                  {evaluation.issues?.length > 0 && (
                    <ul
                      style={{
                        margin: "8px 0 0 16px",
                        padding: 0,
                        fontSize: "13px",
                        color: "var(--red)",
                      }}
                    >
                      {evaluation.issues.map((iss, i) => (
                        <li key={i} style={{ marginBottom: 3 }}>
                          {iss}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!evaluation.passed && evaluation.corrected_body && (
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 10 }}
                      onClick={regenWithFix}
                    >
                      Apply Fix & Re-check
                    </button>
                  )}
                </>
              ) : null}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-ghost" onClick={generate}>
                Regenerate
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!evaluation?.passed}
              >
                Draft →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Send */}
        {step === 3 && generated && (
          <div>
            {/* Preview */}
            <div className="card" style={{ marginBottom: 18, opacity: 0.85 }}>
              <span className="label">Preview</span>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--accent)",
                  marginBottom: 6,
                }}
              >
                Subject: {generated.subject}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                }}
              >
                {generated.body}
              </div>
              <div style={{ marginTop: 8, fontSize: "12px", color: "var(--text-dim)" }}>
                —{" "}
                <a href="https://www.linkedin.com/in/krajpal/" style={{ color: "var(--accent)" }}>
                  LinkedIn
                </a>{" "}
                ·{" "}
                <a href="https://github.com/AAP67" style={{ color: "var(--accent)" }}>
                  GitHub
                </a>
              </div>
            </div>

            <span className="label">Recipients (one draft per email, comma or newline separated)</span>
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder={"founder@company.com\ncto@company.com"}
              style={{ minHeight: 80 }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 18, alignItems: "center" }}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateDrafts}
                disabled={!recipients.trim() || sendStatus === "creating" || sendStatus === "created"}
              >
                {sendStatus === "creating"
                  ? "Creating..."
                  : sendStatus === "created"
                  ? "Drafts Created ✓"
                  : "Create Gmail Drafts"}
              </button>
              {sendStatus === "created" && (
                <>
                  <span style={{ color: "var(--green)", fontSize: "12px" }}>
                    Check your Gmail Drafts folder
                  </span>
                  <button
                    className="btn btn-ghost"
                    style={{ color: "var(--accent)", marginLeft: 4 }}
                    onClick={resetForNew}
                  >
                    + New Email
                  </button>
                </>
              )}
              {sendStatus === "error" && (
                <span style={{ color: "var(--red)", fontSize: "12px" }}>
                  Failed — is Gmail connected?{" "}
                  <a href="/api/auth/init" style={{ color: "var(--accent)" }}>
                    Connect →
                  </a>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
