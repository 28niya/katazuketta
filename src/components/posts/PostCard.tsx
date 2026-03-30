'use client';

import { useState, useTransition } from 'react';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { toggleReaction } from '@/lib/actions/posts';
import { formatRelativeTime } from '@/lib/time';
import { AREA_COLORS } from '@/types';

type PostCardProps = {
  post: {
    id: string;
    userId: string;
    areaId: string;
    memo: string | null;
    earnedExp: number;
    createdAt: Date;
  };
  area: {
    name: string;
    iconName: string;
    colorIndex: number;
  } | null;
  userName: string;
  avatarColor: string;
  avatarIcon: string;
  reactionCount: number;
  hasReacted: boolean;
  currentUserId: string;
};

export function PostCard({
  post,
  area,
  userName,
  avatarColor,
  avatarIcon,
  hasReacted: initialHasReacted,
  currentUserId,
}: PostCardProps) {
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(initialHasReacted);

  const handleButtonClick = () => {
    setLiked(!liked); // 楽観的にUIを即更新
    startTransition(async () => {
      await toggleReaction(post.id, currentUserId);
    });
  };

  const colorIndex = area?.colorIndex ?? 0;
  const areaColor = AREA_COLORS[colorIndex % AREA_COLORS.length];

  return (
    <div className="bg-glass backdrop-blur-glass border border-glass-border rounded-3xl p-5">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: avatarColor }}
        >
          <i className={`bx ${avatarIcon} text-lg`} />
        </div>
        <div>
          <span className="font-bold text-sm">{userName}</span>
          <span className="text-[11px] text-sub ml-2">{formatRelativeTime(post.createdAt)}</span>
        </div>
      </div>

      {/* ビジュアル */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center py-8 px-6 mb-3"
        style={{ backgroundColor: areaColor.bg }}
      >
        {area && (
          <i
            className={`bx ${area.iconName} text-6xl gradient-icon bg-gradient-to-br ${areaColor.gradient} mb-3`}
          />
        )}
        <p className="text-center font-bold text-base leading-relaxed">
          {post.memo || area?.name}
        </p>
      </div>

      {/* たすかるボタン */}
      <Button
        variant={liked ? BUTTON_VARIANTS.LIKE_ACTIVE : BUTTON_VARIANTS.LIKE}
        onClick={handleButtonClick}
        disabled={isPending}
        className="text-sm"
      >
        <i className={`bx ${liked ? 'bxs-heart' : 'bx-heart'} text-lg ${liked ? 'like-icon-active' : ''}`} />
        たすかる
      </Button>
    </div>
  );
}
