"use client";
import FadeUp from "./FadeUp";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

const FEATURES = [
    { icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2", title: "Automatic scheduling", desc: "Set a URL once. Snapstore captures it automatically, every hour, day, week, or month, no reminders, no missing a change.", color: "#EEF3FD", stroke: "#1D4ED8" },
    {
        icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15", title: "Full visual history", desc: " Every capture is saved with a precise timestamp and stored permanently. Browse your complete screenshot archive in a clean grid and see exactly how any page looked on any date", color: "#F0FDF4", stroke: "#166534"
    },
    { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3", title: "Download any snapshot", desc: " Every screenshot is saved as a full-resolution PNG at 1440px wide. Download any capture instantly with one click, yours to keep, share, or archive forever.", color: "#FEF9EE", stroke: "#92400E" },
    { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Password protection", desc: "Your dashboard is private and secure. Protected by a username and password that only you control, no public access and no unauthorized captures.", color: "#FDF2F8", stroke: "#9D174D" },
    { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", title: "Fully self-hosted", desc: "Runs on your machine or any server. No subscription, no data leaving your control, ever.", color: "#F5F3FF", stroke: "#6D28D9" },
    {
        icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Instant captures", desc: "Don't wait for a schedule. Hit Capture now and get a full-page screenshot of any webpage in seconds — on demand, any time you need it.", color: "#ECFDF5", stroke: "#065F46"
    },
];

export default function Features() {
    const w = useWindowWidth();
    const isMobile = w < 768;

    return (
        <section id="features" className={cx(styles.featuresSection, isMobile && styles.mobile)}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <FadeUp>
                    <div className={cx(styles.sectionHeader, isMobile && styles.mobile)}>
                        <p className={styles.sectionMetaTag}>Features</p>
                        <h2 className={cx(styles.serif, styles.sectionTitle, isMobile && styles.mobile)}>
                            Everything your archive needs
                        </h2>
                        <p className={cx(styles.sectionDesc, isMobile && styles.mobile)}>
                            Built to do one thing perfectly, keep a visual record of any webpage over time.
                        </p>
                    </div>
                </FadeUp>
                <div className={cx(styles.featuresGrid, isMobile && styles.mobile)}>
                    {FEATURES.map((f, i) => (
                        <FadeUp key={i} delay={isMobile ? 0 : i * 0.07}>
                            <div className={styles.featureCard}>
                                <div style={{ background: f.color }} className={styles.iconContainer}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="1.75" strokeLinecap="round">
                                        <path d={f.icon} />
                                    </svg>
                                </div>
                                <p className={styles.featureTitle}>{f.title}</p>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
}