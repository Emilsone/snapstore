"use client";
import Link from "next/link";
import { useWindowWidth } from "../hooks/useWindowWidth";
import styles from "../LandingPage.module.css";

export default function Hero() {
    const w = useWindowWidth();
    const isMobile = w < 768;
    const isTablet = w < 1024;

    return (
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
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "#fff", padding: isMobile ? "12px 22px" : "13px 28px", borderRadius: "var(--r-md)", fontSize: isMobile ? 14 : 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,.15)", transition: "transform .15s, box-shadow .15s" }}
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

                {/* Desktop browser mockup */}
                {!isMobile && (
                    <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--rule)", boxShadow: "0 40px 100px rgba(0,0,0,.1)", animation: "fadeUp .8s ease .4s both", background: "var(--surface)" }}>
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

                {/* Mobile mockup */}
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
    );
}