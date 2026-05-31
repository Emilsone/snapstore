"use client";
import styles from "./LandingPage.module.css";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className={styles.canvas}>
      <Nav />
      <Hero />
      <section><SocialProof /></section>
      <Features />
      <HowItWorks />
      <section><Testimonials /></section>
      <section><FAQ /></section>
      <CTABanner />
      <Footer />
    </div>
  );
}