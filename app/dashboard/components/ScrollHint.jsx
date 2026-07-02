"use client";
import { useState, useEffect } from "react";

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 99, padding: "8px 18px",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 14, color: "rgba(255,255,255,.7)",
      animation: "fadeIn .3s ease",
      pointerEvents: "none", zIndex: 300,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
      Scroll to browse the full page
    </div>
  );
}
