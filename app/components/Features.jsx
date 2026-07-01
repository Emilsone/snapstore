"use client";
import FadeUp from "./FadeUp";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

const FEATURES = [
    { icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2", title: "Automatic scheduling", desc: "Set a URL once. Snapstore captures it automatically, every hour, day, week, or month, no reminders, no missing a change.", color: "#EEF3FD", stroke: "#1D4ED8" },
    { icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15", title: "Full visual history", desc: " Every capture is saved with a precise timestamp and stored permanently. Browse your archive in a clean grid to see exactly how a page looked on any date.", color: "#F0FDF4", stroke: "#166534" },
    { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3", title: "Download any snapshot", desc: " Captures are saved as high-resolution, 1440px wide PNGs. Get instant, one-click downloads ready to share, use, or archive whenever you need them.", color: "#FEF9EE", stroke: "#92400E" },
    {
        icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
        title: "Smart organization",
        desc: "Group URLs by project, client, or environment. Use tags to keep your staging, production, and competitor archives neatly organized.",
        color: "#FDF2F8",
        stroke: "#9D174D"
    },
    {
        icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Instant captures", desc: "Don't wait for a schedule. Hit Capture now and get a full-page screenshot of any webpage in seconds, on demand, any time you need it.", color: "#ECFDF5", stroke: "#065F46"
    },
    { icon: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z", title: "Access from anywhere", desc: "Your archive lives in the cloud. Open your Snapstore dashboard to access from any browser, any device, when you need them.", color: "#EFF6FF", stroke: "#1D4ED8" },
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