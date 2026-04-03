'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';

type Family = {
  id: string;
  name: string;
  inviteCode: string;
};

type User = {
  id: string;
  name: string;
  role: string;
  authType: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Props = {
  family: Family;
  currentUser: User;
};

export function FamilyPageClient({ family, currentUser }: Props) {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">
      {/* プロフィール */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: currentUser.avatarColor ?? '#4a5568' }}
        >
          <i className={`bx ${currentUser.avatarIcon} text-4xl text-white`} />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{currentUser.name}</p>
          <p className="text-xs text-sub">{family.name}</p>
        </div>
      </div>

      {/* メニュー */}
      <GlassCard className="!p-0 overflow-hidden">
        <Link
          href="/home"
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/20"
        >
          <i className="bx bxs-home-smile text-xl gradient-icon bg-gradient-to-br from-[#ff9a9e] to-[#fecfef]" />
          <span className="flex-1 text-sm font-bold">ホーム</span>
          <i className="bx bx-chevron-right text-xl text-sub" />
        </Link>

        <div className="h-px bg-white/30 mx-6" />

        <Link
          href="/family/profile"
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/20"
        >
          <i className="bx bxs-user-circle text-xl gradient-icon bg-gradient-to-br from-[#4facfe] to-[#00f2fe]" />
          <span className="flex-1 text-sm font-bold">プロフィール編集</span>
          <i className="bx bx-chevron-right text-xl text-sub" />
        </Link>

        <div className="h-px bg-white/30 mx-6" />

        <Link
          href="/family/members"
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/20"
        >
          <i className="bx bxs-group text-xl gradient-icon bg-gradient-to-br from-[#43e97b] to-[#38f9d7]" />
          <span className="flex-1 text-sm font-bold">ファミリー</span>
          <i className="bx bx-chevron-right text-xl text-sub" />
        </Link>

      </GlassCard>

      {/* ログアウト（将来用） */}
      <Button variant={BUTTON_VARIANTS.GLASS} className="self-center text-sm">
        <i className="bx bx-log-out text-base" />
        ログアウト
      </Button>
    </div>
  );
}
