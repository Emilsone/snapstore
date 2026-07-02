"use client";
import Icon from "./Icon";

export default function Sidebar({
  activeNav,
  setActiveNav,
  urls,
  loading,
  sel,
  pick,
  logout,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  const navItems = [
    { id: "archive", label: "Archive", icon: "camera" },
    { id: "settings", label: "Settings", icon: "settings" },
    { id: "support", label: "Support", icon: "support" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="db-overlay" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}
      
      <aside className={`db-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
        width: 260, flexShrink: 0,
        borderRight: "1px solid var(--stone-200)",
        background: "#fff",
        display: "flex", flexDirection: "column",
        height: "100%",
        boxShadow: "1px 0 0 rgba(0,0,0,0.02)",
      }}>
        {/* Logo Area */}
        <div style={{
          height: 64, flexShrink: 0,
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 24px",
          borderBottom: "1px solid var(--stone-100)",
        }}>
          <div style={{
            width: 32, height: 32, background: "var(--ink)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" />
            </svg>
          </div>
          <span style={{ fontSize: 22, fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--ink)", letterSpacing: "-.015em" }}>
            Snapstore
          </span>
        </div>

      {/* URL list — top section, grows to fill space */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px 0" }}>
        {activeNav === "archive" && (
          <>
            <p style={{
              fontSize: 12.5, fontWeight: 600, color: "var(--stone-400)",
              letterSpacing: ".06em", textTransform: "uppercase",
              padding: "0 12px", marginBottom: 10,
            }}>
              Tracked URLs
            </p>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[80, 65, 75].map((w, i) => (
                  <div key={i} style={{ padding: "10px 10px", borderRadius: 7 }}>
                    <div className="skeleton" style={{ height: 11, width: `${w}%`, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 9, width: "55%" }} />
                  </div>
                ))}
              </div>
            ) : urls.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "#f5f5f4", border: "1px solid #e7e5e4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#c4c2bc", margin: "0 auto 10px",
                }}>
                  <Icon n="flag" size={16} />
                </div>
                <p style={{ fontSize: 14, color: "#78716c", fontWeight: 500, marginBottom: 3 }}>No URLs yet</p>
                <p style={{ fontSize: 13.5, color: "#a8a29e" }}>Add one to start archiving</p>
              </div>
            ) : (
              <nav>
                {urls.map(entry => {
                  const isActive = sel?.id === entry.id;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        pick(entry);
                        if (setMobileMenuOpen) setMobileMenuOpen(false);
                      }}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "10px 12px", borderRadius: 8,
                        border: "1px solid transparent",
                        background: isActive ? "var(--stone-50)" : "transparent",
                        borderColor: isActive ? "var(--stone-200)" : "transparent",
                        boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.02)" : "none",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 10,
                        transition: "all .15s", marginBottom: 4,
                        fontFamily: "inherit",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--stone-50)"; e.currentTarget.style.borderColor = "var(--stone-100)"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                    >
                      {isActive && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--ink)" }} />}
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: entry.active ? "#22C55E" : "#d6d3d1",
                        marginTop: 1,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14.5, fontWeight: isActive ? 500 : 400,
                          color: isActive ? "#1a1916" : "#57534e",
                          marginBottom: 2,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {entry.name}
                        </p>
                        <p style={{
                          fontSize: 12.5, color: "#a8a29e",
                          fontFamily: "monospace",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {entry.url.replace(/https?:\/\//, "")}
                        </p>
                      </div>
                      {entry.screenshot_count > 0 && (
                        <span style={{
                          fontSize: 12.5, color: "#a8a29e",
                          background: "#f5f5f4", border: "1px solid #e7e5e4",
                          borderRadius: 99, padding: "1px 7px", flexShrink: 0,
                        }}>
                          {entry.screenshot_count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </div>

      {/* Bottom section — nav items + sign out, always at the bottom */}
      <div style={{ flexShrink: 0 }}>
        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--stone-100)", margin: "0 16px" }} />

        {/* Nav items */}
        <div style={{ padding: "12px" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                if (setMobileMenuOpen) setMobileMenuOpen(false);
              }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8,
                border: "none", cursor: "pointer",
                background: activeNav === item.id ? "var(--stone-100)" : "transparent",
                color: activeNav === item.id ? "var(--ink)" : "var(--stone-600)",
                fontSize: 15, fontWeight: activeNav === item.id ? 500 : 400,
                fontFamily: "inherit", textAlign: "left",
                marginBottom: 4, transition: "all .15s",
              }}
              onMouseEnter={e => { if (activeNav !== item.id) { e.currentTarget.style.background = "var(--stone-50)"; e.currentTarget.style.color = "var(--ink)"; } }}
              onMouseLeave={e => { if (activeNav !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--stone-600)"; } }}
            >
              <Icon n={item.icon} size={15} style={{ color: activeNav === item.id ? "var(--ink)" : "var(--stone-400)" }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ borderTop: "1px solid var(--stone-100)", marginBottom: 12 }} />
          <button
            onClick={logout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 8,
              border: "none", cursor: "pointer",
              background: "#fef2f2", color: "#dc2626",
              fontSize: 15, fontWeight: 500, fontFamily: "inherit", textAlign: "left",
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
          >
            <Icon n="logout" size={15} />
            Sign out
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}
