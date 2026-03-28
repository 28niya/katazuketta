'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { PostCard } from './PostCard';
import { AreaIcon } from '@/components/ui/AreaIcon';
import { createPost } from '@/lib/actions/posts';
import { createArea } from '@/lib/actions/areas';
import { AREA_ICONS } from '@/types';

type Area = {
  id: string;
  name: string;
  iconName: string;
  colorIndex: number;
};

type User = {
  id: string;
  name: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Reaction = {
  count: number;
  hasReacted: boolean;
};

type Post = {
  id: string;
  userId: string;
  areaId: string;
  memo: string | null;
  earnedExp: number;
  createdAt: Date;
};

type FeedSheetProps = {
  posts: Post[];
  users: Record<string, User>;
  areas: Area[];
  areaMap: Record<string, Area>;
  reactions: Record<string, Reaction>;
  familyId: string;
  currentUserId: string;
};

type ViewState = 'feed' | 'sliding-out' | 'sliding-in' | 'form';

export function FeedSheet({
  posts,
  users,
  areas,
  areaMap,
  reactions,
  familyId,
  currentUserId,
}: FeedSheetProps) {
  const [view, setView] = useState<ViewState>('feed');
  const [showForm, setShowForm] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState<string>(AREA_ICONS[0].name);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const switchToForm = useCallback(() => {
    setView('sliding-out');
    setTimeout(() => {
      setShowForm(true);
      setView('sliding-in');
      setTimeout(() => setView('form'), 250);
    }, 250);
  }, []);

  const switchToFeed = useCallback(() => {
    setView('sliding-out');
    setTimeout(() => {
      setShowForm(false);
      setSelectedAreaId(null);
      setMemo('');
      setIsAdding(false);
      setView('sliding-in');
      setTimeout(() => setView('feed'), 250);
    }, 250);
  }, []);

  const handleSubmit = () => {
    if (!selectedAreaId) return;
    startTransition(async () => {
      await createPost(familyId, currentUserId, selectedAreaId, memo || undefined);
      setMemo('');
      setSelectedAreaId(null);
      setShowForm(false);
      setView('sliding-in');
      setTimeout(() => setView('feed'), 250);
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

  const slideClass =
    view === 'sliding-out' ? 'animate-sheet-out' :
    view === 'sliding-in' ? 'animate-sheet-in' : '';

  return (
    <div className="relative">
      <div className={slideClass}>
        {!showForm ? (
          /* フィード */
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold opacity-80">みんなの活動</h2>

            {posts.length === 0 ? (
              <div className="text-center py-8">
                <i className="bx bxs-spray-can text-5xl gradient-icon bg-gradient-to-br from-[#4facfe] to-[#38b2ac] mb-3" />
                <p className="text-sm font-bold">まだポストがありません</p>
                <p className="text-xs text-sub mt-1">最初のポストをしてみよう!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => {
                  const user = users[post.userId];
                  const area = areaMap[post.areaId];
                  const reaction = reactions[post.id];
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      area={area ? { name: area.name, iconName: area.iconName, colorIndex: area.colorIndex } : null}
                      userName={user?.name ?? '不明'}
                      avatarColor={user?.avatarColor ?? '#38b2ac'}
                      avatarIcon={user?.avatarIcon ?? 'bxs-user'}
                      reactionCount={reaction?.count ?? 0}
                      hasReacted={reaction?.hasReacted ?? false}
                      currentUserId={currentUserId}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* 投稿フォーム */
          <div className="flex flex-col gap-4">
            <button
              onClick={switchToFeed}
              className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity"
            >
              <i className="bx bx-chevron-left text-lg" />
              みんなの活動へ
            </button>

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
              <div className="bg-white/20 rounded-2xl p-4 flex flex-col gap-3">
                <input
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="場所の名前（例: 子供部屋）"
                  maxLength={50}
                  className="w-full bg-white/30 border border-white/40 rounded-xl px-3 py-2 text-sm outline-none"
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
                    className="btn-glass text-sm"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleAddArea}
                    disabled={!newAreaName.trim() || isPending}
                    className="btn-accent text-sm"
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
              placeholder="ひとこと（なくてもOK）"
              rows={2}
              maxLength={200}
              className="w-full bg-white/15 border border-white/30 rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-sub/50 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-sub">{memo.length}/200</span>
              <button
                onClick={handleSubmit}
                disabled={!selectedAreaId || isPending}
                className="btn-accent text-sm"
              >
                {isPending ? '送信中...' : 'ポスト'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAB: ポータルで画面に直接配置 */}
      {!showForm && mounted && createPortal(
        <button
          onClick={switchToForm}
          className="btn-accent fixed bottom-8 right-6 z-50 text-sm shadow-[0_8px_24px_rgba(56,178,172,0.35)]"
        >
          <i className="bx bxs-send text-lg" />
          ポスト
        </button>,
        document.body,
      )}
    </div>
  );
}
