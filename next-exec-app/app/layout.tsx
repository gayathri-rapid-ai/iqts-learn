export const metadata = {
  title: 'IQ-Space',
  description: 'Interactive code execution and learning space',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS via CDN for rapid styling. For production, prefer local build setup. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased overflow-y-scroll">
        <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 text-white shadow-md">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3">
            <div className="text-lg font-extrabold tracking-wide drop-shadow-sm">IQ-Space</div>
            <nav className="flex items-center gap-6">
              <div className="relative group">
                <button className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10 focus:outline-none">Programming ▾</button>
                <div className="absolute left-0 mt-2 hidden w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl ring-1 ring-black/5 group-hover:block">
                  <a href="#" data-iq-category="Basics" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100">Basic Programming</a>
                  <div className="relative group/sub mt-1">
                    <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100">
                      <span>Sorting Techniques</span>
                      <span className="ml-2">▸</span>
                    </button>
                    <div className="absolute left-full top-0 ml-1 hidden w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl ring-1 ring-black/5 group-hover/sub:block">
                      <a href="#" data-iq-sorting="Basic Sorting" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100">Basic Sorting</a>
                      <a href="#" data-iq-sorting="Advanced Sorting" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100">Advanced Sorting</a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-4">{children}</main>
        <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-xs text-slate-500 backdrop-blur">
          © {new Date().getFullYear()} IQ-Space
        </footer>
      </body>
    </html>
  );
}
