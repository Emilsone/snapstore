"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { formatDistanceToNow, format } from "date-fns";

const SCHEDULES = [
  { value: "hourly", label: "Every hour" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
];

function ago(d) { if (!d) return "Never"; try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return "—"; } }
function fDate(d) { try { return format(new Date(d), "d MMM yyyy"); } catch { return "—"; } }
function fTime(d) { try { return format(new Date(d), "HH:mm"); } catch { return "—"; } }
function fBytes(b) { if (!b) return ""; if (b < 1024) return b + " B"; if (b < 1048576) return (b / 1024).toFixed(0) + " KB"; return (b / 1048576).toFixed(1) + " MB"; }

const paths = {
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  x: "M18 6L6 18M6 6l12 12",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  pause: "M6 4h4v16H6zM14 4h4v16h-4z",
  play: "M5 3l14 9-14 9V3z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  image: "M21 15l-5-5L5 21 M3 3h18v18H3z M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15",
  chevronR: "M9 18l6-6-6-6",
  zoom: "M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z M21 21l-4.35-4.35",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
};

function Icon({ n, size = 15, style: s }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...s }}>
      <path d={paths[n]} />
    </svg>
  );
}

function Toasts({ list }) {
  return (
    <div className="toasts">
      {list.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);          // selected URL entry
  const [shots, setShots] = useState([]);
  const [shotsLoad, setShotsLoad] = useState(false);
  const [capturing, setCapturing] = useState(null);          // id being captured
  const [delUrlId, setDelUrlId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({ name: "", url: "https://", schedule: "daily" });
  const [formBusy, setFormBusy] = useState(false);

  /* toast helper */
  const toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  /* fetch url list */
  const loadUrls = useCallback(async () => {
    const r = await fetch("/api/urls");
    if (r.status === 401) { location.href = "/"; return; }
    const d = await r.json();
    setUrls(d.urls || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadUrls(); }, [loadUrls]);

  /* fetch screenshots for a url */
  const loadShots = useCallback(async (id) => {
    setShotsLoad(true);
    const r = await fetch(`/api/screenshots?urlId=${id}`);
    const d = await r.json();
    setShots(d.screenshots || []);
    setShotsLoad(false);
  }, []);

  function pick(entry) { setSel(entry); loadShots(entry.id); }

  /* capture */
  async function capture(urlId) {
    setCapturing(urlId);
    toast("Capturing screenshot…", "info");
    const r = await fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urlId }),
    });
    const d = await r.json();
    setCapturing(null);
    if (d.success) {
      toast("Screenshot saved", "ok");
      loadUrls();
      if (sel?.id === urlId) loadShots(urlId);
    } else {
      toast(d.error || "Capture failed", "err");
    }
  }

  /* add url */
  async function addUrl() {
    if (!form.name || !form.url) return;
    setFormBusy(true);

    // Fix URL format
    let cleanUrl = form.url;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const r = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, url: cleanUrl }),
    });
  }

  /* delete url */
  async function deleteUrl(id) {
    if (!confirm("Delete this URL and all its screenshots?")) return;
    setDelUrlId(id);
    const r = await fetch(`/api/urls/${id}`, { method: "DELETE" });
    const d = await r.json();
    setDelUrlId(null);
    if (d.success) {
      toast("Deleted", "ok");
      if (sel?.id === id) { setSel(null); setShots([]); }
      loadUrls();
    } else {
      toast(d.error || "Delete failed", "err");
    }
  }

  /* toggle active */
  async function toggleActive(entry) {
    await fetch(`/api/urls/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: entry.active ? 0 : 1 }),
    });
    const next = { ...entry, active: entry.active ? 0 : 1 };
    setUrls(u => u.map(x => x.id === entry.id ? { ...x, active: next.active } : x));
    if (sel?.id === entry.id) setSel(next);
    toast(next.active ? "Resumed" : "Paused", "info");
  }

  /* delete single screenshot */
  async function deleteShot(shot) {
    const r = await fetch(`/api/screenshots?id=${shot.id}`, { method: "DELETE" });
    const d = await r.json();
    if (d.success) {
      setShots(s => s.filter(x => x.id !== shot.id));
      if (lightbox?.id === shot.id) setLightbox(null);
      loadUrls();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/";
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,.88)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--rule)",
        height: 52,
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: 1280, margin: "0 auto",
          padding: "0 20px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div style={{
              width: 28, height: 28, background: "var(--ink)",
              borderRadius: "var(--r-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon n="camera" size={13} style={{ color: "#fff" }} />
            </div>
            <span className="serif" style={{ fontSize: 18, letterSpacing: "-.01em", color: "var(--ink)" }}>
              Snapstore
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Count pill */}
          {urls.length > 0 && (
            <span style={{
              fontSize: 12, color: "var(--overlay)",
              background: "var(--ink)", border: "1px solid var(--rule)",
              borderRadius: "var(--r-full)", padding: "6px 15px",
            }}>
              {urls.length} URL{urls.length !== 1 ? "s" : ""}
            </span>
          )}

          <button className="btn btn-ghost btn-sm" onClick={logout} style={{ gap: 5 }}>
            <Icon n="logout" size={13} />
            Sign out
          </button>

          <button className="btn btn-fill btn-sm" onClick={() => setShowAdd(true)} style={{ gap: 5 }}>
            <Icon n="plus" size={13} />
            Add URL
          </button>
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        height: "calc(100vh - 52px)",
        maxWidth: 1280, margin: "0 auto", width: "100%",
      }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <aside style={{
          width: 256, flexShrink: 0,
          borderRight: "1px solid var(--rule)",
          overflowY: "auto",
          background: "var(--surface)",
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: "14px 14px 10px",
            borderBottom: "1px solid var(--rule)",
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>
              Tracked URLs
            </p>
          </div>

          {loading ? (
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {[80, 65, 75].map((w, i) => (
                <div key={i} style={{ padding: "11px 10px", borderRadius: "var(--r-sm)" }}>
                  <div className="skeleton" style={{ height: 11, width: `${w}%`, marginBottom: 7 }} />
                  <div className="skeleton" style={{ height: 9, width: "55%" }} />
                </div>
              ))}
            </div>
          ) : urls.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center" }}>
              <div className="empty-icon" style={{ margin: "0 auto 10px" }}>
                <Icon n="flag" size={18} />
              </div>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500, marginBottom: 4 }}>No URLs yet</p>
              <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Add one to start archiving</p>
            </div>
          ) : (
            <nav style={{ padding: "6px 8px" }}>
              {urls.map(entry => {
                const active = sel?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => pick(entry)}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "10px 10px",
                      borderRadius: "var(--r-sm)",
                      border: "none",
                      background: active ? "var(--overlay)" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "background .12s",
                      marginBottom: 1,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--canvas)"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Status dot */}
                    <span className={`dot ${entry.active ? "dot-green" : "dot-stone"}`}
                      style={{ marginTop: 1, flexShrink: 0 }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="truncate" style={{
                        fontSize: 14, fontWeight: active ? 500 : 400,
                        color: "var(--rule)", marginBottom: 2,
                      }}>
                        {entry.name}
                      </p>
                      <p className="truncate mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                        {entry.url.replace(/https?:\/\//, "")}
                      </p>
                    </div>

                    {entry.screenshot_count > 0 && (
                      <span style={{
                        fontSize: 12, color: "var(--text)",
                        background: "var(--danger)", borderRadius: "var(--r-full)",
                        padding: "2px 6px", flexShrink: 0,
                      }}>
                        {entry.screenshot_count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* ── MAIN PANEL ──────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: "auto", background: "var(--canvas)" }}>

          {!sel ? (
            /* Empty / welcome state */
            <div style={{
              height: "100%", display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "40px 24px", textAlign: "center",
            }}>
              <div style={{
                width: 60, height: 60,
                borderRadius: "var(--r-md)",
                background: "var(--surface)", border: "1px solid var(--rule)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--rule)", marginBottom: 16,
              }}>
                <Icon n="image" size={26} />
              </div>
              <p className="serif" style={{ fontSize: 20, color: "var(--ink)", marginBottom: 6 }}>
                Select a URL to view its archive
              </p>
              <p style={{ fontSize: 13, color: "var(--surface-2)", maxWidth: 300, lineHeight: 1.6 }}>
                Pick from the sidebar, or add a URL to start building your snapshot history.
              </p>
            </div>

          ) : (
            <div className="fade-in">

              {/* ── URL detail bar ────────────────────────────────────── */}
              <div style={{
                background: "var(--surface)",
                borderBottom: "1px solid var(--rule)",
                padding: "18px 28px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>

                  {/* Left: name + meta */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5, flexWrap: "wrap" }}>
                      <h1 className="serif" style={{ fontSize: 20, color: "var(--ink)", lineHeight: 1.2 }}>
                        {sel.name}
                      </h1>
                      <span className={`badge ${sel.active ? "badge-green" : "badge-stone"}`}>
                        <span className={`dot ${sel.active ? "dot-green" : "dot-stone"}`} style={{ width: 5, height: 5 }} />
                        {sel.active ? "Active" : "Paused"}
                      </span>
                      <span className="badge badge-blue">{sel.schedule}</span>
                    </div>

                    <a href={sel.url} target="_blank" rel="noopener noreferrer"
                      className="mono"
                      style={{
                        fontSize: 11.5, color: "var(--ink-3)",
                        display: "inline-flex", alignItems: "center", gap: 4,
                        textDecoration: "none",
                        transition: "color .12s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--blue)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--ink-3)"}
                    >
                      {sel.url}
                      <Icon n="external" size={11} />
                    </a>

                    {/* Stats strip */}
                    <div style={{ display: "flex", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
                      {[
                        ["Snapshots", sel.screenshot_count || "0"],
                        ["Last captured", ago(sel.last_captured_at)],
                        ["Added", ago(sel.created_at)],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
                            {label}
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleActive(sel)}>
                      <Icon n={sel.active ? "pause" : "play"} size={12} />
                      {sel.active ? "Pause" : "Resume"}
                    </button>

                    <button className="btn btn-fill btn-sm"
                      onClick={() => capture(sel.id)}
                      disabled={capturing === sel.id}
                    >
                      {capturing === sel.id
                        ? <><div className="spin spin-sm spin-inv" />Capturing…</>
                        : <><Icon n="camera" size={12} />Capture now</>
                      }
                    </button>

                    <button className="btn btn-ghost btn-danger btn-sm"
                      onClick={() => deleteUrl(sel.id)}
                      disabled={delUrlId === sel.id}
                      title="Delete this URL"
                    >
                      {delUrlId === sel.id
                        ? <div className="spin spin-sm" />
                        : <Icon n="trash" size={12} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Screenshots grid ────────────────────────────────── */}
              <div style={{ padding: "24px 28px" }}>
                {shotsLoad ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 14,
                  }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="card" style={{ overflow: "hidden" }}>
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
                    background: "var(--surface)",
                    border: "1px dashed var(--rule-mid)",
                    borderRadius: "var(--r-lg)",
                    padding: "60px 24px", textAlign: "center",
                  }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: "var(--r-md)",
                      background: "var(--overlay)", border: "1px solid var(--rule)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--ink-3)", margin: "0 auto 14px",
                    }}>
                      <Icon n="camera" size={20} />
                    </div>
                    <p className="serif" style={{ fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>
                      No snapshots yet
                    </p>
                    <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 20 }}>
                      Take the first capture to start building this archive
                    </p>
                    <button className="btn btn-fill"
                      onClick={() => capture(sel.id)}
                      disabled={capturing === sel.id}
                    >
                      {capturing === sel.id
                        ? <><div className="spin spin-inv spin-sm" />Capturing…</>
                        : <><Icon n="camera" size={13} />Capture now</>
                      }
                    </button>
                  </div>

                ) : (
                  <>
                    {/* Grid header */}
                    <div style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", marginBottom: 16,
                    }}>
                      <p style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                        {shots.length} snapshot{shots.length !== 1 ? "s" : ""}
                        <span style={{ marginLeft: 6, color: "var(--ink-4)" }}>· newest first</span>
                      </p>
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 14,
                    }}>
                      {shots.map((shot, i) => (
                        <article
                          key={shot.id}
                          className="card fade-in"
                          style={{ overflow: "hidden", animationDelay: `${i * 0.035}s` }}
                        >
                          {/* Thumbnail */}
                          <div
                            style={{
                              aspectRatio: "16 / 10",
                              overflow: "hidden",
                              background: "var(--overlay)",
                              cursor: "zoom-in",
                              position: "relative",
                            }}
                            onClick={() => setLightbox(shot)}
                          >
                            <img
                              src={shot.filepath}
                              alt={`Snapshot ${shot.captured_at}`}
                              loading="lazy"
                              style={{
                                width: "100%", height: "100%",
                                objectFit: "cover", display: "block",
                                transition: "transform .3s ease",
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            />

                            {/* Hover overlay: zoom hint */}
                            <div style={{
                              position: "absolute", inset: 0,
                              background: "rgba(0,0,0,0)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background .2s",
                              color: "#fff",
                            }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(0,0,0,.22)";
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
                                <path d={paths.zoom} />
                              </svg>
                            </div>
                          </div>

                          {/* Card footer */}
                          <div style={{
                            padding: "10px 12px",
                            borderTop: "1px solid var(--rule)",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: 8,
                          }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 1 }}>
                                {fDate(shot.captured_at)}
                              </p>
                              <p style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                                <Icon n="clock" size={10} />
                                {fTime(shot.captured_at)}
                                {shot.file_size ? <> · {fBytes(shot.file_size)}</> : ""}
                              </p>
                            </div>

                            <div style={{ display: "flex", gap: 4 }}>
                              <a
                                href={shot.filepath}
                                download
                                className="btn btn-ghost btn-sm"
                                title="Download"
                                style={{ padding: "0 7px" }}
                              >
                                <Icon n="download" size={12} />
                              </a>
                              <button className="btn btn-ghost btn-danger btn-sm"
                                onClick={() => deleteShot(shot)}
                                title="Delete"
                                style={{ padding: "0 7px" }}
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
          )}
        </main>
      </div>

      {/* ── ADD URL MODAL ────────────────────────────────────────────────── */}
      {showAdd && (
        <div className="backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <p className="serif" style={{ fontSize: 17, color: "var(--ink)" }}>Add a URL</p>
              <button className="btn btn-ghost btn-sm" style={{ padding: "0 6px" }}
                onClick={() => setShowAdd(false)}>
                <Icon n="x" size={15} />
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="label" htmlFor="m-name">Label</label>
                <input id="m-name" className="input" placeholder="e.g. My portfolio"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="m-url">URL</label>
                <input id="m-url" className="input input-mono" placeholder="https://example.com"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="m-sched">Capture frequency</label>
                <select id="m-sched" className="input"
                  value={form.schedule}
                  onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                >
                  {SCHEDULES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <p className="hint">The scheduler must be running for automatic captures to work.</p>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-fill"
                onClick={addUrl}
                disabled={formBusy || !form.name || !form.url || form.url === "https://"}
              >
                {formBusy
                  ? <><div className="spin spin-sm spin-inv" />Adding…</>
                  : "Add URL"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(10,9,8,.88)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setLightbox(null)}
        >
          {/* Top bar */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0,
            height: 50, padding: "0 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,.55)" }}>
              {fDate(lightbox.captured_at)} at {fTime(lightbox.captured_at)}
              {lightbox.file_size ? ` · ${fBytes(lightbox.file_size)}` : ""}
            </p>
            <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
              <a href={lightbox.filepath} download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: "var(--r-sm)",
                  background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.7)", fontSize: 12.5, textDecoration: "none",
                  cursor: "pointer",
                  transition: "background .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}
              >
                <Icon n="download" size={12} />
                Download
              </a>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "5px 10px", borderRadius: "var(--r-sm)",
                  background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.6)", cursor: "pointer",
                }}
              >
                <Icon n="x" size={14} />
              </button>
            </div>
          </div>

          {/* Image */}
          <img
            src={lightbox.filepath}
            alt="Full snapshot"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "92vw", maxHeight: "calc(100vh - 90px)",
              objectFit: "contain", borderRadius: "var(--r-md)",
              border: "1px solid rgba(255,255,255,.08)",
              display: "block", marginTop: 50,
            }}
          />
        </div>
      )}

      <Toasts list={toasts} />
    </>
  );
}
