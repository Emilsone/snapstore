import "./globals.css";

export const metadata = {
  title: "Snapstore — Web Archive",
  description: "Snap your pages. Store them forever. Self-hosted, no subscription.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
