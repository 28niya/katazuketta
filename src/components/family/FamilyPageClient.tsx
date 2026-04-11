'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  IconChevronRight,
  IconHome,
  IconLogout,
  IconUserCircle,
  IconUsersGroup,
} from '@tabler/icons-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { GradientIcon } from '@/components/ui/AreaIcon';

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
          <AvatarIcon iconName={currentUser.avatarIcon} size={40} stroke={1.75} className="text-white" />
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
          <GradientIcon icon={IconHome} colorIndex={4} size={22} />
          <span className="flex-1 text-sm font-bold">ホーム</span>
          <IconChevronRight size={20} className="text-sub" stroke={2} />
        </Link>

        <div className="h-px bg-white/30 mx-6" />

        <Link
          href="/family/profile"
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/20"
        >
          <GradientIcon icon={IconUserCircle} colorIndex={0} size={22} />
          <span className="flex-1 text-sm font-bold">プロフィール編集</span>
          <IconChevronRight size={20} className="text-sub" stroke={2} />
        </Link>

        <div className="h-px bg-white/30 mx-6" />

        <Link
          href="/family/members"
          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/20"
        >
          <GradientIcon icon={IconUsersGroup} colorIndex={1} size={22} />
          <span className="flex-1 text-sm font-bold">ファミリー</span>
          <IconChevronRight size={20} className="text-sub" stroke={2} />
        </Link>

      </GlassCard>

      <Button
        variant={BUTTON_VARIANTS.GLASS}
        className="self-center text-sm"
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
      >
        <IconLogout size={16} stroke={2} />
        ログアウト
      </Button>
    </div>
  );
}
