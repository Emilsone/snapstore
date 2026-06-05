"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

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
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .serif{font-family:'Instrument Serif',Georgia,serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseGreen{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
        .login-input{
          width:100%; height:44px; padding:0 14px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.1);
          border-radius:8px;
          color:#fff; font-family:inherit; font-size:14px;
          outline:none; transition:border-color .15s, background .15s;
          -webkit-appearance:none;
        }
        .login-input:focus{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.07);}
        .login-input::placeholder{color:rgba(255,255,255,.2);}
        .login-btn{
          width:100%; height:44px;
          background:#fff; color:#0a0a0a;
          border:none; border-radius:8px;
          font-family:inherit; font-size:14.5px; font-weight:600;
          cursor:pointer; transition:opacity .15s, transform .15s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .login-btn:hover:not(:disabled){opacity:.88; transform:translateY(-1px);}
        .login-btn:disabled{opacity:.45; cursor:not-allowed; transform:none;}
        .spin-sm{
          display:inline-block; width:14px; height:14px;
          border:2px solid rgba(0,0,0,.2); border-top-color:#0a0a0a;
          border-radius:50%; animation:spin .6s linear infinite;
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Left panel — branding */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "40px 48px",
        borderRight: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.015)",
        display: "none",
      }}>
      </div>

      {/* Center — form */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
        animation: "fadeUp .6s ease both",
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 0 }}>
              <div style={{ width: 34, height: 34, background: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M8 20h8M12 18v2" />
                </svg>
              </div>
              <span className="serif" style={{ fontSize: 22, color: "#fff", letterSpacing: "-.015em" }}>Snapstore</span>
            </Link>
            <p style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,.35)" }}>
              Sign in to your archive
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: 14,
            padding: "32px 28px",
          }}>
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.5)" }}>
                  Username
                </label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.5)" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="login-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "rgba(255,255,255,.25)", padding: 4,
                      display: "flex", alignItems: "center",
                      transition: "color .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.25)"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                      {showPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "10px 12px", borderRadius: 7,
                  background: "rgba(220,38,38,.12)",
                  border: "1px solid rgba(220,38,38,.25)",
                  fontSize: 13, color: "#FCA5A5",
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-btn"
                disabled={loading || !form.username || !form.password}
                style={{ marginTop: 6 }}
              >
                {loading
                  ? <><div className="spin-sm" />Signing in…</>
                  : "Sign in to dashboard"
                }
              </button>
            </form>
          </div>



          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,.25)", textDecoration: "none", transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,.5)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.25)"}
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
