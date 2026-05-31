import "./globals.css";

export const metadata = {
  title: "Snapstore — Automatic Web Page Screenshot Archiver",
  description:
    "Snapstore automatically screenshots any webpage on a schedule and builds a visual archive you can browse, compare, and download. Self-hosted, no subscription, no limits.",
  keywords: [
    "web page archiver",
    "screenshot automation",
    "webpage monitor",
    "visual change tracking",
    "self-hosted screenshot tool",
    "website screenshot history",
    "automated web capture",
  ],
  openGraph: {
    title: "Snapstore — Automatic Web Page Screenshot Archiver",
    description:
      "Set a URL, pick a schedule, and Snapstore builds a full visual archive of any webpage over time. Self-hosted and free.",
    url: "https://snapstore.app",
    siteName: "Snapstore",
    type: "website",
    images: [
      {
        url: "https://snapstore.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snapstore dashboard showing a visual archive of webpage screenshots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapstore — Automatic Web Page Screenshot Archiver",
    description:
      "Set a URL, pick a schedule, and Snapstore builds a full visual archive of any webpage over time. Self-hosted and free.",
    images: ["https://snapstore.app/og-image.png"],
  },
  metadataBase: new URL("https://snapstore.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
