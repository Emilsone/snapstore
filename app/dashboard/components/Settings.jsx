"use client";

export default function Settings() {
  return (
    <div style={{ padding: "clamp(20px, 5vw, 40px)", maxWidth: 640 }}>
      <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 27.5, color: "var(--ink)", marginBottom: 6 }}>Settings</h1>
      <p style={{ fontSize: 15.5, color: "var(--ink-2)", marginBottom: 36 }}>Manage your Snapstore preferences</p>

      {[
        { title: "Account", desc: "Your username and login credentials are set via environment variables on your server.", action: null },
        { title: "Capture quality", desc: "Screenshots are captured at 1440×900 viewport, full page, saved as PNG.", action: null },
        { title: "Storage", desc: "All screenshots are stored in your Supabase bucket. Manage files directly from the Supabase dashboard.", action: null },
        { title: "Scheduler", desc: "Automatic captures are handled by the Railway cron job. Check Railway logs if captures are not running.", action: null },
      ].map((s, i) => (
        <div key={i} style={{
          padding: "20px 0",
          borderBottom: "1px solid var(--rule)",
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{s.title}</p>
          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65 }}>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
