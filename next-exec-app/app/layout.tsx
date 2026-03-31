import "./globals.css";
import HeaderDropdown from "./header";
import { data } from "./data";
import { Manrope, Space_Grotesk } from "next/font/google";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "IQ Space",
  description: "Interactive code execution and learning space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS via CDN for rapid styling. For production, prefer local build setup. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="app-shell">
        <header className="site-header">
          <div className="site-header__inner">
            <div className="site-brand">
              <h1 className="site-brand__title">IQ Space</h1>
            </div>
            <nav className="site-nav">
              {data.headers.map((header) => (
                <HeaderDropdown key={header.title} name={header.title} appHeader={header} />
              ))}
            </nav>
          </div>
        </header>
        <main className="page-frame">
          {children}
          <footer className="site-footer">
            © {new Date().getFullYear()} IQ Space
          </footer>
        </main>
        </div>
      </body>
    </html>
  );
}
