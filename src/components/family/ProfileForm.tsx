'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AVATAR_ICONS, AREA_COLORS, AVATAR_COLOR_VALUES } from '@/types';
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
            style={{ backgroundColor: AVATAR_COLOR_VALUES[selectedColorIndex] }}
          >
            <i className={`bx ${selectedIcon} text-3xl text-white`} />
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
            className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none"
          />
        </div>

        {/* カラーを選ぶ */}
        <div>
          <p className="text-xs font-bold text-sub mb-2 pl-1">カラーを選ぶ</p>
          <div className="flex gap-3 pl-1">
            {AREA_COLORS.map((color, i) => {
              const isColorSelected = selectedColorIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColorIndex(i)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                  style={{
                    background: color.css,
                    opacity: isColorSelected ? 1 : 0.6,
                    transform: isColorSelected ? 'scale(1.1)' : 'scale(0.9)',
                    boxShadow: isColorSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  <i
                    className="bx bx-check text-xl text-white transition-all"
                    style={{
                      opacity: isColorSelected ? 1 : 0,
                      transform: isColorSelected ? 'scale(1)' : 'scale(0.5)',
                      filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* アイコンを選ぶ */}
        <div>
          <p className="text-xs font-bold text-sub mb-2 pl-1">アイコンを選ぶ</p>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_ICONS.map((icon) => {
              const isIconSelected = selectedIcon === icon.name;
              const selectedColor = AREA_COLORS[selectedColorIndex];
              return (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setSelectedIcon(icon.name)}
                  className={`p-3 rounded-[20px] transition-all ${
                    isIconSelected
                      ? 'bg-white/80 shadow-sm border border-white'
                      : 'border border-transparent hover:bg-white/40'
                  }`}
                >
                  <i className={`bx ${icon.name} text-2xl ${isIconSelected ? `gradient-icon bg-gradient-to-br ${selectedColor.gradient}` : 'text-sub opacity-70'}`} />
                </button>
              );
            })}
          </div>
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
