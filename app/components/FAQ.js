"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Do I need any technical experience to set up Snapstore?",
    a: "You need basic comfort with a terminal. If you can type commands like 'npm install' you're good. The whole setup takes under 5 minutes — unzip, install, add your credentials, run. That's it.",
  },
  {
    q: "What do I need installed on my machine?",
    a: "Two things: Node.js (free, from nodejs.org) and Google Chrome (which you probably already have). Snapstore uses Chrome under the hood to render and screenshot pages exactly as they appear in a browser.",
  },
  {
    q: "Can it screenshot pages that require a login?",
    a: "Yes, if you run Snapstore on your own machine. Because it uses your local Chrome, it has access to your existing browser sessions and cookies — so any page you're logged into will capture correctly.",
  },
  {
    q: "Where are my screenshots stored?",
    a: "Everything stays on your machine. Screenshots are saved as PNG files in the public/screenshots folder inside your Snapstore project. The database is a single SQLite file in the data folder. No cloud, no third party.",
  },
  {
    q: "How often can it take screenshots?",
    a: "You can set any URL to capture every hour, every day, every week, or every month. You can also trigger a manual capture at any time by clicking 'Capture now' in the dashboard.",
  },
  {
    q: "Can I host Snapstore online so it runs 24/7?",
    a: "Yes. Snapstore comes with a Dockerfile and Railway config out of the box. Deploy it to Railway (free tier available), add your environment variables, and it runs continuously in the cloud without your laptop needing to be on.",
  },
  {
    q: "Is there a limit to how many URLs I can track?",
    a: "No limits at all. Track as many pages as your storage can hold. There are no artificial caps — you own the software and the data.",
  },
  {
    q: "Will Snapstore always be free?",
    a: "The self-hosted version is free and always will be. It's open source — you can inspect every line of code. A hosted cloud version with extra features may come later, but the core tool stays free.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  function toggle(i) {
    setOpen(o => o === i ? null : i);
  }

  return (
    <section style={{
      padding: "100px 28px",
      borderTop: "1px solid rgba(255,255,255,.06)",
      background: "rgba(255,255,255,.015)",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{
            fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,.3)",
            letterSpacing: ".1em", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            FAQ
          </p>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            color: "#fff", letterSpacing: "-.025em",
            lineHeight: 1.1,
          }}>
            Questions you probably have
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: open === i
                  ? "rgba(255,255,255,.05)"
                  : "rgba(255,255,255,.03)",
                border: `1px solid ${open === i
                  ? "rgba(255,255,255,.12)"
                  : "rgba(255,255,255,.07)"}`,
                borderRadius: 10,
                overflow: "hidden",
                transition: "all .2s ease",
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "18px 20px",
                  background: "none", border: "none",
                  cursor: "pointer",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", gap: 16,
                }}
              >
                <span style={{
                  fontSize: 14.5, fontWeight: 500,
                  color: open === i ? "#fff" : "rgba(255,255,255,.7)",
                  transition: "color .2s", lineHeight: 1.4,
                }}>
                  {faq.q}
                </span>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: open === i
                    ? "rgba(255,255,255,.1)"
                    : "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all .2s ease",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="rgba(255,255,255,.5)"
                    strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
              </button>

              {/* Answer */}
              {open === i && (
                <div style={{
                  padding: "0 20px 20px",
                  animation: "faqOpen .2s ease",
                }}>
                  <style>{`@keyframes faqOpen { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
                  <p style={{
                    fontSize: 14, color: "rgba(255,255,255,.45)",
                    lineHeight: 1.75,
                    borderTop: "1px solid rgba(255,255,255,.06)",
                    paddingTop: 16,
                  }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.3)", marginBottom: 16 }}>
            Still have questions?
          </p>
          <a
            href="mailto:hello@snapstore.app"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 14, color: "rgba(255,255,255,.5)",
              border: "1px solid rgba(255,255,255,.1)",
              padding: "9px 20px", borderRadius: 8,
              textDecoration: "none", transition: "all .15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(255,255,255,.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            hello@snapstore.app
          </a>
        </div>
      </div>
    </section>
  );
}
