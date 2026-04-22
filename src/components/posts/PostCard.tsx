'use client';

import { useState, useTransition } from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AreaIcon } from '@/components/ui/AreaIcon';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { toggleReaction } from '@/lib/actions/posts';
import { formatRelativeTime } from '@/lib/time';
import { AREA_COLORS, getAvatarGradient, getComplementaryColorIndex } from '@/types';

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
  const complementColor = AREA_COLORS[getComplementaryColorIndex(colorIndex)];

  return (
    <div className="bg-glass backdrop-blur-glass border border-glass-border rounded-3xl p-5">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ background: getAvatarGradient(avatarColor) }}
        >
          <AvatarIcon iconName={avatarIcon} size={20} className="text-white" />
        </div>
        <span className="font-bold text-sm">{userName}</span>
      </div>

      {/* ビジュアル */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center py-8 px-6 mb-3"
        style={{ backgroundColor: complementColor.bg }}
      >
        {area && (
          <AreaIcon
            iconName={area.iconName}
            colorIndex={area.colorIndex}
            size={64}
            stroke={1.5}
            className="mb-3"
          />
        )}
        <p className="text-center font-bold text-base leading-relaxed">
          {post.memo || area?.name}
        </p>
      </div>

      {/* たすかるボタン + 日時 */}
      <div className="flex justify-between items-start gap-2">
        <Button
          variant={liked ? BUTTON_VARIANTS.LIKE_ACTIVE : BUTTON_VARIANTS.LIKE}
          onClick={handleButtonClick}
          disabled={isPending}
          className="text-sm"
        >
          {liked ? (
            <IconHeartFilled size={18} className="like-icon-active" />
          ) : (
            <IconHeart size={18} stroke={2} />
          )}
          たすかる
        </Button>
        <time
          dateTime={post.createdAt.toISOString()}
          className="text-[11px] text-sub"
        >
          {formatRelativeTime(post.createdAt)}
        </time>
      </div>
    </div>
  );
}
