import "./globals.css";
import Link from "next/link";
import AddSectionButton from "./add-section-button";
import HeaderDropdown from "./header";
import { Manrope, Space_Grotesk } from "next/font/google";
import { getAppData } from "../lib/tutorial-store";

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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appData = await getAppData();

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
              <Link href="/" className="site-brand__title">
                IQ Space
              </Link>
            </div>
            <div className="site-header__actions">
              <nav className="site-nav">
                {appData.headers.map((header) => (
                  <HeaderDropdown key={header.title} name={header.title} appHeader={header} />
                ))}
              </nav>
              <AddSectionButton />
            </div>
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
