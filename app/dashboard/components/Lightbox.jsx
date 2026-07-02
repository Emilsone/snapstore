"use client";
import Icon from "./Icon";
import { fDate, fTime, fBytes } from "./utils";
import ScrollHint from "./ScrollHint";

export default function Lightbox({
  lightbox,
  setLightbox,
  sel
}) {
  if (!lightbox) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,.92)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column",
      }}
      onClick={() => setLightbox(null)}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="lightbox-header"
        style={{
          height: "auto", minHeight: 54, flexShrink: 0,
          background: "#fff", borderBottom: "1px solid var(--rule)",
          padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", marginBottom: 1, whiteSpace: "nowrap" }}>
              {fDate(lightbox.captured_at)} at {fTime(lightbox.captured_at)}
            </p>
            <p className="lightbox-url" style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "clamp(150px, 30vw, 400px)" }}>
              {sel?.url}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {lightbox.file_size && (
            <span style={{ fontSize: 13.5, color: "var(--ink-3)", background: "var(--overlay)", border: "1px solid var(--rule)", borderRadius: 99, padding: "3px 10px" }}>
              {fBytes(lightbox.file_size)}
            </span>
          )}
          <a
            href={lightbox.filepath}
            download
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 7,
              border: "1px solid var(--rule)", background: "#fff",
              color: "var(--ink-2)", fontSize: 14.5, textDecoration: "none",
              transition: "all .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rule-mid)"; e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink-2)"; }}
          >
            <Icon n="download" size={13} />
            Download
          </a>
          <button
            onClick={() => setLightbox(null)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 7,
              border: "1px solid var(--rule)", background: "#fff",
              color: "var(--ink-3)", cursor: "pointer", transition: "all .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink-3)"; }}
          >
            <Icon n="x" size={14} />
          </button>
        </div>
      </div>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          background: "#111", padding: "24px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 1440, margin: "0 auto" }}>
          <div style={{
            background: "#2a2a2a", border: "1px solid #333",
            borderBottom: "none", borderRadius: "8px 8px 0 0",
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .7 }} />
              ))}
            </div>
            <div style={{
              flex: 1, maxWidth: 400, margin: "0 auto",
              background: "#1a1a1a", border: "1px solid #333",
              borderRadius: 5, padding: "4px 12px",
              fontSize: 13, color: "#888", fontFamily: "monospace",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {sel?.url?.replace(/https?:\/\//, "")}
            </div>
          </div>

          <img
            src={lightbox.filepath}
            alt="Full page capture"
            style={{ width: "100%", height: "auto", display: "block", border: "1px solid #333", borderTop: "none", borderRadius: "0 0 8px 8px" }}
          />

          <div style={{ marginTop: 16, textAlign: "center", padding: "12px" }}>
            <p style={{ fontSize: 13, color: "#666", fontFamily: "monospace" }}>
              Captured by Snapstore · {fDate(lightbox.captured_at)} at {fTime(lightbox.captured_at)}
            </p>
          </div>
        </div>
      </div>

      <ScrollHint />
    </div>
  );
}
