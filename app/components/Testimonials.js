"use client";
import { useState } from "react";

const TESTIMONIALS = [
  {
    quote: "Snapstore saved me twice already. A client disputed changes we made to their site — I pulled up the archive and showed them exactly what it looked like before. Case closed.",
    name: "Marcus T.",
    role: "Freelance Web Developer",
    avatar: "MT",
    accent: "#6366F1",
  },
  {
    quote: "I track 12 competitor pages with Snapstore. Every Monday I check what changed over the week. It's become part of my research workflow and I can't imagine not having it.",
    name: "Priya K.",
    role: "Product Manager",
    avatar: "PK",
    accent: "#10B981",
  },
  {
    quote: "Setup took me under 5 minutes. I was expecting something complicated but it just works. The scheduled captures run in the background and I never have to think about it.",
    name: "Daniel O.",
    role: "Startup Founder",
    avatar: "DO",
    accent: "#F59E0B",
  },
  {
    quote: "We use Snapstore to archive our landing pages before and after every A/B test. Having a visual record of every version has been invaluable for our team.",
    name: "Sarah L.",
    role: "Growth Lead",
    avatar: "SL",
    accent: "#EC4899",
  },
  {
    quote: "The fact that it's self-hosted is the whole reason I use it. My screenshots stay on my machine. No subscription, no data going to some cloud I don't control.",
    name: "Alex R.",
    role: "Security Engineer",
    avatar: "AR",
    accent: "#06B6D4",
  },
  {
    quote: "I archive my portfolio every week. It's been running for 6 months and I now have this incredible visual history of how my work and site have evolved over time.",
    name: "Yemi A.",
    role: "UI/UX Designer",
    avatar: "YA",
    accent: "#8B5CF6",
  },
];

export default function Testimonials() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      padding: "100px 28px",
      borderTop: "1px solid rgba(255,255,255,.06)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{
            fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,.3)",
            letterSpacing: ".1em", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Testimonials
          </p>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            color: "#fff", letterSpacing: "-.025em",
            lineHeight: 1.1, marginBottom: 16,
          }}>
            People who stopped<br/>
            <em style={{ color: "rgba(255,255,255,.35)", fontStyle: "italic" }}>
              worrying about their pages
            </em>
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i
                  ? "rgba(255,255,255,.05)"
                  : "rgba(255,255,255,.03)",
                border: `1px solid ${hovered === i
                  ? "rgba(255,255,255,.12)"
                  : "rgba(255,255,255,.07)"}`,
                borderRadius: 14,
                padding: "24px",
                transition: "all .2s ease",
                transform: hovered === i ? "translateY(-3px)" : "translateY(0)",
                cursor: "default",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                    fill={t.accent} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 14, color: "rgba(255,255,255,.6)",
                lineHeight: 1.75, marginBottom: 22,
                fontStyle: "italic",
              }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: `${t.accent}22`,
                  border: `1px solid ${t.accent}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: t.accent,
                  flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{
                    fontSize: 13.5, fontWeight: 600, color: "#fff",
                    marginBottom: 2,
                  }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
