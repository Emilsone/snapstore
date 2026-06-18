"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Honestly didn’t expect to use this as much as I do. I originally installed Snapstore just to archive a few client pages, but now I check it almost daily. It’s saved me from a couple awkward ‘that section was never there’ conversations 😅",
    name: "Marcus Thompson",
    role: "Freelance Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },

  {
    quote:
      "The scheduled screenshots are probably my favorite part. I set everything up once and forgot about it. A few weeks later I randomly checked the dashboard and realized I had this full visual history of our landing page changes. Super useful.",
    name: "Amina Yusuf",
    role: "Growth Marketer",
    image:
      "https://images.unsplash.com/photo-1642929456654-f4540e3e2a85?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    quote:
      "The fact that Snapstore is self-hosted won me over instantly. I handle a lot of sensitive internal tools, so third-party cloud uploads are a hard no. It feels lightweight, entirely private, and just works.",
    name: "David Chen",
    role: "Security Engineer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
  },

  {
    quote:
      "I’ve tried a few website monitoring tools before and most of them felt overly technical. This one just made sense immediately. Clean UI, easy setup, and the timeline view is honestly really satisfying to scroll through.",
    name: "Sofia Martinez",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },

  {
    quote:
      "One thing I didn’t expect was how helpful this became during client approvals. Instead of trying to explain what changed on a page, I can literally pull up the archived version and compare it side by side. Makes feedback way easier.",
    name: "Tunde Adeyemi",
    role: "Creative Director",
    image:
      "https://plus.unsplash.com/premium_photo-1663040154843-8663ecb1f007?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    quote:
      "Been using it quietly for about 4 months now. No issues, no weird bugs, just works. That’s honestly the best kind of software.",
    name: "Nia Okafor",
    role: "Devops Engineer",
    image:
      "https://images.unsplash.com/photo-1653565685092-a109a59bbcd2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        padding: "100px 24px",
        borderTop: "1px solid rgba(10,10,10,.06)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 70,
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,.35)",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            Testimonials
          </p>

          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(42px, 7vw, 72px)",
              lineHeight: 1,
              color: "#0a0a0a",
              letterSpacing: "-0.05em",
            }}
          >
            People who stopped
            <br />
            worrying about their pages
          </h2>
        </div>


        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 820,
            margin: "0 auto",
            minHeight: 360,
          }}
        >
          {TESTIMONIALS.map((t, index) => {
            const active = current === index;

            return (
              <div
                key={index}
                style={{
                  position: active ? "relative" : "absolute",
                  inset: 0,
                  opacity: active ? 1 : 0,
                  transform: active
                    ? "translateY(0px)"
                    : "translateY(30px)",
                  transition:
                    "opacity .6s ease, transform .6s ease",
                  pointerEvents: active ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: 24,
                    padding: "46px",
                    overflow: "hidden",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.78))",
                    border: "1px solid rgba(10,10,10,.06)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,.08)",
                  }}
                >
                  {/* Glow */}
                  <div
                    style={{
                      position: "absolute",
                      width: 280,
                      height: 280,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(10,10,10,.04), transparent 70%)",
                      top: -120,
                      right: -100,
                    }}
                  />

                  {/* Quote mark */}
                  <div
                    style={{
                      fontSize: 90,
                      lineHeight: 0.8,
                      color: "rgba(10,10,10,.08)",
                      marginBottom: 24,
                      fontFamily: "serif",
                    }}
                  >
                    “
                  </div>

                  {/* Testimonial text */}
                  <p
                    style={{
                      fontSize: "clamp(14px, 2vw, 20px)",
                      lineHeight: 1.8,
                      color: "rgba(10,10,10,.72)",
                      letterSpacing: "-0.01em",
                      marginBottom: 40,
                      maxWidth: 650,
                    }}
                  >
                    {t.quote}
                  </p>

                  {/* Bottom section */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: 20,
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: 18,
                          color: "#0a0a0a",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        {t.name}
                      </h4>

                      <p
                        style={{
                          fontSize: 14,
                          color: "rgba(10,10,10,.4)",
                        }}
                      >
                        {t.role}
                      </p>
                    </div>

                    {/* Avatar */}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border:
                          "1px solid rgba(10,10,10,.08)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slider dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 32,
          }}
        >
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              style={{
                width: current === index ? 34 : 10,
                height: 10,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                transition: "all .35s ease",
                background:
                  current === index
                    ? "#0a0a0a"
                    : "rgba(10,10,10,.18)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}