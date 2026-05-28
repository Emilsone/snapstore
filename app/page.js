"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

function FadeUp({ children, delay = 0, style: s }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
      ...s,
    }}>
      {children}
    </div>
  );
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
  { label: "Add a URL",      desc: "Paste any URL and give it a name"         },
  { label: "Set a schedule", desc: "Choose how often to capture"              },
  { label: "Capture runs",   desc: "Snapstore takes a full-page screenshot"   },
  { label: "Browse archive", desc: "See every version of the page over time"  },
];

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
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-2)" }}>URL</p>
        <div style={{ padding: "9px 12px", background: "var(--canvas)", border: "1.5px solid var(--blue)", borderRadius: "var(--r-sm)", fontSize: 13, fontFamily: "monospace", color: "var(--ink)", minHeight: 36, display: "flex", alignItems: "center" }}>
          {typed}<span style={{ borderRight: "2px solid var(--blue)", marginLeft: 1, animation: "blink 1s infinite" }}/>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-2)" }}>Label</p>
        <div style={{ padding: "9px 12px", background: "var(--canvas)", border: "1px solid var(--rule)", borderRadius: "var(--r-sm)", fontSize: 13, color: "var(--ink)", minHeight: 36, display: "flex", alignItems: "center" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {opts.map(o => (
        <div key={o} style={{
          padding: "10px 14px", borderRadius: "var(--r-sm)",
          border: `1.5px solid ${selected === o ? "var(--blue)" : "var(--rule)"}`,
          background: selected === o ? "var(--blue-bg)" : "var(--surface)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "all .25s ease",
        }}>
          <span style={{ fontSize: 13, color: selected === o ? "var(--blue)" : "var(--ink-2)", fontWeight: selected === o ? 500 : 400 }}>{o}</span>
          {selected === o && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
      ))}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", paddingTop: 8 }}>
      <div style={{ width: 64, height: 64, borderRadius: "var(--r-lg)", background: done ? "var(--green-bg)" : "var(--overlay)", border: `1.5px solid ${done ? "#86EFAC" : "var(--rule)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .4s ease" }}>
        {done
          ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" style={{ animation: "popIn .3s ease" }}><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.75" strokeLinecap="round" style={{ animation: "spin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        }
      </div>
      <div style={{ width: "100%", height: 6, background: "var(--overlay)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: done ? "#22C55E" : "var(--blue)", width: `${progress}%`, transition: "width .05s linear, background .4s ease" }}/>
      </div>
      <p style={{ fontSize: 13, color: done ? "var(--green)" : "var(--ink-2)", fontWeight: 500, transition: "color .3s" }}>
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
    { date: "4 May 2026",  bg: "#FDF2F8", accent: "#F9A8D4" },
  ];
  useEffect(() => {
    setVisible(0); let i = 0;
    const t = setInterval(() => { i++; setVisible(i); if (i >= shots.length) clearInterval(t); }, 300);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {shots.map((s, i) => (
        <div key={i} style={{ borderRadius: "var(--r-sm)", overflow: "hidden", border: "1px solid var(--rule)", opacity: i < visible ? 1 : 0, transform: i < visible ? "scale(1) translateY(0)" : "scale(.94) translateY(8px)", transition: "opacity .35s ease, transform .35s ease" }}>
          <div style={{ height: 52, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <div style={{ width: 28, height: 4, background: s.accent, borderRadius: 99 }}/>
            <div style={{ width: 14, height: 4, background: s.accent, opacity: .5, borderRadius: 99 }}/>
          </div>
          <div style={{ padding: "6px 8px", background: "var(--surface)" }}>
            <p style={{ fontSize: 10.5, fontWeight: 500, color: "var(--ink)" }}>{s.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const DEMO_CONTENT = [<DemoAdd key="add"/>, <DemoSchedule key="sched"/>, <DemoCapture key="cap"/>, <DemoArchive key="arch"/>];

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
    <div ref={ref} style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 24 : 48,
      alignItems: "center",
    }}>
      {/* Steps list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {DEMO_STEPS.map((s, i) => (
          <button key={i} onClick={() => { setStep(i); setAuto(false); }} style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            padding: isMobile ? "14px 14px" : "16px 18px",
            borderRadius: "var(--r-md)",
            border: `1.5px solid ${step === i ? "var(--rule-mid)" : "transparent"}`,
            background: step === i ? "var(--surface)" : "transparent",
            cursor: "pointer", textAlign: "left",
            transition: "all .2s ease",
            boxShadow: step === i ? "0 2px 12px rgba(0,0,0,.06)" : "none",
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: step === i ? "var(--ink)" : "var(--overlay)", border: `1px solid ${step === i ? "var(--ink)" : "var(--rule)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: step === i ? "#fff" : "var(--ink-3)", transition: "all .2s ease", marginTop: 1 }}>
              {i + 1}
            </div>
            <div>
              <p style={{ fontSize: isMobile ? 14 : 14.5, fontWeight: 500, color: step === i ? "var(--ink)" : "var(--ink-2)", marginBottom: 3, transition: "color .2s" }}>{s.label}</p>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </button>
        ))}
        {auto && inView && (
          <div style={{ height: 2, background: "var(--rule)", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
            <div key={step} style={{ height: "100%", background: "var(--ink)", borderRadius: 99, animation: "progress 3.2s linear forwards" }}/>
          </div>
        )}
      </div>

      {/* Preview panel */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-xl)", padding: isMobile ? "20px 16px" : "28px", minHeight: 280, boxShadow: "0 8px 32px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s ease infinite" }}/>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>
            Step {step + 1} of {DEMO_STEPS.length}
          </p>
        </div>
        <div key={step} style={{ animation: "stepIn .35s ease", flex: 1 }}>
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

  // close menu on resize
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", overflowX: "hidden" }}>
      <style>{`
        :root {
          --canvas: #F9F8F6; --surface: #FFFFFF; --overlay: #F2F1EF;
          --rule: #E4E2DE; --rule-mid: #D0CEC9;
          --ink: #1A1916; --ink-2: #5C5A55; --ink-3: #9A9790; --ink-4: #C4C2BC;
          --blue: #1D4ED8; --blue-bg: #EEF3FD;
          --green: #166534; --green-bg: #DCFCE7;
          --r-xs: 3px; --r-sm: 5px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px; --r-full: 999px;
        }
        .serif { font-family: 'Instrument Serif', Georgia, serif; }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes popIn    { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes stepIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes progress { from{width:0%} to{width:100%} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradientShift {
          0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
        }
        .hero-grad {
          background: linear-gradient(135deg,#f9f8f6 0%,#eef3fd 40%,#f0fdf4 70%,#fef9ee 100%);
          background-size: 300% 300%;
          animation: gradientShift 10s ease infinite;
        }
        .nav-link { font-size:13.5px;color:var(--ink-2);text-decoration:none;padding:6px 12px;border-radius:var(--r-sm);transition:all .12s; }
        .nav-link:hover { background:var(--overlay);color:var(--ink); }
        .feature-card { background:var(--surface);border:1px solid var(--rule);border-radius:var(--r-lg);padding:28px;transition:transform .25s ease,box-shadow .25s ease; }
        .feature-card:hover { transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08); }
        .stat-card { background:var(--surface);border:1px solid var(--rule);border-radius:var(--r-lg);padding:24px 28px;text-align:center; }
        .mobile-menu-link { display:block;padding:14px 20px;font-size:16px;color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--rule);transition:color .15s; }
        .mobile-menu-link:hover { color:var(--ink); }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled || menuOpen ? "rgba(255,255,255,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--rule)" : "1px solid transparent",
        transition: "all .3s ease",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, background: "var(--ink)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8M12 18v2"/>
              </svg>
            </div>
            <span className="serif" style={{ fontSize: 20, color: "var(--ink)", letterSpacing: "-.015em" }}>Snapstore</span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <div style={{ width: 1, height: 20, background: "var(--rule)", margin: "0 8px" }}/>
              <Link href="/login" className="nav-link">Sign in</Link>
              <Link href="/login" style={{ fontSize: 14, fontWeight: 500, background: "var(--ink)", color: "#fff", padding: "7px 18px", borderRadius: "var(--r-sm)", textDecoration: "none", marginLeft: 4, transition: "background .12s" }}>
                Get started →
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink)", display: "flex", alignItems: "center" }}>
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              }
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid var(--rule)" }}>
            <a href="#features"     className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing"      className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Pricing</a>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/login" style={{ display: "block", textAlign: "center", padding: "11px", borderRadius: "var(--r-sm)", border: "1px solid var(--rule)", fontSize: 15, color: "var(--ink-2)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
              <Link href="/login" style={{ display: "block", textAlign: "center", padding: "11px", borderRadius: "var(--r-sm)", background: "var(--ink)", fontSize: 15, color: "#fff", textDecoration: "none", fontWeight: 500 }}>Get started →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="hero-grad" style={{ padding: isMobile ? "64px 20px 52px" : "100px 28px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.8)", backdropFilter: "blur(8px)", border: "1px solid var(--rule)", borderRadius: "var(--r-full)", padding: "5px 14px", fontSize: 12.5, color: "var(--ink-2)", marginBottom: 28, animation: "fadeUp .6s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }}/>
            Self-hosted · No subscription · Your data
          </div>

          {/* Headline */}
          <h1 className="serif" style={{ fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(42px, 7vw, 80px)", color: "var(--ink)", lineHeight: 1.05, letterSpacing: "-.035em", maxWidth: 820, margin: "0 auto 24px", animation: "fadeUp .7s ease .1s both" }}>
            Watch your pages,<br/>
            <span style={{ color: "var(--ink-3)" }}>Remember how they looked.</span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: isMobile ? 16 : "clamp(16px, 2.2vw, 20px)", color: "var(--ink-2)", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 36px", animation: "fadeUp .7s ease .2s both" }}>
            Snapstore automatically screenshots any webpage on a schedule and builds a visual archive you can browse, compare, and download anytime.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: isMobile ? 44 : 64, animation: "fadeUp .7s ease .3s both" }}>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "#fff", padding: isMobile ? "12px 22px" : "13px 28px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 500, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,.15)", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.15)"; }}
            >
              Start archiving free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.8)", color: "var(--ink-2)", border: "1px solid var(--rule)", padding: isMobile ? "12px 22px" : "13px 28px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 500, textDecoration: "none", backdropFilter: "blur(8px)", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.color="var(--ink)"; e.currentTarget.style.borderColor="var(--rule-mid)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="var(--ink-2)"; e.currentTarget.style.borderColor="var(--rule)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              See how it works
            </a>
          </div>

          {/* Browser mockup — hidden on small mobile */}
          {!isMobile && (
            <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: "var(--r-xl)", overflow: "hidden", border: "1px solid var(--rule)", boxShadow: "0 40px 100px rgba(0,0,0,.1), 0 10px 30px rgba(0,0,0,.06)", animation: "fadeUp .8s ease .4s both", background: "var(--surface)" }}>
              {/* Browser bar */}
              <div style={{ background: "var(--overlay)", borderBottom: "1px solid var(--rule)", padding: "13px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", gap: 7 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }}/>)}
                </div>
                <div style={{ flex: 1, maxWidth: 320, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-sm)", padding: "5px 12px", fontSize: 12, color: "var(--ink-3)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
                        { name: "My Portfolio",  url: "myportfolio.com", active: true,  shots: 24, sel: true  },
                        { name: "Company Blog",  url: "blog.acme.co",    active: true,  shots: 12, sel: false },
                        { name: "Competitor A",  url: "rival.io",        active: true,  shots: 31, sel: false },
                        { name: "Landing page",  url: "product.io",      active: false, shots: 8,  sel: false },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "9px 10px", borderRadius: "var(--r-sm)", background: item.sel ? "var(--overlay)" : "transparent", display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.active ? "#22C55E" : "var(--ink-4)", flexShrink: 0 }}/>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: item.sel ? 500 : 400, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                            <p style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</p>
                          </div>
                          <span style={{ fontSize: 10, color: "var(--ink-4)" }}>{item.shots}</span>
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
                        <p className="serif" style={{ fontSize: 14, color: "var(--ink)" }}>My Portfolio</p>
                        <span style={{ fontSize: 10, background: "var(--green-bg)", color: "var(--green)", padding: "2px 8px", borderRadius: "var(--r-full)", fontWeight: 500 }}>Active</span>
                        <span style={{ fontSize: 10, background: "var(--blue-bg)", color: "var(--blue)", padding: "2px 8px", borderRadius: "var(--r-full)", fontWeight: 500 }}>daily</span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "monospace" }}>myportfolio.com · 24 snapshots</p>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--ink)", color: "#fff", padding: "6px 12px", borderRadius: "var(--r-sm)", fontSize: 12, flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
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
                      <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                        <div style={{ height: isTablet ? 60 : 72, background: s.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <div style={{ width: 36, height: 4, background: s.bar, borderRadius: 99 }}/>
                          <div style={{ width: 24, height: 3, background: s.bar, opacity: .5, borderRadius: 99 }}/>
                          <div style={{ width: 30, height: 3, background: s.bar, opacity: .3, borderRadius: 99 }}/>
                        </div>
                        <div style={{ padding: "7px 9px" }}>
                          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>{s.date}</p>
                          <p style={{ fontSize: 10, color: "var(--ink-3)" }}>09:00</p>
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
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--rule)", boxShadow: "0 20px 60px rgba(0,0,0,.08)", animation: "fadeUp .8s ease .4s both", background: "var(--surface)" }}>
              <div style={{ background: "var(--overlay)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--rule)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }}/>)}
                </div>
                <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 4, padding: "4px 10px", fontSize: 10.5, color: "var(--ink-3)", fontFamily: "monospace" }}>
                  snapstore.app/dashboard
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p className="serif" style={{ fontSize: 13, color: "var(--ink)", marginBottom: 2 }}>My Portfolio</p>
                    <p style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "monospace" }}>myportfolio.com · 24 snapshots</p>
                  </div>
                  <div style={{ fontSize: 11, background: "var(--ink)", color: "#fff", padding: "5px 10px", borderRadius: 5 }}>Capture now</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { date: "25 May", bg: "#EEF3FD", bar: "#93C5FD" },
                    { date: "24 May", bg: "#F0FDF4", bar: "#86EFAC" },
                    { date: "23 May", bg: "#FEF9EE", bar: "#FCD34D" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: 48, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 24, height: 3, background: s.bar, borderRadius: 99 }}/>
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

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 28px", background: "var(--surface)", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16 }}>
            {[
              { n: 0,   suffix: " mins",   label: "Setup time",        sub: "From zip to running"         },
              { n: 100, suffix: "%",        label: "Self-hosted",       sub: "Your data, your machine"     },
              { n: 4,   suffix: "",         label: "Schedules",         sub: "Hourly to monthly"           },
              { n: 0,   suffix: " limits",  label: "No URL limits",     sub: "Track as many as you want"   },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="stat-card">
                  <p className="serif" style={{ fontSize: isMobile ? 32 : 40, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 6 }}>
                    <Counter to={s.n} suffix={s.suffix}/>
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: isMobile ? "60px 20px" : "88px 28px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 60 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 12 }}>Features</p>
              <h2 className="serif" style={{ fontSize: isMobile ? 28 : "clamp(28px, 4vw, 42px)", color: "var(--ink)", letterSpacing: "-.025em", marginBottom: 14 }}>
                Everything your archive needs
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 16, color: "var(--ink-2)", maxWidth: 480, margin: "0 auto" }}>
                Built to do one thing perfectly — keep a visual record of any webpage over time.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? 14 : 20 }}>
            {[
              { icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2", title: "Automatic scheduling",  desc: "Set a URL once. Snapstore captures it every hour, day, week, or month — no manual work.",        color: "#EEF3FD", stroke: "#1D4ED8" },
              { icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15",                  title: "Full visual history",    desc: "Every capture is stored with a timestamp. Browse your complete archive in a clean grid, forever.", color: "#F0FDF4", stroke: "#166534" },
              { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",                     title: "Download any snapshot",  desc: "Every screenshot is a full-res PNG. Download individual captures straight from the archive.",       color: "#FEF9EE", stroke: "#92400E" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                           title: "Password protection",    desc: "Your archive is private. Protected by credentials only you set — no accounts, no third parties.",   color: "#FDF2F8", stroke: "#9D174D" },
              { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", title: "Fully self-hosted", desc: "Runs on your machine or any server. No subscription, no data leaving your control, ever.",        color: "#F5F3FF", stroke: "#6D28D9" },
              { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",                                                        title: "Instant captures",      desc: "Don't wait for a schedule — hit Capture now and get a screenshot in seconds.",                     color: "#ECFDF5", stroke: "#065F46" },
            ].map((f, i) => (
              <FadeUp key={i} delay={isMobile ? 0 : i * 0.07}>
                <div className="feature-card">
                  <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: f.color, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="1.75" strokeLinecap="round"><path d={f.icon}/></svg>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>{f.title}</p>
                  <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: isMobile ? "60px 20px" : "88px 28px", background: "var(--surface)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 12 }}>How it works</p>
              <h2 className="serif" style={{ fontSize: isMobile ? 28 : "clamp(28px, 4vw, 42px)", color: "var(--ink)", letterSpacing: "-.025em", marginBottom: 14 }}>
                From URL to archive in minutes
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 16, color: "var(--ink-2)", maxWidth: 440, margin: "0 auto" }}>
                Watch each step happen live — no video needed.
              </p>
            </div>
          </FadeUp>
          <AnimatedDemo/>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: isMobile ? "60px 20px" : "88px 28px", background: "var(--canvas)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 56 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
              <h2 className="serif" style={{ fontSize: isMobile ? 28 : "clamp(28px, 4vw, 42px)", color: "var(--ink)", letterSpacing: "-.025em", marginBottom: 14 }}>Free. Forever.</h2>
              <p style={{ fontSize: isMobile ? 15 : 16, color: "var(--ink-2)", maxWidth: 420, margin: "0 auto" }}>
                Snapstore is self-hosted and open source. You run it, you own it.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ maxWidth: 480, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.07)" }}>
              <div style={{ padding: isMobile ? "28px 24px 22px" : "36px 40px 28px", textAlign: "center", borderBottom: "1px solid var(--rule)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 16 }}>Self-hosted</p>
                <p className="serif" style={{ fontSize: isMobile ? 52 : 60, color: "var(--ink)", letterSpacing: "-.04em", lineHeight: 1 }}>$0</p>
                <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>No subscription. No credit card. Ever.</p>
              </div>
              <div style={{ padding: isMobile ? "22px 24px 28px" : "28px 40px 36px" }}>
                {["Unlimited URLs","Unlimited screenshots","All capture schedules","Full-res PNG downloads","Password protected","Runs on your machine","Open source"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--ink-2)" }}>{item}</p>
                  </div>
                ))}
                <Link href="/login" style={{ display: "block", textAlign: "center", marginTop: 24, background: "var(--ink)", color: "#fff", padding: "13px 24px", borderRadius: "var(--r-md)", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "background .12s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#2E2C28"}
                  onMouseLeave={e => e.currentTarget.style.background="var(--ink)"}
                >
                  Get started for free →
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--ink)", padding: isMobile ? "60px 20px" : "80px 28px", textAlign: "center" }}>
        <FadeUp>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 20 }}>Get started today</p>
          <h2 className="serif" style={{ fontSize: isMobile ? "clamp(24px,7vw,36px)" : "clamp(28px, 5vw, 50px)", color: "#fff", letterSpacing: "-.03em", marginBottom: 18, lineHeight: 1.1 }}>
            Stop losing track of<br/>how your pages looked.
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 16, color: "rgba(255,255,255,.5)", maxWidth: 400, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Set up Snapstore in under 5 minutes. Your first snapshot is one click away.
          </p>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "var(--ink)", padding: isMobile ? "12px 24px" : "14px 32px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 500, textDecoration: "none", transition: "opacity .15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity=".88"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >
            Open dashboard →
          </Link>
        </FadeUp>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--rule)", padding: isMobile ? "28px 20px" : "36px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 26, height: 26, background: "var(--ink)", borderRadius: "var(--r-xs)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8M12 18v2"/></svg>
            </div>
            <span className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>Snapstore</span>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 24, flexWrap: "wrap" }}>
            {[["Features","#features"],["How it works","#how-it-works"],["Pricing","#pricing"]].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color="var(--ink)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--ink-3)"}
              >{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-4)" }}>Self-hosted · Open source · No subscription</p>
        </div>
      </footer>
    </div>
  );
}
