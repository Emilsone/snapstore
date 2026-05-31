"use client";
import { useState, useEffect } from "react";
import FadeUp from "./FadeUp";
import { useInView } from "../hooks/useInView";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

const DEMO_STEPS = [
    { label: "Add a URL", desc: "Paste any URL and give it a name" },
    { label: "Set a schedule", desc: "Choose how often to capture" },
    { label: "Capture runs", desc: "Snapstore takes a full-page screenshot" },
    { label: "Browse archive", desc: "See every version of the page over time" },
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
        <div className={cx(styles.flexCol, styles.gap14)}>
            <div className={cx(styles.flexCol, styles.gap5)}>
                <p className={styles.labelText}>URL</p>
                <div className={cx(styles.inputMock, styles.monospaceFont, styles.urlActive)}>
                    {typed}<span className={styles.cursorBlink} />
                </div>
            </div>
            <div className={cx(styles.flexCol, styles.gap5)}>
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
        <div className={cx(styles.flexCol, styles.gap8)}>
            {opts.map(o => {
                const isSel = selected === o;
                return (
                    <div key={o} className={cx(styles.schedOption, isSel && styles.selected)}>
                        <span className={cx(styles.schedText, isSel && styles.selected)}>{o}</span>
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
        <div className={cx(styles.flexCol, styles.gap16, styles.alignCenter, styles.pt8)}>
            <div className={cx(styles.statusIconWrap, done && styles.done)}>
                {done
                    ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" style={{ animation: "popIn .3s ease" }}><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.75" strokeLinecap="round" style={{ animation: "spin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                }
            </div>
            <div className={styles.progressBg}>
                <div className={cx(styles.progressBar, done && styles.done)} style={{ width: `${progress}%` }} />
            </div>
            <p className={cx(styles.statusText, done && styles.done)}>
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
        <div className={cx(styles.grid2, styles.gap8)}>
            {shots.map((s, i) => (
                <div key={i} className={cx(styles.archiveCard, i < visible && styles.visible)}>
                    <div style={{ height: 52, background: s.bg }} className={cx(styles.flexCenter, styles.gap5)}>
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
        <div ref={ref} className={cx(styles.gridDemo, isMobile && styles.mobile)}>
            <div className={cx(styles.flexCol, styles.gap6)}>
                {DEMO_STEPS.map((s, i) => {
                    const isActive = step === i;
                    return (
                        <button
                            key={i}
                            onClick={() => { setStep(i); setAuto(false); }}
                            className={cx(styles.stepBtn, isActive && styles.active, isMobile && styles.mobile)}
                        >
                            <div className={cx(styles.stepNumber, isActive && styles.active)}>
                                {i + 1}
                            </div>
                            <div>
                                <p className={cx(styles.stepLabel, isActive && styles.active, isMobile && styles.mobile)}>{s.label}</p>
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

            <div className={cx(styles.previewPanel, isMobile && styles.mobile)}>
                <div className={cx(styles.flexCenter, styles.gap8, styles.justifyStart)}>
                    <div className={styles.pulseIndicator} />
                    <p className={styles.previewMeta}>Step {step + 1} of {DEMO_STEPS.length}</p>
                </div>
                <div key={step} className={styles.previewContentWrapper}>
                    {DEMO_CONTENT[step]}
                </div>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    const w = useWindowWidth();
    const isMobile = w < 768;

    return (
        <section id="how-it-works" className={cx(styles.howItWorksSection, isMobile && styles.mobile)}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <FadeUp>
                    <div className={cx(styles.howItWorksHeader, isMobile && styles.mobile)}>
                        <p className={styles.sectionMetaTag}>How it works</p>
                        <h2 className={cx(styles.serif, styles.sectionTitle, isMobile && styles.mobile)}>
                            From URL to archive in minutes
                        </h2>
                        <p className={cx(styles.howItWorksDesc, isMobile && styles.mobile)}>
                            Watch each step happen live — no video needed.
                        </p>
                    </div>
                </FadeUp>
                <AnimatedDemo />
            </div>
        </section>
    );
}