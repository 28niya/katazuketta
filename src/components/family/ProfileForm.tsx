'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { IconPicker } from '@/components/ui/IconPicker';
import { AREA_COLORS, AVATAR_COLOR_VALUES } from '@/types';
import { AVATAR_ICONS } from '@/lib/icons';
import { updateProfile } from '@/lib/actions/family';

type User = {
  id: string;
  name: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Props = {
  user: User;
};

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const initialColorIndex = AVATAR_COLOR_VALUES.findIndex((c) => c === user.avatarColor);
  const [name, setName] = useState(user.name);
  const [selectedIcon, setSelectedIcon] = useState<string>(user.avatarIcon);
  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex >= 0 ? initialColorIndex : 0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await updateProfile(user.id, name, selectedIcon, AVATAR_COLOR_VALUES[selectedColorIndex]);
      router.push('/family');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard>
      <div className="flex flex-col gap-5">
        {/* プレビュー */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: AREA_COLORS[selectedColorIndex].css }}
          >
            <AvatarIcon iconName={selectedIcon} size={32} className="text-white" />
          </div>
        </div>

        {/* 名前 */}
        <div>
          <p className="text-xs font-bold text-sub mb-2 pl-1">なまえ</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-base focus:bg-white/70 transition-colors outline-none"
          />
        </div>

        {/* カラーを選ぶ */}
        <div>
          <p className="text-xs font-bold text-sub mb-2 pl-1">カラーを選ぶ</p>
          <ColorPicker value={selectedColorIndex} onChange={setSelectedColorIndex} />
        </div>

        {/* アイコンを選ぶ */}
        <div>
          <p className="text-xs font-bold text-sub mb-2 pl-1">アイコンを選ぶ</p>
          <IconPicker
            icons={AVATAR_ICONS}
            value={selectedIcon}
            onChange={setSelectedIcon}
            colorIndex={selectedColorIndex}
          />
        </div>

        {/* エラー */}
        {error && (
          <p className="text-xs text-pink-accent text-center">{error}</p>
        )}

        {/* ボタン */}
        <Button
          variant={BUTTON_VARIANTS.PRIMARY}
          onClick={handleSubmit}
          disabled={submitting || !name.trim()}
          className="self-center"
        >
          {submitting ? '保存中...' : '保存する'}
        </Button>
      </div>
    </GlassCard>
  );
}
