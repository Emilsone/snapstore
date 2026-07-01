"use client";
import { useState, useEffect, useCallback } from "react";
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
  clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15",
  zoom: "M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z M21 21l-4.35-4.35",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  support: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  chevronD: "M6 9l6 6 6-6",
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
      {list.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
    </div>
  );
}
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 99, padding: "8px 18px",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 12.5, color: "rgba(255,255,255,.7)",
      animation: "fadeIn .3s ease",
      pointerEvents: "none", zIndex: 300,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
      Scroll to browse the full page
    </div>
  );
}

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);
  const [shots, setShots] = useState([]);
  const [shotsLoad, setShotsLoad] = useState(false);
  const [capturing, setCapturing] = useState(null);
  const [delUrlId, setDelUrlId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({ name: "", url: "https://", schedule: "daily" });
  const [formBusy, setFormBusy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeNav, setActiveNav] = useState("archive");

  const toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  const loadUrls = useCallback(async () => {
    const r = await fetch("/api/urls");
    if (r.status === 401) { location.href = "/"; return; }
    const d = await r.json();
    setUrls(d.urls || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadUrls(); }, [loadUrls]);

  const loadShots = useCallback(async (id) => {
    setShotsLoad(true);
    const r = await fetch(`/api/screenshots?urlId=${id}`);
    const d = await r.json();
    setShots(d.screenshots || []);
    setShotsLoad(false);
  }, []);

  function pick(entry) { setSel(entry); loadShots(entry.id); }

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

  async function addUrl() {
    if (!form.name || !form.url) return;
    setFormBusy(true);
    let cleanUrl = form.url;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    const r = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, url: cleanUrl }),
    });
    const d = await r.json();
    setFormBusy(false);
    if (d.url) {
      toast("URL added", "ok");
      setShowAdd(false);
      setForm({ name: "", url: "https://", schedule: "daily" });
      loadUrls();
    } else {
      toast(d.error || "Failed", "err");
    }
  }

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

  const navItems = [
    { id: "archive", label: "Archive", icon: "camera" },
    { id: "settings", label: "Settings", icon: "settings" },
    { id: "support", label: "Support", icon: "support" },
  ];

  return (
    <>
      <style>{`
        .db-sidebar-btn:hover { background: var(--stone-100) !important; }
        .db-nav-item { transition: background .12s, color .12s; }
        .db-nav-item:hover { background: var(--stone-100) !important; color: var(--ink) !important; }
        .profile-dropdown { animation: fadeIn .15s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        .skeleton { background: linear-gradient(90deg, #f0efed 25%, #faf9f7 50%, #f0efed 75%); background-size:400px 100%; animation:shimmer 1.4s ease infinite; border-radius:6px; }
        .fade-in { animation: fadeIn .3s ease both; }
        .snap-card { transition: box-shadow .2s, transform .2s; }
        .snap-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--stone-200)",
        height: 56, display: "flex", alignItems: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: 1280, margin: "0 auto",
          padding: "0 24px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, background: "var(--ink)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" />
              </svg>
            </div>
            <span style={{ fontSize: 19, fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--ink)", letterSpacing: "-.015em" }}>
              Snapstore
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* URL count */}
          {urls.length > 0 && (
            <span style={{
              fontSize: 12.5, color: "var(--stone-500)",
              background: "var(--stone-100)", border: "1px solid var(--stone-200)",
              borderRadius: 99, padding: "3px 12px",
            }}>
              {urls.length} URL{urls.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Add URL */}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--ink)", color: "#fff",
              border: "none", borderRadius: 7,
              padding: "7px 16px", fontSize: 13.5, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background .12s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#2E2C28"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
          >
            <Icon n="plus" size={13} />
            Add URL
          </button>

          {/* Profile button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfile(p => !p)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--stone-100)", border: "1px solid var(--stone-200)",
                borderRadius: 99, padding: "5px 12px 5px 5px",
                cursor: "pointer", transition: "all .12s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--stone-300)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--stone-200)"}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon n="user" size={13} style={{ color: "#fff" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--stone-700)" }}>Account</span>
              <Icon n="chevronD" size={12} style={{ color: "var(--stone-400)" }} />
            </button>

            {/* Dropdown */}
            {showProfile && (
              <div
                className="profile-dropdown"
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", border: "1px solid var(--stone-200)",
                  borderRadius: 10, padding: "6px",
                  minWidth: 180,
                  boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                  zIndex: 100,
                }}
              >
                {[
                  { label: "Settings", icon: "settings", action: () => { setActiveNav("settings"); setShowProfile(false); } },
                  { label: "Support", icon: "support", action: () => { setActiveNav("support"); setShowProfile(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 7,
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13.5, color: "var(--ink", fontFamily: "inherit",
                    transition: "background .1s",
                    textAlign: "left",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--stone-50)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <Icon n={item.icon} size={14} style={{ color: "var(--stone-400)" }} />
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--stone-100)", margin: "4px 0" }} />
                <button onClick={logout} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 7,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13.5, color: "#dc2626", fontFamily: "inherit",
                  transition: "background .1s",
                  textAlign: "left",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Icon n="logout" size={14} style={{ color: "#dc2626" }} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* close profile on outside click */}
      {showProfile && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 39 }}
          onClick={() => setShowProfile(false)}
        />
      )}

      {/* ── BODY ── */}
      <div style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        maxWidth: 1280, margin: "0 auto", width: "100%",
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 260, flexShrink: 0,
          borderRight: "1px solid var(--stone-200)",
          background: "#fff",
          display: "flex", flexDirection: "column",
          height: "100%",
        }}>

          {/* URL list — top section, grows to fill space */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px 0" }}>

            {activeNav === "archive" && (
              <>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: "#b0aeaa",
                  letterSpacing: ".07em", textTransform: "uppercase",
                  padding: "0 6px", marginBottom: 6,
                }}>
                  Tracked URLs
                </p>

                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[80, 65, 75].map((w, i) => (
                      <div key={i} style={{ padding: "10px 10px", borderRadius: 7 }}>
                        <div className="skeleton" style={{ height: 11, width: `${w}%`, marginBottom: 6 }} />
                        <div className="skeleton" style={{ height: 9, width: "55%" }} />
                      </div>
                    ))}
                  </div>
                ) : urls.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: "#f5f5f4", border: "1px solid #e7e5e4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#c4c2bc", margin: "0 auto 10px",
                    }}>
                      <Icon n="flag" size={16} />
                    </div>
                    <p style={{ fontSize: 12.5, color: "#78716c", fontWeight: 500, marginBottom: 3 }}>No URLs yet</p>
                    <p style={{ fontSize: 12, color: "#a8a29e" }}>Add one to start archiving</p>
                  </div>
                ) : (
                  <nav>
                    {urls.map(entry => {
                      const isActive = sel?.id === entry.id;
                      return (
                        <button
                          key={entry.id}
                          onClick={() => pick(entry)}
                          style={{
                            width: "100%", textAlign: "left",
                            padding: "9px 10px", borderRadius: 7,
                            border: "none",
                            background: isActive ? "#f5f5f4" : "transparent",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            transition: "background .12s", marginBottom: 1,
                            fontFamily: "inherit",
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#fafaf9"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                            background: entry.active ? "#22C55E" : "#d6d3d1",
                            marginTop: 1,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: 13, fontWeight: isActive ? 500 : 400,
                              color: isActive ? "#1a1916" : "#57534e",
                              marginBottom: 2,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {entry.name}
                            </p>
                            <p style={{
                              fontSize: 11, color: "#a8a29e",
                              fontFamily: "monospace",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {entry.url.replace(/https?:\/\//, "")}
                            </p>
                          </div>
                          {entry.screenshot_count > 0 && (
                            <span style={{
                              fontSize: 11, color: "#a8a29e",
                              background: "#f5f5f4", border: "1px solid #e7e5e4",
                              borderRadius: 99, padding: "1px 7px", flexShrink: 0,
                            }}>
                              {entry.screenshot_count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                )}
              </>
            )}
          </div>

          {/* Bottom section — nav items + sign out, always at the bottom */}
          <div style={{ flexShrink: 0 }}>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #f5f5f4", margin: "0 10px" }} />

            {/* Nav items */}
            <div style={{ padding: "8px 10px" }}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 7,
                    border: "none", cursor: "pointer",
                    background: activeNav === item.id ? "#f5f5f4" : "transparent",
                    color: "#44403c",
                    fontSize: 13.5, fontWeight: activeNav === item.id ? 500 : 400,
                    fontFamily: "inherit", textAlign: "left",
                    marginBottom: 2, transition: "background .12s",
                  }}
                  onMouseEnter={e => { if (activeNav !== item.id) e.currentTarget.style.background = "#fafaf9"; }}
                  onMouseLeave={e => { if (activeNav !== item.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon n={item.icon} size={14} style={{ color: activeNav === item.id ? "#1a1916" : "#a8a29e" }} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Sign out */}
            <div style={{ padding: "0 10px 10px" }}>
              <div style={{ borderTop: "1px solid #f5f5f4", marginBottom: 8 }} />
              <button
                onClick={logout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 7,
                  border: "none", cursor: "pointer",
                  background: "#fef2f2", color: "#dc2626",
                  fontSize: 13.5, fontFamily: "inherit", textAlign: "left",
                }}
              >
                <Icon n="logout" size={14} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN PANEL ── */}
        <main style={{ flex: 1, overflowY: "auto", background: "var(--canvas, #F9F8F6)" }}>

          {/* ── SETTINGS PAGE ── */}
          {activeNav === "settings" && (
            <div style={{ padding: "40px 40px", maxWidth: 600 }}>
              <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>Settings</h1>
              <p style={{ fontSize: 14, color: "var(--stone-400)", marginBottom: 36 }}>Manage your Snapstore preferences</p>

              {[
                { title: "Account", desc: "Your username and login credentials are set via environment variables on your server.", action: null },
                { title: "Capture quality", desc: "Screenshots are captured at 1440×900 viewport, full page, saved as PNG.", action: null },
                { title: "Storage", desc: "All screenshots are stored in your Supabase bucket. Manage files directly from the Supabase dashboard.", action: null },
                { title: "Scheduler", desc: "Automatic captures are handled by the Railway cron job. Check Railway logs if captures are not running.", action: null },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "20px 0",
                  borderBottom: "1px solid var(--stone-200)",
                }}>
                  <p style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>{s.title}</p>
                  <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── SUPPORT PAGE ── */}
          {activeNav === "support" && (
            <div style={{ padding: "40px 40px", maxWidth: 600 }}>
              <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>Support</h1>
              <p style={{ fontSize: 14, color: "var(--stone-400)", marginBottom: 36 }}>Get help with Snapstore</p>

              {[
                {
                  title: "Screenshots not capturing?",
                  desc: "Check that your ScrapingBee API key is set correctly in Railway environment variables. Also check Railway logs for error messages.",
                },
                {
                  title: "Scheduled captures not running?",
                  desc: "Make sure the Railway cron job is configured and your CRON_SECRET matches the value in your environment variables.",
                },
                {
                  title: "Can't log in?",
                  desc: "Your credentials are set via SNAPSTORE_USERNAME and SNAPSTORE_PASSWORD environment variables in Railway. Update them there.",
                },
                {
                  title: "Screenshots missing sections?",
                  desc: "Some pages use lazy loading. Try increasing the wait time in your capture settings or contact support.",
                },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "20px 0",
                  borderBottom: "1px solid var(--stone-200)",
                }}>
                  <p style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>{s.title}</p>
                  <p style={{ fontSize: 13.5, color: "var(--stone-500)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}

              <div style={{ marginTop: 32 }}>
                <a href="mailto:hello@snapstore.app" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--ink)", color: "#fff",
                  padding: "10px 22px", borderRadius: 7,
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                  transition: "background .12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2E2C28"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
                >
                  Email support →
                </a>
              </div>
            </div>
          )}

          {/* ── ARCHIVE PAGE ── */}
          {activeNav === "archive" && (
            <>
              {!sel ? (
                <div style={{
                  height: "100%", display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "40px 24px", textAlign: "center",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 8,
                    background: "#fff", border: "1px solid var(--ink-3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--ink)", marginBottom: 16,
                    boxShadow: "0 4px 4px rgba(0,0,0,.06)",
                  }}>
                    <Icon n="image" size={22} />
                  </div>
                  <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: "var(--ink)", marginBottom: 6 }}>
                    Select a URL to view its archive
                  </p>
                  <p style={{ fontSize: 13.5, color: "var(--ink)", maxWidth: 300, lineHeight: 1.6 }}>
                    Pick from the sidebar, or add a URL to start building your snapshot history.
                  </p>
                </div>
              ) : (
                <div className="fade-in">

                  {/* URL detail bar */}
                  <div style={{
                    background: "#fff",
                    borderBottom: "1px solid var(--stone-200)",
                    padding: "20px 28px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5, flexWrap: "wrap" }}>
                          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: "var(--ink)", lineHeight: 1.2 }}>
                            {sel.name}
                          </h1>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: 11.5, fontWeight: 500, padding: "2px 9px", borderRadius: 99,
                            background: sel.active ? "#dcfce7" : "var(--stone-100)",
                            color: sel.active ? "#15803d" : "var(--stone-500)",
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: sel.active ? "#22C55E" : "var(--stone-400)" }} />
                            {sel.active ? "Active" : "Paused"}
                          </span>
                          <span style={{
                            fontSize: 11.5, fontWeight: 500, padding: "2px 9px", borderRadius: 99,
                            background: "#eff6ff", color: "#1d4ed8",
                          }}>
                            {sel.schedule}
                          </span>
                        </div>

                        <a href={sel.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize: 13, color: "#1d4ed8",
                            display: "inline-flex", alignItems: "center", gap: 4,
                            textDecoration: "none", fontFamily: "monospace",
                            transition: "color .12s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = "#1d4ed8"}
                          onMouseLeave={e => e.currentTarget.style.color = "#1d4ed8"}
                        >
                          {sel.url}
                          <Icon n="external" size={11} />
                        </a>

                        <div style={{ display: "flex", gap: 24, marginTop: 14, flexWrap: "wrap" }}>
                          {[
                            ["Snapshots", sel.screenshot_count || "0"],
                            ["Last captured", ago(sel.last_captured_at)],
                            ["Added", ago(sel.created_at)],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <p style={{ fontSize: 11.5, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
                                {label}
                              </p>
                              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                        <button
                          onClick={() => toggleActive(sel)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 14px", borderRadius: 7,
                            border: "1px solid var(--stone-200)", background: "#DCFCE7",
                            color: "#15803D", fontSize: 13, fontWeight: 500,
                            cursor: "pointer", fontFamily: "inherit", transition: "all .12s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--stone-300)"; e.currentTarget.style.color = "var(--ink)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--ink)"; }}
                        >
                          <Icon n={sel.active ? "pause" : "play"} size={12} />
                          {sel.active ? "Pause" : "Resume"}
                        </button>



                        <button
                          onClick={() => capture(sel.id)}
                          disabled={capturing === sel.id}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 16px", borderRadius: 7,
                            border: "none", background: "var(--ink)", color: "#fff",
                            fontSize: 13, fontWeight: 500, cursor: "pointer",
                            fontFamily: "inherit", transition: "background .12s",
                            opacity: capturing === sel.id ? .6 : 1,
                          }}
                          onMouseEnter={e => { if (capturing !== sel.id) e.currentTarget.style.background = "#2E2C28"; }}
                          onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
                        >
                          {capturing === sel.id
                            ? <><div style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .6s linear infinite" }} />Capturing…</>
                            : <><Icon n="camera" size={12} />Capture now</>
                          }
                        </button>

                        <button
                          onClick={() => deleteUrl(sel.id)}
                          disabled={delUrlId === sel.id}
                          style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: 7,
                            border: "1px solid var(--stone-200)", background: "#fff",
                            color: "var(--stone-400)", cursor: "pointer", transition: "all .12s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--stone-400)"; }}
                          title="Delete URL"
                        >
                          <Icon n="trash" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Screenshots grid */}
                  <div style={{ padding: "24px 28px" }}>
                    {shotsLoad ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} style={{ background: "#fff", border: "1px solid var(--stone-200)", borderRadius: 10, overflow: "hidden" }}>
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
                        background: "#fff", border: "1px dashed var(--stone-200)",
                        borderRadius: 12, padding: "60px 24px", textAlign: "center",
                      }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: 10,
                          background: "var(--stone-100)", border: "1px solid var(--stone-200)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--stone-300)", margin: "0 auto 14px",
                        }}>
                          <Icon n="camera" size={20} />
                        </div>
                        <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>
                          No snapshots yet
                        </p>
                        <p style={{ fontSize: 13.5, color: "var(--stone-400)", marginBottom: 20 }}>
                          Take the first capture to start building this archive
                        </p>
                        <button
                          onClick={() => capture(sel.id)}
                          disabled={capturing === sel.id}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "9px 20px", borderRadius: 7,
                            border: "none", background: "var(--ink)", color: "#fff",
                            fontSize: 14, fontWeight: 500, cursor: "pointer",
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
                          <p style={{ fontSize: 13, color: "var(--stone-400)" }}>
                            {shots.length} snapshot{shots.length !== 1 ? "s" : ""}
                            <span style={{ marginLeft: 6, color: "var(--stone-300)" }}>· newest first</span>
                          </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                          {shots.map((shot, i) => (
                            <article
                              key={shot.id}
                              className="snap-card"
                              style={{
                                background: "#fff", border: "1px solid var(--stone-200)",
                                borderRadius: 10, overflow: "hidden",
                                animationDelay: `${i * 0.035}s`,
                              }}
                            >
                              <div
                                style={{
                                  aspectRatio: "16 / 10", overflow: "hidden",
                                  background: "var(--stone-100)", cursor: "zoom-in", position: "relative",
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
                                    <path d={paths.zoom} />
                                  </svg>
                                </div>
                              </div>

                              <div style={{
                                padding: "11px 13px",
                                borderTop: "1px solid var(--stone-100)",
                                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                              }}>
                                <div>
                                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>
                                    {fDate(shot.captured_at)}
                                  </p>
                                  <p style={{ fontSize: 11, color: "var(--stone-400)", display: "flex", alignItems: "center", gap: 4 }}>
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
                                      border: "1px solid var(--stone-200)", background: "#fff",
                                      color: "var(--stone-400)", textDecoration: "none",
                                      transition: "all .12s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--stone-300)"; e.currentTarget.style.color = "var(--ink)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--stone-400)"; }}
                                  >
                                    <Icon n="download" size={12} />
                                  </a>
                                  <button
                                    onClick={() => deleteShot(shot)}
                                    style={{
                                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                                      width: 30, height: 30, borderRadius: 6,
                                      border: "1px solid var(--stone-200)", background: "#fff",
                                      color: "var(--stone-400)", cursor: "pointer",
                                      transition: "all .12s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--stone-400)"; }}
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
            </>
          )}
        </main>
      </div>

      {/* ── ADD URL MODAL ── */}
      {showAdd && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(26,25,23,.4)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", animation: "fadeIn .18s ease",
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 14,
              width: "100%", maxWidth: 440,
              boxShadow: "0 24px 64px rgba(0,0,0,.12)",
              animation: "fadeIn .2s ease",
            }}
          >
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--stone-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 18, color: "var(--ink)" }}>Add a URL</p>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone-400)", padding: 4, display: "flex" }}>
                <Icon n="x" size={16} />
              </button>
            </div>
            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--stone-600)" }}>Label</label>
                <input
                  style={{
                    width: "100%", height: 38, padding: "0 12px",
                    border: "1px solid var(--stone-200)", borderRadius: 7,
                    fontSize: 14, color: "var(--ink)", fontFamily: "inherit",
                    outline: "none", transition: "border-color .15s",
                  }}
                  placeholder="e.g. My portfolio"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                  onFocus={e => e.target.style.borderColor = "#1d4ed8"}
                  onBlur={e => e.target.style.borderColor = "var(--stone-200)"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--stone-600)" }}>URL</label>
                <input
                  style={{
                    width: "100%", height: 38, padding: "0 12px",
                    border: "1px solid var(--stone-200)", borderRadius: 7,
                    fontSize: 13, color: "var(--ink)", fontFamily: "monospace",
                    outline: "none", transition: "border-color .15s",
                  }}
                  placeholder="https://example.com"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = "#1d4ed8"}
                  onBlur={e => e.target.style.borderColor = "var(--stone-200)"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--stone-600)" }}>Capture frequency</label>
                <select
                  style={{
                    width: "100%", height: 38, padding: "0 12px",
                    border: "1px solid var(--stone-200)", borderRadius: 7,
                    fontSize: 14, color: "var(--ink)", fontFamily: "inherit",
                    outline: "none", appearance: "none", cursor: "pointer",
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A9790' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
                    paddingRight: 32,
                  }}
                  value={form.schedule}
                  onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                >
                  {SCHEDULES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <p style={{ fontSize: 12, color: "var(--stone-400)" }}>Automatic captures run on the cloud scheduler.</p>
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--stone-100)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{
                padding: "8px 18px", borderRadius: 7,
                border: "1px solid var(--stone-200)", background: "#fff",
                color: "var(--stone-600)", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}>
                Cancel
              </button>
              <button
                onClick={addUrl}
                disabled={formBusy || !form.name || !form.url || form.url === "https://"}
                style={{
                  padding: "8px 20px", borderRadius: 7,
                  border: "none", background: "var(--ink)", color: "#fff",
                  fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  opacity: (formBusy || !form.name || !form.url || form.url === "https://") ? .5 : 1,
                }}
              >
                {formBusy ? "Adding…" : "Add URL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCROLLABLE PAGE VIEWER ── */}
      {lightbox && (
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
            style={{
              height: 54, flexShrink: 0,
              background: "#fff", borderBottom: "1px solid var(--stone-200)",
              padding: "0 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 1 }}>
                  {fDate(lightbox.captured_at)} at {fTime(lightbox.captured_at)}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--stone-400)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {sel?.url}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {lightbox.file_size && (
                <span style={{ fontSize: 12, color: "var(--stone-400)", background: "var(--stone-100)", border: "1px solid var(--stone-200)", borderRadius: 99, padding: "3px 10px" }}>
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
                  border: "1px solid var(--stone-200)", background: "#fff",
                  color: "var(--stone-600)", fontSize: 13, textDecoration: "none",
                  transition: "all .12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--stone-300)"; e.currentTarget.style.color = "var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--stone-600)"; }}
              >
                <Icon n="download" size={13} />
                Download
              </a>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 7,
                  border: "1px solid var(--stone-200)", background: "#fff",
                  color: "var(--stone-400)", cursor: "pointer", transition: "all .12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--stone-200)"; e.currentTarget.style.color = "var(--stone-400)"; }}
              >
                <Icon n="x" size={14} />
              </button>
            </div>
          </div>

          <div
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, overflowY: "auto", overflowX: "auto",
              display: "flex", justifyContent: "center",
              background: "#111", padding: "24px",
            }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: 1440 }}>
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
                  fontSize: 11.5, color: "#888", fontFamily: "monospace",
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
                <p style={{ fontSize: 11.5, color: "#666", fontFamily: "monospace" }}>
                  Captured by Snapstore · {fDate(lightbox.captured_at)} at {fTime(lightbox.captured_at)}
                </p>
              </div>
            </div>
          </div>

          <ScrollHint />
        </div>
      )}

      <Toasts list={toasts} />
    </>
  );
}