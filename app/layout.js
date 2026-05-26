import "./globals.css";

export const metadata = {
  title: "Pagewatch — Web Archive",
  description: "Personal web screenshot archiver",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
