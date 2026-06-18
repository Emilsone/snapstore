"use client";
import Link from "next/link";
import FadeUp from "./FadeUp";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

export default function CTABanner() {
    const w = useWindowWidth();
    const isMobile = w < 768;

    return (
        <section className={cx(styles.ctaSection, isMobile && styles.mobile)}>
            <FadeUp>
                <h2 className={cx(styles.serif, styles.ctaTitle, isMobile && styles.mobile)}>
                    Stop losing track of<br />how your pages looked.
                </h2>
                <p className={cx(styles.ctaDesc, isMobile && styles.mobile)}>
                    Set up Snapstore in under 5 minutes. Your first snapshot is one click away.
                </p>
                <Link href="/login" className={cx(styles.ctaButton, isMobile && styles.mobile)}>
                    Start Tracking →
                </Link>
            </FadeUp>
        </section>
    );
}