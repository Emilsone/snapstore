export default function SocialProof() {
  const logos = [
    {
      name: "Google",
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Microsoft",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "Notion",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    },

    {
      name: "Shopify",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    },

    {
      name: "Next.js",
      src: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
    },
  ];
  return (
    <section
      className="syne-font"
      style={{
        padding: "56px 24px",
        background:
          "#F9F8F6",
        backgroundSize: "200% 200%",
        animation: "gradientShift 12s ease infinite",
        borderTop: "1px solid rgba(10,10,10,.06)",
        borderBottom: "1px solid rgba(10,10,10,.06)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 34,
          }}
        >
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(23px, 2vw, 40px)",
              lineHeight: 1,
              color: "#0a0a0a",
              letterSpacing: "-0.05em",
            }}
          >
            Trusted by teams building modern products
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 42,
          }}
        >
          {logos.map((logo, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,.7)",
                border: "1px solid rgba(10,10,10,.06)",
                transition: "all .25s ease",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(255,255,255,.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,.7)";
              }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{
                  height: 40,
                  width: "auto",
                  objectFit: "contain",
                  filter: "none",
                  opacity: 1,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}