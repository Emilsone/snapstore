"use client";
import Icon from "./Icon";

export default function AddUrlModal({
  setShowAdd,
  form,
  setForm,
  formBusy,
  addUrl,
  SCHEDULES
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(26,25,23,.4)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", animation: "fadeIn .18s ease",
      }}
      onClick={() => setShowAdd(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "100%",
          maxWidth: "720px",
          minWidth: "320px",
          boxShadow: "0 24px 64px rgba(0,0,0,.12)",
          animation: "fadeIn .2s ease",
        }}
      >
        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--overlay)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 19.5, color: "var(--ink)" }}>Add a URL</p>
          <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 4, display: "flex" }}>
            <Icon n="x" size={16} />
          </button>
        </div>
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>Label</label>
            <input
              style={{
                width: "100%", height: 38, padding: "0 14px",
                border: "1px solid var(--ink-4)", borderRadius: 7,
                fontSize: 15.5, color: "var(--ink)", fontFamily: "inherit",
                outline: "none", transition: "border-color .15s",
              }}
              placeholder="e.g. My portfolio"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
              onFocus={e => e.target.style.borderColor = "#1d4ed8"}
              onBlur={e => e.target.style.borderColor = "var(--rule)"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>URL</label>
            <input
              style={{
                width: "100%", height: 38, padding: "0 12px",
                border: "1px solid var(--ink-4)", borderRadius: 7,
                fontSize: 14.5, color: "var(--ink)", fontFamily: "monospace",
                outline: "none", transition: "border-color .15s",
              }}
              placeholder="https://example.com"
              value={form.url}
              onChange={e => {
                let val = e.target.value;

                val = val.replace(/^https?:\/\/(https?:\/\/)/i, "$1");
                setForm(f => ({ ...f, url: val }));
              }}
              onFocus={e => {
                e.target.style.borderColor = "#1d4ed8";
                e.target.select();
              }}
              onBlur={e => e.target.style.borderColor = "var(--rule)"}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>Capture frequency</label>
            <select
              style={{
                width: "100%", height: 38, padding: "0 12px",
                border: "1px solid var(--ink-4)", borderRadius: 7,
                fontSize: 15.5, color: "var(--ink)", fontFamily: "inherit",
                outline: "none", appearance: "none", cursor: "pointer",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A9790' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
                paddingRight: 32,
              }}
              value={form.schedule}
              onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
            >
              {SCHEDULES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <p style={{ fontSize: 13.5, padding: "10px", color: "var(--ink-3)" }}>Automatic captures run on the cloud scheduler.</p>
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--ink-4)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={() => setShowAdd(false)} style={{
            padding: "8px 18px", borderRadius: 7,
            border: "1px solid var(--ink-3)", background: "#fff",
            color: "var(--ink)", fontSize: 15.5, cursor: "pointer", fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button
            onClick={addUrl}
            disabled={formBusy || !form.name || !form.url}
            style={{
              padding: "8px 20px", borderRadius: 7,
              border: "none", background: "var(--bg)", color: "#fff",
              fontSize: 15.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              opacity: (formBusy || !form.name || !form.url || form.url === "https://") ? .5 : 1,
            }}
          >
            {formBusy ? "Adding…" : "Add URL"}
          </button>
        </div>
      </div>
    </div>
  );
}
