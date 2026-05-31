"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useWindowWidth } from "../hooks/useWindowWidth";
import styles from "../LandingPage.module.css";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const w = useWindowWidth();
    const isMobile = w < 768;

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: scrolled || menuOpen ? "rgba(255,255,255,.96)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled || menuOpen ? "1px solid var(--rule)" : "1px solid transparent",
            transition: "all .3s ease",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
    );
}