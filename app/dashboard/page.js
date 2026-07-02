"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Archive from "./components/Archive";
import Settings from "./components/Settings";
import Support from "./components/Support";
import AddUrlModal from "./components/AddUrlModal";
import Lightbox from "./components/Lightbox";
import Toasts from "./components/Toasts";

const SCHEDULES = [
  { value: "hourly", label: "Every hour" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
];

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
  const [form, setForm] = useState({ name: "", url: "", schedule: "daily" });
  const [formBusy, setFormBusy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeNav, setActiveNav] = useState("archive");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    let cleanUrl = form.url.trim();
    cleanUrl = cleanUrl.replace(/^https?:\/\/(https?:\/\/)/i, "$1");
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
      setForm({ name: "", url: "", schedule: "daily" });
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

  return (
    <>
      <style>{`
        .db-sidebar-btn:hover { background: var(--overlay) !important; }
        .db-nav-item { transition: background .12s, color .12s; }
        .db-nav-item:hover { background: var(--overlay) !important; color: var(--ink) !important; }
        .profile-dropdown { animation: fadeIn .15s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        .skeleton { background: linear-gradient(90deg, #f0efed 25%, #faf9f7 50%, #f0efed 75%); background-size:400px 100%; animation:shimmer 1.4s ease infinite; border-radius:6px; }
        .fade-in { animation: fadeIn .3s ease both; }
        .snap-card { transition: box-shadow .2s, transform .2s; }
        .snap-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }
        
        /* Responsive Dashboard Layout */
        .db-sidebar { transition: transform .3s cubic-bezier(0.4, 0, 0.2, 1); }
        @media (max-width: 768px) {
          .db-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            z-index: 50 !important;
            transform: translateX(-100%) !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.1);
          }
          .db-sidebar.open {
            transform: translateX(0) !important;
          }
          .db-overlay {
            display: block !important;
            position: fixed !important;
            inset: 0 !important;
            top: 0 !important;
            background: rgba(0,0,0,.4) !important;
            z-index: 49 !important;
            backdrop-filter: blur(2px) !important;
            animation: fadeIn .2s ease !important;
          }
          /* Mobile: Allow main to scroll horizontally if needed, prevent page-level overflow */
          .mobile-menu-btn { display: flex !important; }
          .url-count-badge { display: none !important; }
          /* Archive hero responsive */
          .archive-hero-inner { flex-direction: column !important; }
          .archive-actions { flex-wrap: wrap !important; width: 100% !important; }
          .archive-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .archive-grid { grid-template-columns: 1fr !important; }
          .archive-padding { padding: 16px !important; }
          .archive-hero-wrap { padding: 16px 16px 0 !important; }
          /* Snapshot card footer */
          .snap-footer { flex-wrap: wrap !important; }
          /* Lightbox */
          .lightbox-header { flex-wrap: wrap !important; gap: 8px !important; }
          .lightbox-url { display: none !important; }
        }
      `}</style>

      {/* ── NEW LAYOUT ── */}
      <div style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "var(--canvas, #F9F8F6)"
      }}>
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          urls={urls}
          loading={loading}
          sel={sel}
          pick={pick}
          logout={logout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Header
            urlsCount={urls.length}
            setShowAdd={setShowAdd}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            logout={logout}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            sel={sel}
          />

          {/* ── MAIN PANEL ── */}
          <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
              {activeNav === "settings" && <Settings />}
              {activeNav === "support" && <Support />}
              {activeNav === "archive" && (
                <Archive
                  sel={sel}
                  toggleActive={toggleActive}
                  capture={capture}
                  capturing={capturing}
                  deleteUrl={deleteUrl}
                  delUrlId={delUrlId}
                  shots={shots}
                  shotsLoad={shotsLoad}
                  setLightbox={setLightbox}
                  deleteShot={deleteShot}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {showAdd && (
        <AddUrlModal
          setShowAdd={setShowAdd}
          form={form}
          setForm={setForm}
          formBusy={formBusy}
          addUrl={addUrl}
          SCHEDULES={SCHEDULES}
        />
      )}

      <Lightbox
        lightbox={lightbox}
        setLightbox={setLightbox}
        sel={sel}
      />

      <Toasts list={toasts} />
    </>
  );
}