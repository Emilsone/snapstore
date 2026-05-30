"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SocialProof from "./components/SocialProof";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import styles from "./LandingPage.module.css";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function useWindowWidth() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

const DEMO_STEPS = [
  { label: "Add a URL", desc: "Paste any URL and give it a name" },
  { label: "Set a schedule", desc: "Choose how often to capture" },
  { label: "Capture runs", desc: "Snapstore takes a full-page screenshot" },
  { label: "Browse archive", desc: "See every version of the page over time" },
];

function FadeUp({ children, delay = 0, style: s }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`${styles.fadeUpBox} ${inView ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}s`, ...s }}
    >
      {children}
    </div>
  );
}

function DemoAdd() {
  const [typed, setTyped] = useState("");
  const [named, setNamed] = useState("");
  const url = "https://myportfolio.com";
  const name = "My Portfolio";

  useEffect(() => {
    setTyped(""); setNamed("");
    let i = 0;
    const t1 = setInterval(() => {
      i++; setTyped(url.slice(0, i));
      if (i >= url.length) { clearInterval(t1); typeN(); }
    }, 38);
    function typeN() {
      let j = 0;
      const t2 = setInterval(() => {
        j++; setNamed(name.slice(0, j));
        if (j >= name.length) clearInterval(t2);
      }, 55);
    }
    return () => clearInterval(t1);
  }, []);

  return (
    <div className={`${styles.flexCol} ${styles.gap14}`}>
      <div className={`${styles.flexCol} ${styles.gap5}`}>
        <p className={styles.labelText}>URL</p>
        <div className={`${styles.inputMock} ${styles.monospaceFont} ${styles.urlActive}`}>
          {typed}<span className={styles.cursorBlink} />
        </div>
      </div>
      <div className={`${styles.flexCol} ${styles.gap5}`}>
        <p className={styles.labelText}>Label</p>
        <div className={styles.inputMock}>
          {named || <span style={{ color: "var(--ink-4)" }}>e.g. My Portfolio</span>}
        </div>
      </div>
    </div>
  );
}

function DemoSchedule() {
  const [selected, setSelected] = useState(null);
  const opts = ["Every hour", "Every day", "Every week", "Every month"];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setSelected(opts[i % opts.length]); i++;
      if (i >= opts.length) clearInterval(t);
    }, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`${styles.flexCol} ${styles.gap8}`}>
      {opts.map(o => {
        const isSel = selected === o;
        return (
          <div key={o} className={`${styles.schedOption} ${isSel ? styles.selected : ""}`}>
            <span className={`${styles.schedText} ${isSel ? styles.selected : ""}`}>{o}</span>
            {isSel && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DemoCapture() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setProgress(0); setDone(false);
    let p = 0;
    const t = setInterval(() => {
      p += 1.4; setProgress(Math.min(p, 100));
      if (p >= 100) { clearInterval(t); setTimeout(() => setDone(true), 300); }
    }, 22);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`${styles.flexCol} ${styles.gap16} ${styles.alignCenter} ${styles.pt8}`}>
      <div className={`${styles.statusIconWrap} ${done ? styles.done : ""}`}>
        {done
          ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" style={{ animation: "popIn .3s ease" }}><polyline points="20 6 9 17 4 12" /></svg>
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.75" strokeLinecap="round" style={{ animation: "spin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
        }
      </div>
      <div className={styles.progressBg}>
        <div className={`${styles.progressBar} ${done ? styles.done : ""}`} style={{ width: `${progress}%` }} />
      </div>
      <p className={`${styles.statusText} ${done ? styles.done : ""}`}>
        {done ? "Screenshot saved ✓" : `Capturing… ${Math.round(progress)}%`}
      </p>
    </div>
  );
}

function DemoArchive() {
  const [visible, setVisible] = useState(0);
  const shots = [
    { date: "25 May 2026", bg: "#EEF3FD", accent: "#93C5FD" },
    { date: "18 May 2026", bg: "#F0FDF4", accent: "#86EFAC" },
    { date: "11 May 2026", bg: "#FEF9EE", accent: "#FCD34D" },
    { date: "4 May 2026", bg: "#FDF2F8", accent: "#F9A8D4" },
  ];

  useEffect(() => {
    setVisible(0); let i = 0;
    const t = setInterval(() => { i++; setVisible(i); if (i >= shots.length) clearInterval(t); }, 300);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`${styles.grid2} ${styles.gap8}`}>
      {shots.map((s, i) => (
        <div key={i} className={`${styles.archiveCard} ${i < visible ? styles.visible : ""}`}>
          <div style={{ height: 52, background: s.bg }} className={`${styles.flexCenter} ${styles.gap5}`}>
            <div style={{ background: s.accent }} className={styles.pillLarge} />
            <div style={{ background: s.accent }} className={styles.pillSmall} />
          </div>
          <div className={styles.archiveCardFooter}>
            <p className={styles.archiveDate}>{s.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const DEMO_CONTENT = [<DemoAdd key="add" />, <DemoSchedule key="sched" />, <DemoCapture key="cap" />, <DemoArchive key="arch" />];

function AnimatedDemo() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView(0.2);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    if (!auto || !inView) return;
    const t = setInterval(() => setStep(s => (s + 1) % DEMO_STEPS.length), 3200);
    return () => clearInterval(t);
  }, [auto, inView]);

  return (
    <div ref={ref} className={`${styles.gridDemo} ${isMobile ? styles.mobile : ""}`}>
      <div className={`${styles.flexCol} ${styles.gap6}`}>
        {DEMO_STEPS.map((s, i) => {
          const isActive = step === i;
          return (
            <button
              key={i}
              onClick={() => { setStep(i); setAuto(false); }}
              className={`${styles.stepBtn} ${isActive ? styles.active : ""} ${isMobile ? styles.mobile : ""}`}
            >
              <div className={`${styles.stepNumber} ${isActive ? styles.active : ""}`}>
                {i + 1}
              </div>
              <div>
                <p className={`${styles.stepLabel} ${isActive ? styles.active : ""} ${isMobile ? styles.mobile : ""}`}>{s.label}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            </button>
          );
        })}
        {auto && inView && (
          <div className={styles.stepProgressBg}>
            <div key={step} className={styles.stepProgressFill} />
          </div>
        )}
      </div>

      <div className={`${styles.previewPanel} ${isMobile ? styles.mobile : ""}`}>
        <div className={`${styles.flexCenter} ${styles.gap8} ${styles.justifyStart}`}>
          <div className={styles.pulseIndicator} />
          <p className={styles.previewMeta}>
            Step {step + 1} of {DEMO_STEPS.length}
          </p>
        </div>
        <div key={step} className={styles.previewContentWrapper}>
          {DEMO_CONTENT[step]}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w < 1024;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  return (
    <div className={styles.canvas}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled || menuOpen ? "rgba(255,255,255,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--rule)" : "1px solid transparent",
        transition: "all .3s ease",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, background: "var(--ink)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" />
              </svg>
            </div>
            <span className={styles.serif} style={{ fontSize: 20, color: "var(--ink)", letterSpacing: "-.015em" }}>Snapstore</span>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <a href="#features" className={styles.navLink}>Features</a>
              <a href="#how-it-works" className={styles.navLink}>How it works</a>
              <a href="#" className={styles.navLink}>Documentation</a>
              <div style={{ width: 1, height: 20, background: "var(--rule)", margin: "0 8px" }} />
              <Link href="/login" className={styles.navLink}>Sign in</Link>
              <Link href="/login" style={{ fontSize: 14, fontWeight: 500, background: "var(--ink)", color: "#fff", padding: "7px 18px", borderRadius: "var(--r-sm)", textDecoration: "none", marginLeft: 4, transition: "background .12s" }}>
                Get started →
              </Link>
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink)", display: "flex", alignItems: "center" }}>
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              }
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid var(--rule)" }}>
            <a href="#features" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#how-it-works" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>Documentation</a>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/login" style={{ display: "block", textAlign: "center", padding: "11px", borderRadius: "var(--r-sm)", border: "1px solid var(--rule)", fontSize: 15, color: "var(--ink-2)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
              <Link href="/login" style={{ display: "block", textAlign: "center", padding: "11px", borderRadius: "var(--r-sm)", background: "var(--ink)", fontSize: 15, color: "#fff", textDecoration: "none", fontWeight: 500 }}>Get started →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className={styles.heroGrad} style={{ padding: isMobile ? "122px 20px 52px" : "158px 28px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Headline */}
          <h1 className={styles.serif} style={{ fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(42px, 7vw, 80px)", color: "var(--ink)", lineHeight: 1.05, letterSpacing: "-.035em", maxWidth: 820, margin: "0 auto 24px", animation: "fadeUp .7s ease .1s both" }}>
            Watch your pages,<br />
            <span style={{ color: "var(--ink-3)" }}>Remember how they looked.</span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: isMobile ? 16 : "clamp(16px, 2.2vw, 20px)", color: "var(--ink-2)", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 36px", animation: "fadeUp .7s ease .2s both" }}>
            Snapstore automatically screenshots any webpage on a schedule and builds a visual archive you can browse, compare, and download anytime.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: isMobile ? 44 : 64, animation: "fadeUp .7s ease .3s both" }}>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "#fff", padding: isMobile ? "12px 22px" : "13px 28px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(29,78,216,.25)", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.15)"; }}
            >
              Start archiving free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <a
              href="#how-it-works"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "var(--ink-2)", border: "1px solid var(--rule)", padding: isMobile ? "12px 22px" : "13px 28px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 500, textDecoration: "none", backdropFilter: "blur(8px)", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--rule-mid)"; e.currentTarget.style.background = "var(--overlay)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--ink-2)"; e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
              See how it works
            </a>
          </div>

          {/* Browser mockup — hidden on small mobile */}
          {!isMobile && (
            <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--rule)", boxShadow: "0 40px 100px rgba(0,0,0,.1)", animation: "fadeUp .8s ease .4s both", background: "var(--surface)" }}>
              {/* Browser bar */}
              <div style={{ background: "var(--overlay)", borderBottom: "1px solid var(--rule)", padding: "13px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", gap: 7 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, maxWidth: 320, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-sm)", padding: "5px 12px", fontSize: 12, color: "var(--ink-3)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  snapstore.app/dashboard
                </div>
              </div>

              <div style={{ display: "flex", height: isTablet ? 340 : 420 }}>
                {/* Sidebar */}
                {!isTablet && (
                  <div style={{ width: 200, borderRight: "1px solid var(--rule)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid var(--rule)" }}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".07em", textTransform: "uppercase" }}>Tracked URLs</p>
                    </div>
                    <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                      {[
                        { name: "My Portfolio", url: "myportfolio.com", active: true, shots: 24, sel: true },
                        { name: "Company Blog", url: "blog.acme.co", active: true, shots: 12, sel: false },
                        { name: "Competitor A", url: "rival.io", active: true, shots: 31, sel: false },
                        { name: "Landing page", url: "product.io", active: false, shots: 8, sel: false },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "9px 10px", borderRadius: "var(--r-sm)", background: item.sel ? "var(--overlay)" : "transparent", display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.active ? "#22C55E" : "var(--ink-4)", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: item.sel ? 500 : 400, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                            <p style={{ fontSize: 10, color: "var(--ink-2)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</p>
                          </div>
                          <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{item.shots}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main */}
                <div style={{ flex: 1, background: "var(--canvas)", overflowY: "hidden" }}>
                  <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--rule)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                        <p className={styles.serif} style={{ fontSize: 14, color: "var(--ink)" }}>My Portfolio</p>
                        <span style={{ fontSize: 10, background: "var(--green-bg)", color: "var(--green)", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>Active</span>
                        <span style={{ fontSize: 10, background: "var(--blue-bg)", color: "var(--blue)", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>daily</span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--ink-2)", fontFamily: "monospace" }}>myportfolio.com · 24 snapshots</p>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--ink)", color: "#fff", padding: "6px 12px", borderRadius: "var(--r-sm)", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
                      Capture now
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: `repeat(${isTablet ? 3 : 4}, 1fr)`, gap: 10 }}>
                    {[
                      { date: "25 May", bg: "#EEF3FD", bar: "#93C5FD" },
                      { date: "24 May", bg: "#F0FDF4", bar: "#86EFAC" },
                      { date: "23 May", bg: "#FEF9EE", bar: "#FCD34D" },
                      { date: "22 May", bg: "#FDF2F8", bar: "#F9A8D4" },
                    ].slice(0, isTablet ? 3 : 4).map((s, i) => (
                      <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                        <div style={{ height: isTablet ? 60 : 72, background: s.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <div style={{ width: 36, height: 4, background: s.bar, borderRadius: 99 }} />
                          <div style={{ width: 24, height: 3, background: s.bar, opacity: .5, borderRadius: 99 }} />
                          <div style={{ width: 30, height: 3, background: s.bar, opacity: .3, borderRadius: 99 }} />
                        </div>
                        <div style={{ padding: "7px 9px" }}>
                          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>{s.date}</p>
                          <p style={{ fontSize: 10, color: "var(--ink-2)" }}>09:00</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile mockup — simplified */}
          {isMobile && (
            <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid var(--rule)", boxShadow: "0 20px 60px rgba(0,0,0,.08)", animation: "fadeUp .8s ease .4s both", background: "var(--surface)" }}>
              <div style={{ background: "var(--overlay)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--rule)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 4, padding: "4px 10px", fontSize: 10.5, color: "var(--ink-3)", fontFamily: "monospace" }}>
                  snapstore.app/dashboard
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p className={styles.serif} style={{ fontSize: 13, color: "var(--ink)", marginBottom: 2 }}>My Portfolio</p>
                    <p style={{ fontSize: 10, color: "var(--ink-2)", fontFamily: "monospace" }}>myportfolio.com · 24 snapshots</p>
                  </div>
                  <div style={{ fontSize: 11, background: "var(--ink)", color: "#fff", fontWeight: 600, padding: "5px 10px", borderRadius: "var(--r-sm)" }}>Capture now</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { date: "25 May", bg: "#EEF3FD", bar: "#93C5FD" },
                    { date: "24 May", bg: "#F0FDF4", bar: "#86EFAC" },
                    { date: "23 May", bg: "#FEF9EE", bar: "#FCD34D" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: 48, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 24, height: 3, background: s.bar, borderRadius: 99 }} />
                      </div>
                      <div style={{ padding: "5px 7px" }}>
                        <p style={{ fontSize: 9.5, fontWeight: 500, color: "var(--ink)" }}>{s.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section><SocialProof /></section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className={`${styles.featuresSection} ${isMobile ? styles.mobile : ""}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className={`${styles.sectionHeader} ${isMobile ? styles.mobile : ""}`}>
              <p className={styles.sectionMetaTag}>Features</p>
              <h2 className={`${styles.serif} ${styles.sectionTitle} ${isMobile ? styles.mobile : ""}`}>
                Everything your archive needs
              </h2>
              <p className={`${styles.sectionDesc} ${isMobile ? styles.mobile : ""}`}>
                Built to do one thing perfectly, keep a visual record of any webpage over time.
              </p>
            </div>
          </FadeUp>
          <div className={`${styles.featuresGrid} ${isMobile ? styles.mobile : ""}`}>
            {[
              { icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2", title: "Automatic scheduling", desc: "Set a URL once. Snapstore captures it every hour, day, week, or month, no manual work.", color: "#EEF3FD", stroke: "#1D4ED8" },
              { icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15", title: "Full visual history", desc: "Every capture is stored with a timestamp. Browse your complete archive in a clean grid, forever.", color: "#F0FDF4", stroke: "#166534" },
              { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3", title: "Download any snapshot", desc: "Every screenshot is a full-res PNG. Download individual captures straight from the archive.", color: "#FEF9EE", stroke: "#92400E" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Password protection", desc: "Your archive is private. Protected by credentials only you set, no accounts, no third parties.", color: "#FDF2F8", stroke: "#9D174D" },
              { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", title: "Fully self-hosted", desc: "Runs on your machine or any server. No subscription, no data leaving your control, ever.", color: "#F5F3FF", stroke: "#6D28D9" },
              { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Instant captures", desc: "Don't wait for a schedule, hit Capture now and get a screenshot in seconds.", color: "#ECFDF5", stroke: "#065F46" },
            ].map((f, i) => (
              <FadeUp key={i} delay={isMobile ? 0 : i * 0.07}>
                <div className={styles.featureCard}>
                  <div style={{ background: f.color }} className={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="1.75" strokeLinecap="round"><path d={f.icon} /></svg>
                  </div>
                  <p className={styles.featureTitle}>{f.title}</p>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" className={`${styles.howItWorksSection} ${isMobile ? styles.mobile : ""}`}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div className={`${styles.howItWorksHeader} ${isMobile ? styles.mobile : ""}`}>
              <p className={styles.sectionMetaTag}>How it works</p>
              <h2 className={`${styles.serif} ${styles.sectionTitle} ${isMobile ? styles.mobile : ""}`}>
                From URL to archive in minutes
              </h2>
              <p className={`${styles.howItWorksDesc} ${isMobile ? styles.mobile : ""}`}>
                Watch each step happen live — no video needed.
              </p>
            </div>
          </FadeUp>
          <AnimatedDemo />
        </div>
      </section>

      <section><Testimonials /></section>
      <section><FAQ /></section>

      {/* ── CTA BANNER ──────────────────────────────────────────────── */}
      <section className={`${styles.ctaSection} ${isMobile ? styles.mobile : ""}`}>
        <FadeUp>
          <p className={styles.ctaMeta}>Get started today</p>
          <h2 className={`${styles.serif} ${styles.ctaTitle} ${isMobile ? styles.mobile : ""}`}>
            Stop losing track of<br />how your pages looked.
          </h2>
          <p className={`${styles.ctaDesc} ${isMobile ? styles.mobile : ""}`}>
            Set up Snapstore in under 5 minutes. Your first snapshot is one click away.
          </p>
          <Link href="/login" className={`${styles.ctaButton} ${isMobile ? styles.mobile : ""}`}>
            Open dashboard →
          </Link>
        </FadeUp>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className={`${styles.footerMain} ${isMobile ? styles.mobile : ""}`}>
        <div className={`${styles.footerContainer} ${isMobile ? styles.mobile : ""}`}>
          <div className={styles.footerLogoWrap}>
            <div className={styles.footerIcon}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" /></svg>
            </div>
            <span className={`${styles.serif} ${styles.footerLogoText}`}>Snapstore</span>
          </div>
          <div className={`${styles.footerLinks} ${isMobile ? styles.mobile : ""}`}>
            {[["Features", "#features"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"]].map(([l, h]) => (
              <a key={l} href={h} className={styles.footerLinkItem}>{l}</a>
            ))}
          </div>
          <p className={styles.footerCopyright}>© 2026 Snapshot. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}