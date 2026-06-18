"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Do I need any technical experience to set up Snapstore?",
    a: "You need basic comfort with a terminal. If you can type commands like 'npm install' you're good. The whole setup takes under 5 minutes, unzip, install, add your credentials, run. That's it.",
  },
  {
    q: "Can it screenshot pages that require a login?",
    a: "Yes, if you run Snapstore on your own machine. Because it uses your local Chrome, it has access to your existing browser sessions and cookies, so any page you're logged into will capture correctly.",
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
    q: "Is there a limit to how many URLs I can track?",
    a: "No limits at all. Track as many pages as your storage can hold. There are no artificial caps, you own the software and the data.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  function toggle(i) {
    setOpen((o) => (o === i ? null : i));
  }

  return (
    <section
      style={{
        padding: "70px 28px",
        borderTop: "1px solid rgba(10,10,10,.06)",
        background: "#F9F8F6",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(10,10,10,.55)",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            FAQ
          </p>

          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(30px, 4vw, 46px)",
              color: "#0a0a0a",
              letterSpacing: "-.025em",
              lineHeight: 1.1,
            }}
          >
            Questions you probably have
          </h2>
        </div>


        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background:
                  open === i ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.6)",
                border: `1px solid ${open === i
                  ? "rgba(10,10,10,.10)"
                  : "rgba(10,10,10,.06)"
                  }`,
                borderRadius: 6,
                overflow: "hidden",
                transition: "all .2s ease",
                backdropFilter: "blur(10px)",
              }}
            >

              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "18px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: open === i ? "#0a0a0a" : "rgba(10,10,10,.75)",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </span>

                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(10,10,10,.04)",
                    border: "1px solid rgba(10,10,10,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "all .2s ease",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(10,10,10,.6)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>


              {open === i && (
                <div
                  style={{
                    padding: "0 20px 20px",
                    animation: "faqOpen .2s ease",
                  }}
                >
                  <style>{`
                    @keyframes faqOpen {
                      from { opacity:0; transform:translateY(-6px); }
                      to { opacity:1; transform:translateY(0); }
                    }
                  `}</style>

                  <p
                    style={{
                      fontSize: 16,
                      color: "rgba(10,10,10,.65)",
                      lineHeight: 1.75,
                      borderTop: "1px solid rgba(10,10,10,.06)",
                      paddingTop: 16,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>


        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p
            style={{
              fontSize: 16,
              fontBold: 800,
              color: "rgba(10,10,10,.55)",
              marginBottom: 16,
            }}
          >
            Still have questions?
          </p>

          <a
            href="mailto:hello@snapstore.app"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 14,
              color: "#0a0a0a",
              border: "1px solid rgba(10,10,10,.12)",
              padding: "9px 20px",
              borderRadius: 10,
              textDecoration: "none",
              transition: "all .15s ease",
              background: "rgba(255,255,255,.6)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "rgba(10,10,10,.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.6)";
              e.currentTarget.style.borderColor = "rgba(10,10,10,.12)";
            }}
          >
            hello@snapstore.app
          </a>
        </div>
      </div>
    </section>
  );
}