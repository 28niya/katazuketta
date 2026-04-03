import Link from 'next/link';
import { getUser } from '@/lib/actions/family';

const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser(DEMO_USER_ID);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* ヘッダー */}
      <header className="bg-glass backdrop-blur-glass border border-glass-border shadow-glass flex items-center justify-between px-6 py-4">
        <Link href="/home" className="flex items-center gap-2 text-2xl font-bold">
          <i className="bx bxs-spray-can text-3xl gradient-icon bg-gradient-to-br from-[#6ee7b7] to-[#f472b6]" />
          かたづけッタ
        </Link>
        <Link href="/family" className="w-9 h-9 flex items-center justify-center rounded-full" style={{ backgroundColor: user.avatarColor ?? '#4a5568' }}>
          <i className={`bx ${user.avatarIcon} text-lg text-white`} />
        </Link>
      </header>

      <main className="flex-1 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
