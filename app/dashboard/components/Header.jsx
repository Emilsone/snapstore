"use client";
import Icon from "./Icon";

export default function Header({
  urlsCount,
  setShowAdd,
  activeNav,
  setActiveNav,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const getTitle = () => {
    if (activeNav === "settings") return "Settings";
    if (activeNav === "support") return "Support";
    if (activeNav === "archive") return "Archive";
    return "Dashboard";
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(249,248,246,.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule)",
        height: 64,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(12px, 4vw, 28px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "var(--overlay)",
              border: "1px solid var(--rule)",
              color: "var(--ink)",
              padding: "6px",
              cursor: "pointer",
              borderRadius: 8,
            }}
          >
            <Icon n="menu" size={20} />
          </button>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-.01em",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {getTitle()}
          </h2>
        </div>

        <div style={{ flex: 1 }} />

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .mobile-menu-btn {
              display: flex !important;
            }

            .url-count-badge {
              display: none !important;
            }
          }

          @media (max-width: 480px) {
            .add-url-text {
              display: none;
            }
          }
        `}</style>


        {urlsCount > 0 && activeNav === "archive" && (
          <span
            className="url-count-badge"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink-2)",
              background: "#fff",
              border: "1px solid var(--rule)",
              borderRadius: 99,
              padding: "4px 12px",
              whiteSpace: "nowrap",
            }}
          >
            {urlsCount} URL{urlsCount !== 1 ? "s" : ""}
          </span>
        )}


        <button
          onClick={() => setShowAdd(true)}
          className="add-url-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--ink)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background .12s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2E2C28")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink)")}
        >
          <Icon n="plus" size={14} />
          <span className="add-url-text">Add URL</span>
        </button>
      </div>
    </header>
  );
}