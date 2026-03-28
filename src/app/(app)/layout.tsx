export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* ヘッダー */}
      <header className="bg-glass backdrop-blur-glass border border-glass-border shadow-glass flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <i className="bx bxs-spray-can text-3xl gradient-icon bg-gradient-to-br from-[#4facfe] to-[#38b2ac]" />
          かたづけ<span>ッタ</span>
        </div>
        <a href="/settings" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors">
          <i className="bx bxs-cog text-xl text-sub" />
        </a>
      </header>

      <main className="flex-1 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
