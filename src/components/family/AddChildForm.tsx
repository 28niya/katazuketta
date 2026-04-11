'use client';

import { useState } from 'react';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { IconPicker } from '@/components/ui/IconPicker';
import { AREA_COLORS, AVATAR_COLOR_VALUES } from '@/types';
import { AVATAR_ICONS } from '@/lib/icons';
import { createChildAccount } from '@/lib/actions/family';

type User = {
  id: string;
  name: string;
  role: string;
  authType: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Props = {
  familyId: string;
  inviteCode: string;
  onAdded: (member: User) => void;
  onCancel: () => void;
};

export function AddChildForm({ familyId, inviteCode, onAdded, onCancel }: Props) {
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(AVATAR_ICONS[1].name);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const child = await createChildAccount(familyId, inviteCode, nickname, pin, selectedIcon, AVATAR_COLOR_VALUES[selectedColorIndex]);
      onAdded(child);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ニックネーム */}
      <div>
        <label className="text-xs text-sub block mb-1">ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="たろう"
          maxLength={50}
          className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none"
        />
      </div>

      {/* PIN */}
      <div>
        <label className="text-xs text-sub block mb-1">PIN（数字6〜8桁）</label>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
          placeholder="123456"
          className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none tracking-[0.3em]"
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

      {/* プレビュー */}
      <div className="flex items-center justify-center gap-3 py-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: AREA_COLORS[selectedColorIndex].css }}
        >
          <AvatarIcon iconName={selectedIcon} size={24} className="text-white" />
        </div>
        <span className="font-bold">{nickname || 'ニックネーム'}</span>
      </div>

      {/* エラー */}
      {error && (
        <p className="text-xs text-pink-accent text-center">{error}</p>
      )}

      {/* ボタン */}
      <div className="flex gap-3 justify-center">
        <Button variant={BUTTON_VARIANTS.GLASS} onClick={onCancel}>
          キャンセル
        </Button>
        <Button
          variant={BUTTON_VARIANTS.PRIMARY}
          onClick={handleSubmit}
          disabled={submitting || !nickname.trim() || pin.length < 6}
        >
          {submitting ? '作成中...' : '追加する'}
        </Button>
      </div>
    </div>
  );
}
