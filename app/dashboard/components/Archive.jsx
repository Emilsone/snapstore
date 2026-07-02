"use client";
import Icon from "./Icon";
import { ago, fDate, fTime, fBytes } from "./utils";

export default function Archive({
  sel,
  toggleActive,
  capture,
  capturing,
  deleteUrl,
  delUrlId,
  shots,
  shotsLoad,
  setLightbox,
  deleteShot
}) {
  if (!sel) {
    return (
      <div style={{
      minHeight: "60vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", textAlign: "center",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 8,
        background: "#fff", border: "1px solid var(--rule)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--ink-3)", marginBottom: 16,
        boxShadow: "0 4px 4px rgba(0,0,0,.06)",
      }}>
        <Icon n="image" size={22} />
      </div>
      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 21.5, color: "var(--ink)", marginBottom: 8 }}>
        Select a URL to view its archive
      </p>
      <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 300, lineHeight: 1.6 }}>
        Pick from the sidebar, or add a URL to start building your snapshot history.
      </p>
    </div>
  );
  }

  return (
    <div className="fade-in" style={{ minWidth: 0, overflowX: "hidden" }}>
      {/* URL detail hero */}
      <div className="archive-hero-wrap" style={{ padding: "24px 24px 0" }}>
        <div style={{
          background: "#fff",
          border: "1px solid var(--rule)",
          borderRadius: 12,
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}>
          <div className="archive-hero-inner" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, color: "var(--ink)", lineHeight: 1.1, margin: 0 }}>
                  {sel.name}
                </h1>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 99,
                  background: sel.active ? "#dcfce7" : "var(--overlay)",
                  color: sel.active ? "#15803d" : "var(--ink-2)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sel.active ? "#22C55E" : "var(--ink-3)" }} />
                  {sel.active ? "Active" : "Paused"}
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 500, padding: "3px 10px", borderRadius: 99,
                  background: "#eff6ff", color: "#1d4ed8",
                }}>
                  {sel.schedule}
                </span>
              </div>

              <a href={sel.url} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: 14.5, color: "#1d4ed8",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  textDecoration: "none", fontFamily: "monospace",
                  transition: "opacity .15s",
                  wordBreak: "break-all",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {sel.url}
                <Icon n="external" size={12} />
              </a>
            </div>

            <div className="archive-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
              <button
                onClick={() => toggleActive(sel)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8,
                  border: "1px solid var(--rule)", background: "#DCFCE7",
                  color: "#15803D", fontSize: 14.5, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rule-mid)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; }}
              >
                <Icon n={sel.active ? "pause" : "play"} size={14} />
                {sel.active ? "Pause" : "Resume"}
              </button>

              <button
                onClick={() => capture(sel.id)}
                disabled={capturing === sel.id}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 18px", borderRadius: 8,
                  border: "none", background: "var(--ink)", color: "#fff",
                  fontSize: 14.5, fontWeight: 500, cursor: "pointer",
                  fontFamily: "inherit", transition: "background .15s",
                  opacity: capturing === sel.id ? .7 : 1,
                }}
                onMouseEnter={e => { if (capturing !== sel.id) e.currentTarget.style.background = "#2E2C28"; }}
                onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
              >
                {capturing === sel.id
                  ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite" }} />Capturing…</>
                  : <><Icon n="camera" size={14} />Capture now</>
                }
              </button>

              <div style={{ width: 1, height: 24, background: "var(--rule)", margin: "0 4px" }} />

              <button
                onClick={() => deleteUrl(sel.id)}
                disabled={delUrlId === sel.id}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 36, height: 36, borderRadius: 8,
                  border: "1px solid var(--rule)", background: "#fff",
                  color: "var(--ink-3)", cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink-3)"; }}
                title="Delete URL"
              >
                <Icon n="trash" size={14} />
              </button>
            </div>
          </div>

          <div className="archive-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              ["Snapshots", sel.screenshot_count || "0"],
              ["Last captured", ago(sel.last_captured_at)],
              ["Added", ago(sel.created_at)],
            ].map(([label, val]) => (
              <div key={label} style={{
                background: "var(--canvas)", border: "1px solid var(--overlay)",
                borderRadius: 8, padding: "12px 16px",
              }}>
                <p style={{ fontSize: 13, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4, fontWeight: 500 }}>
                  {label}
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screenshots grid */}
      <div className="archive-padding" style={{ padding: "24px" }}>
        {shotsLoad ? (
          <div className="archive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--rule)", borderRadius: 10, overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 164 }} />
                <div style={{ padding: "11px 13px" }}>
                  <div className="skeleton" style={{ height: 11, width: "55%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 9, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : shots.length === 0 ? (
          <div style={{
            background: "#fff", border: "1px dashed var(--rule)",
            borderRadius: 12, padding: "60px 24px", textAlign: "center",
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10,
              background: "var(--overlay)", border: "1px solid var(--rule)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--rule-mid)", margin: "0 auto 14px",
            }}>
              <Icon n="camera" size={20} />
            </div>
            <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 19.5, color: "var(--ink)", marginBottom: 6 }}>
              No snapshots yet
            </p>
            <p style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 20 }}>
              Take the first capture to start building this archive
            </p>
            <button
              onClick={() => capture(sel.id)}
              disabled={capturing === sel.id}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 7,
                border: "none", background: "var(--ink)", color: "#fff",
                fontSize: 15.5, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Icon n="camera" size={13} />
              Capture now
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 14.5, color: "var(--ink-3)" }}>
                {shots.length} snapshot{shots.length !== 1 ? "s" : ""}
                <span style={{ marginLeft: 6, color: "var(--rule-mid)" }}>· newest first</span>
              </p>
            </div>

          <div className="archive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {shots.map((shot, i) => (
                <article
                  key={shot.id}
                  className="snap-card"
                  style={{
                    background: "#fff", border: "1px solid var(--rule)",
                    borderRadius: 10, overflow: "hidden",
                    animationDelay: `${i * 0.035}s`,
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "16 / 10", overflow: "hidden",
                      background: "var(--overlay)", cursor: "zoom-in", position: "relative",
                    }}
                    onClick={() => setLightbox(shot)}
                  >
                    <img
                      src={shot.filepath}
                      alt={`Snapshot ${shot.captured_at}`}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .3s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background .2s",
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(0,0,0,.18)";
                        e.currentTarget.querySelector("svg").style.opacity = "1";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(0,0,0,0)";
                        e.currentTarget.querySelector("svg").style.opacity = "0";
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="1.75" strokeLinecap="round"
                        style={{ opacity: 0, transition: "opacity .2s" }}>
                        <path d="M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z M21 21l-4.35-4.35" />
                      </svg>
                    </div>
                  </div>

                  <div className="snap-footer" style={{
                    padding: "12px 14px",
                    borderTop: "1px solid var(--overlay)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  }}>
                    <div>
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>
                        {fDate(shot.captured_at)}
                      </p>
                      <p style={{ fontSize: 12.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon n="clock" size={10} />
                        {fTime(shot.captured_at)}
                        {shot.file_size ? <> · {fBytes(shot.file_size)}</> : ""}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <a href={shot.filepath} download
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 30, height: 30, borderRadius: 6,
                          border: "1px solid var(--rule)", background: "#fff",
                          color: "var(--ink-3)", textDecoration: "none",
                          transition: "all .12s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rule-mid)"; e.currentTarget.style.color = "var(--ink)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink-3)"; }}
                      >
                        <Icon n="download" size={12} />
                      </a>
                      <button
                        onClick={() => deleteShot(shot)}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 30, height: 30, borderRadius: 6,
                          border: "1px solid var(--rule)", background: "#fff",
                          color: "var(--ink-3)", cursor: "pointer",
                          transition: "all .12s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.color = "var(--ink-3)"; }}
                      >
                        <Icon n="trash" size={12} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
