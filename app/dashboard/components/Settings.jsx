"use client";

export default function Settings() {
  return (
    <div style={{ padding: "40px 40px", maxWidth: 600 }}>
      <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 27.5, color: "var(--ink)", marginBottom: 6 }}>Settings</h1>
      <p style={{ fontSize: 15.5, color: "var(--stone-400)", marginBottom: 36 }}>Manage your Snapstore preferences</p>

      {[
        { title: "Account", desc: "Your username and login credentials are set via environment variables on your server.", action: null },
        { title: "Capture quality", desc: "Screenshots are captured at 1440×900 viewport, full page, saved as PNG.", action: null },
        { title: "Storage", desc: "All screenshots are stored in your Supabase bucket. Manage files directly from the Supabase dashboard.", action: null },
        { title: "Scheduler", desc: "Automatic captures are handled by the Railway cron job. Check Railway logs if captures are not running.", action: null },
      ].map((s, i) => (
        <div key={i} style={{
          padding: "20px 0",
          borderBottom: "1px solid var(--stone-200)",
        }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>{s.title}</p>
          <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.65 }}>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
