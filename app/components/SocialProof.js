export default function SocialProof() {
  return (
    <section style={{
      borderTop: "1px solid rgba(255,255,255,.06)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      padding: "32px 28px",
      background: "rgba(255,255,255,.015)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 48, flexWrap: "wrap",
        }}>
          <p style={{
            fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,.2)",
            letterSpacing: ".1em", textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Trusted by developers &amp; teams worldwide
          </p>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.08)" }}/>
          {[
            { stat: "500+",  label: "Active users"      },
            { stat: "50k+",  label: "Screenshots taken" },
            { stat: "99.9%", label: "Uptime"            },
            { stat: "4.9★",  label: "Average rating"    },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: 22, fontWeight: 700, color: "#fff",
                letterSpacing: "-.02em", lineHeight: 1, marginBottom: 5,
              }}>
                {item.stat}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
