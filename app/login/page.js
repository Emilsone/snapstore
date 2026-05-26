"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) { router.push("/dashboard"); router.refresh(); }
    else setError(data.error || "Incorrect credentials");
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--canvas)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>

      {/* Logo mark */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{
          width: 38, height: 38, background: "var(--ink)",
          borderRadius: "var(--r-md)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="2"/>
            <path d="M8 20h8M12 18v2"/>
          </svg>
        </div>
        <p className="serif" style={{ fontSize: 22, color: "var(--ink)", letterSpacing: "-.01em" }}>Stillio</p>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Sign in to continue</p>
      </div>

      {/* Form card */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "var(--surface)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--r-lg)",
        padding: "28px 26px",
      }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>

          <div className="field">
            <label className="label" htmlFor="u">Username</label>
            <input id="u" className="input" type="text"
              placeholder="your username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username" autoFocus required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="p">Password</label>
            <input id="p" className="input" type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password" required
            />
          </div>

          {error && (
            <div style={{
              padding: "8px 11px", fontSize: 12.5,
              background: "var(--red-bg)", color: "var(--red)",
              border: "1px solid #FCA5A5", borderRadius: "var(--r-xs)",
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-fill btn-lg"
            disabled={loading || !form.username || !form.password}
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading
              ? <><div className="spin spin-inv spin-sm"/>Signing in…</>
              : "Sign in"
            }
          </button>
        </form>
      </div>

      <p style={{ marginTop: 20, fontSize: 11.5, color: "var(--ink-4)", textAlign: "center", lineHeight: 1.7 }}>
        Credentials set via <code style={{ fontSize: 11, background: "var(--overlay)", padding: "1px 5px", borderRadius: 3 }}>STILLIO_USERNAME</code>{" "}
        &amp; <code style={{ fontSize: 11, background: "var(--overlay)", padding: "1px 5px", borderRadius: 3 }}>STILLIO_PASSWORD</code>
      </p>
    </div>
  );
}
