"use client";

export default function Support() {
  return (
    <div style={{ padding: "40px 40px", maxWidth: 600 }}>
      <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 27.5, color: "var(--ink)", marginBottom: 6 }}>Support</h1>
      <p style={{ fontSize: 15.5, color: "var(--stone-400)", marginBottom: 36 }}>Get help with Snapstore</p>

      {[
        {
          title: "Screenshots not capturing?",
          desc: "Check that your ScrapingBee API key is set correctly in Railway environment variables. Also check Railway logs for error messages.",
        },
        {
          title: "Scheduled captures not running?",
          desc: "Make sure the Railway cron job is configured and your CRON_SECRET matches the value in your environment variables.",
        },
        {
          title: "Can't log in?",
          desc: "Your credentials are set via SNAPSTORE_USERNAME and SNAPSTORE_PASSWORD environment variables in Railway. Update them there.",
        },
        {
          title: "Screenshots missing sections?",
          desc: "Some pages use lazy loading. Try increasing the wait time in your capture settings or contact support.",
        },
      ].map((s, i) => (
        <div key={i} style={{
          padding: "20px 0",
          borderBottom: "1px solid var(--stone-200)",
        }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>{s.title}</p>
          <p style={{ fontSize: 15, color: "var(--stone-500)", lineHeight: 1.65 }}>{s.desc}</p>
        </div>
      ))}

      <div style={{ marginTop: 32 }}>
        <a href="mailto:hello@snapstore.app" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--ink)", color: "#fff",
          padding: "10px 22px", borderRadius: 7,
          fontSize: 15.5, fontWeight: 500, textDecoration: "none",
          transition: "background .12s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#2E2C28"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}
        >
          Email support →
        </a>
      </div>
    </div>
  );
}
