"use client";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

export default function Footer() {
    const w = useWindowWidth();
    const isMobile = w < 768;

    return (
        <footer className={cx(styles.footerMain, isMobile && styles.mobile)}>
            <div className={cx(styles.footerContainer, isMobile && styles.mobile)}>
                <div className={styles.footerLogoWrap}>
                    <div className={styles.footerIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" />
                        </svg>
                    </div>
                    <span className={cx(styles.serif, styles.footerLogoText)}>Snapstore</span>
                </div>
                <div className={cx(styles.footerLinks, isMobile && styles.mobile)}>
                    {[["Features", "#features"], ["How it works", "#how-it-works"], ["Documentation"]].map(([l, h]) => (
                        <a key={l} href={h} className={styles.footerLinkItem}>{l}</a>
                    ))}
                </div>
                <p className={styles.footerCopyright}>© 2026 Snapshot. All rights reserved.</p>
            </div>
        </footer>
    );
}