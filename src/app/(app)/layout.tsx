import Link from 'next/link';
import { IconHomeSpark } from '@tabler/icons-react';
import { GradientIcon } from '@/components/ui/AreaIcon';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { getUser } from '@/lib/actions/family';
import { requireAuth } from '@/lib/auth/session';
import { getAvatarGradient } from '@/types';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const user = await getUser(session.user.id);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* ヘッダー */}
      <header className="bg-glass backdrop-blur-glass border border-glass-border shadow-glass flex items-center justify-between px-6 py-4">
        <Link href="/home" className="flex items-center gap-2 text-2xl font-bold">
          <GradientIcon icon={IconHomeSpark} gradientId="brand-gradient" size={32} stroke={1.75} />
          かたづけッタ
        </Link>
        <Link href="/family" className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: getAvatarGradient(user.avatarColor) }}>
          <AvatarIcon iconName={user.avatarIcon} size={20} className="text-white" />
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
