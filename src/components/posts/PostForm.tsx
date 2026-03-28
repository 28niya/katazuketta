'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/actions/posts';
import { createArea } from '@/lib/actions/areas';
import { AreaIcon } from '@/components/ui/AreaIcon';
import { AREA_ICONS } from '@/types';

type Area = {
  id: string;
  name: string;
  iconName: string;
  colorIndex: number;
};

type PostFormProps = {
  familyId: string;
  userId: string;
  areas: Area[];
};

export function PostForm({ familyId, userId, areas }: PostFormProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState<string>(AREA_ICONS[0].name);
  const router = useRouter();

  const handleSubmit = () => {
    if (!selectedAreaId) return;

    startTransition(async () => {
      await createPost(familyId, userId, selectedAreaId, memo || undefined);
      setMemo('');
      setSelectedAreaId(null);
      router.refresh();
    });
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;

    startTransition(async () => {
      const area = await createArea(familyId, newAreaName, newAreaIcon);
      setSelectedAreaId(area.id);
      setNewAreaName('');
      setIsAdding(false);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* エリア選択 */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {areas.map((area) => {
          const isSelected = selectedAreaId === area.id;
          return (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all text-xs font-bold
                ${isSelected
                  ? 'bg-white/60 shadow-sm border border-white/70'
                  : 'border border-transparent hover:bg-white/30'
                }`}
            >
              <AreaIcon iconName={area.iconName} colorIndex={area.colorIndex} size="text-2xl" />
              <span className="text-[11px]">{area.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => setIsAdding(true)}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl border border-dashed border-sub/30 hover:bg-white/30 transition-all"
        >
          <i className="bx bx-plus text-2xl text-sub" />
          <span className="text-[11px] text-sub">追加</span>
        </button>
      </div>

      {/* インラインエリア追加 */}
      {isAdding && (
        <div className="bg-white/30 rounded-2xl p-4 flex flex-col gap-3">
          <input
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="場所の名前（例: 子供部屋）"
            maxLength={50}
            className="w-full bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-sm outline-none"
            autoFocus
          />
          <div className="flex gap-2 overflow-x-auto">
            {AREA_ICONS.map((icon) => (
              <button
                key={icon.name}
                onClick={() => setNewAreaIcon(icon.name)}
                className={`p-2 rounded-xl transition-all ${
                  newAreaIcon === icon.name ? 'bg-white/60 shadow-sm' : 'hover:bg-white/30'
                }`}
              >
                <i className={`bx ${icon.name} text-xl text-sub`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setIsAdding(false); setNewAreaName(''); }}
              className="px-4 py-1.5 rounded-full text-sm text-sub"
            >
              キャンセル
            </button>
            <button
              onClick={handleAddArea}
              disabled={!newAreaName.trim() || isPending}
              className="bg-green-accent text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-40"
            >
              追加
            </button>
          </div>
        </div>
      )}

      {/* メモ入力 */}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="例: 排水口を磨いたよ!"
        rows={3}
        maxLength={200}
        className="w-full bg-white/20 border border-white/50 rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-sub/50 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-sub">{memo.length}/200</span>
        <button
          onClick={handleSubmit}
          disabled={!selectedAreaId || isPending}
          className="bg-main text-white px-7 py-3 rounded-full font-bold text-sm transition-transform active:scale-95 disabled:opacity-40"
        >
          {isPending ? '送信中...' : 'かぞくにおしえる'}
        </button>
      </div>
    </div>
  );
}
