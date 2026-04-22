'use client';

import { useState, useTransition, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  IconBubble,
  IconCheck,
  IconChevronLeft,
  IconMinus,
  IconPencil,
  IconPlus,
  IconSend2,
} from '@tabler/icons-react';
import { PostCard } from './PostCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AreaIcon, GradientIcon } from '@/components/ui/AreaIcon';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { IconPicker } from '@/components/ui/IconPicker';
import { useBottomSheet } from '@/components/ui/BottomSheet';
import { createPost } from '@/lib/actions/posts';
import { createArea, deleteArea } from '@/lib/actions/areas';
import { AREA_COLORS } from '@/types';
import { AREA_ICONS } from '@/lib/icons';

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
  /** FABをportalで表示するか（デフォルトtrue、PC版はfalse） */
  showFab?: boolean;
};

const VIEW = {
  FEED: 'FEED',
  SLIDING_OUT: 'SLIDING_OUT',
  SLIDING_IN: 'SLIDING_IN',
  FORM: 'FORM',
} as const;

type ViewState = typeof VIEW[keyof typeof VIEW];

export function FeedSheet({
  posts,
  users,
  areas,
  areaMap,
  reactions,
  familyId,
  currentUserId,
  showFab = true,
}: FeedSheetProps) {
  const [view, setView] = useState<ViewState>(VIEW.FEED);
  const [showForm, setShowForm] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState<string>(AREA_ICONS[0].name);
  const [newAreaColorIndex, setNewAreaColorIndex] = useState(0);
  const [isEditingAreas, setIsEditingAreas] = useState(false);
  const [addError, setAddError] = useState('');
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const router = useRouter();
  const bottomSheet = useBottomSheet();

  const switchToForm = useCallback(() => {
    // 先に slide でフォームに切り替えて、slide 完了後に sheet を expand する。
    setView(VIEW.SLIDING_OUT);
    setTimeout(() => {
      setShowForm(true);
      setView(VIEW.SLIDING_IN);
      setTimeout(() => {
        setView(VIEW.FORM);
        bottomSheet?.expand();
      }, 250);
    }, 250);
  }, [bottomSheet]);

  const switchToFeed = useCallback(() => {
    setView(VIEW.SLIDING_OUT);
    setTimeout(() => {
      setShowForm(false);
      setSelectedAreaId(null);
      setMemo('');
      setIsAdding(false);
      setView(VIEW.SLIDING_IN);
      setTimeout(() => setView(VIEW.FEED), 250);
    }, 250);
  }, []);

  const handleSubmit = () => {
    if (!selectedAreaId) return;
    bottomSheet?.collapse();
    startTransition(async () => {
      await createPost(familyId, currentUserId, selectedAreaId, memo || undefined);
      setMemo('');
      setSelectedAreaId(null);
      setShowForm(false);
      setView(VIEW.FEED);
      router.refresh();
    });
  };

  const handleDeleteArea = (areaId: string) => {
    startTransition(async () => {
      await deleteArea(areaId);
      if (selectedAreaId === areaId) setSelectedAreaId(null);
      router.refresh();
    });
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) {
      setAddError('場所の名前を入れてね');
      return;
    }
    setAddError('');
    startTransition(async () => {
      const area = await createArea(familyId, newAreaName, newAreaIcon, newAreaColorIndex);
      setSelectedAreaId(area.id);
      setNewAreaName('');
      setNewAreaColorIndex(0);
      setIsAdding(false);
      router.refresh();
    });
  };

  const slideClass =
    view === VIEW.SLIDING_OUT ? 'animate-sheet-out' :
    view === VIEW.SLIDING_IN ? 'animate-sheet-in' : '';

  return (
    <div className="relative">
      <div className={slideClass}>
        {!showForm ? (
          /* フィード */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold opacity-80" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))', textShadow: '0 4px 12px rgba(31, 38, 135, 0.1)' }}>みんなの活動</h2>
              {!showFab && (
                <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={switchToForm} className="hidden md:inline-flex text-sm">
                  投稿
                </Button>
              )}
            </div>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <GradientIcon icon={IconBubble} gradientId="brand-gradient" size={56} stroke={1.5} className="mb-3" />
                <p className="text-sm font-bold">まだ投稿がありません</p>
                <p className="text-xs text-sub mt-1">最初の投稿をしてみよう!</p>
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
                      avatarIcon={user?.avatarIcon ?? 'user'}
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
          <div className="flex flex-col gap-8">
            {/* ヘッダー */}
            <div className="mt-2">
              <button
                onClick={switchToFeed}
                className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity"
              >
                <IconChevronLeft size={20} stroke={2} />
                戻る
              </button>
            </div>

            {/* エリア選択 */}
            <div>
              <p className="text-sm font-bold mb-4 flex items-center gap-2 before:block before:w-1 before:h-4 before:bg-gradient-to-b before:from-[#4facfe] before:to-[#ed64a6] before:rounded-sm">
                どこを かたづけッタ？
              </p>
              <div className="grid grid-cols-3 gap-3 items-stretch">
                {areas.map((area) => {
                  const isSelected = selectedAreaId === area.id;
                  const areaColor = AREA_COLORS[area.colorIndex % AREA_COLORS.length];
                  return (
                    <div
                      key={area.id}
                      className={`relative transition-all duration-200 ${isEditingAreas ? 'grayscale-[30%] opacity-80' : ''}`}
                    >
                      <button
                        onClick={() => { if (!isEditingAreas) setSelectedAreaId(area.id); }}
                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-[24px] text-xs font-bold border transition-colors duration-200 w-full h-full"
                        style={isSelected && !isEditingAreas ? {
                          background: areaColor.activeBg,
                          borderColor: areaColor.activeBorder,
                          boxShadow: `0 4px 12px ${areaColor.activeShadow}`,
                        } : {
                          background: 'rgba(255,255,255,0.2)',
                          borderColor: 'transparent',
                        }}
                      >
                        <AreaIcon
                          iconName={area.iconName}
                          colorIndex={area.colorIndex}
                          size={26}
                          className={isSelected && !isEditingAreas ? '' : 'opacity-80'}
                        />
                        <span className="text-xs">{area.name}</span>
                      </button>

                      {/* 編集モード: マイナスバッジ */}
                      {isEditingAreas && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id); }}
                          className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-white/90 text-sub shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-white flex items-center justify-center z-10 cursor-pointer active:bg-sub active:text-white transition-colors"
                        >
                          <IconMinus size={14} stroke={3} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* 編集モード: 追加ボタン */}
                {isEditingAreas && (
                  <button
                    onClick={() => {
                      const usedIcons = new Set(areas.map(a => a.iconName));
                      const firstAvailable = AREA_ICONS.find(icon => !usedIcons.has(icon.name));
                      setNewAreaIcon(firstAvailable?.name ?? AREA_ICONS[0].name);
                      setIsAdding(true);
                    }}
                    className="flex flex-col items-center justify-center gap-2 py-4 rounded-[24px] bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 transition-all"
                  >
                    <IconPlus size={26} stroke={2} className="opacity-80" />
                    <span className="text-xs font-bold">追加</span>
                  </button>
                )}

                {/* エリア追加フォーム（グリッド内、完了の上） */}
                {isAdding && (
                  <div className="col-span-3 bg-white/50 border border-white/80 rounded-[28px] p-5 shadow-sm backdrop-blur-md">
                    <p className="text-sm font-bold mb-3 pl-1">新しい場所を追加</p>

                    <input
                      value={newAreaName}
                      onChange={(e) => { setNewAreaName(e.target.value); setAddError(''); }}
                      placeholder="場所の名前（例: 子供部屋）"
                      maxLength={50}
                      className="w-full bg-white/60 border border-white/80 focus:bg-white/90 transition-all rounded-[16px] px-4 py-3 text-base outline-none placeholder:text-sub/60 mb-4"
                      autoFocus
                    />

                    {/* カラー選択 */}
                    <p className="text-xs font-bold text-sub mb-2 pl-1">カラーを選ぶ</p>
                    <div className="mb-4">
                      <ColorPicker value={newAreaColorIndex} onChange={setNewAreaColorIndex} />
                    </div>

                    {/* アイコン選択（使用済みを除外） */}
                    <p className="text-xs font-bold text-sub mb-2 pl-1">アイコンを選ぶ</p>
                    <div className="mb-4">
                      {(() => {
                        const usedIcons = new Set(areas.map(a => a.iconName));
                        const availableIcons = AREA_ICONS.filter(icon => !usedIcons.has(icon.name));
                        const iconsToShow = availableIcons.length > 0 ? availableIcons : AREA_ICONS;
                        return (
                          <IconPicker
                            icons={iconsToShow}
                            value={newAreaIcon}
                            onChange={setNewAreaIcon}
                            colorIndex={newAreaColorIndex}
                          />
                        );
                      })()}
                    </div>

                    {addError && (
                      <p className="text-xs text-pink-accent mb-3 pl-1">{addError}</p>
                    )}

                    <div className="flex gap-3 justify-end">
                      <Button variant={BUTTON_VARIANTS.NORMAL} onClick={() => { setIsAdding(false); setNewAreaName(''); setAddError(''); }} className="text-sm">
                        キャンセル
                      </Button>
                      <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={handleAddArea} className="text-sm">
                        追加する
                      </Button>
                    </div>
                  </div>
                )}

                {/* 編集モード切り替え（グリッド末尾） */}
                <button
                  onClick={() => {
                    if (isEditingAreas) { setIsAdding(false); setNewAreaName(''); setAddError(''); }
                    setIsEditingAreas(!isEditingAreas);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-[24px] border transition-all ${
                    isEditingAreas
                      ? 'col-span-3 py-3 bg-white/90 border-white shadow-[0_4px_12px_rgba(31,38,135,0.05)]'
                      : 'flex-col py-4 bg-white/20 border-transparent hover:bg-white/30'
                  }`}
                >
                  {isEditingAreas ? (
                    <IconCheck size={20} stroke={2.5} className="text-sub" />
                  ) : (
                    <IconPencil size={26} stroke={1.75} className="text-sub/50" />
                  )}
                  <span className={isEditingAreas ? 'text-xs font-bold text-sub' : 'text-xs text-sub/50'}>{isEditingAreas ? '完了' : '場所を編集'}</span>
                </button>
              </div>
            </div>

            {/* メモ入力 + 投稿ボタン（エリア選択後に表示） */}
            {selectedAreaId && (
              <>
                <div>
                  <p className="text-sm font-bold mb-3 flex items-center gap-2 before:block before:w-1 before:h-4 before:bg-gradient-to-b before:from-[#4facfe] before:to-[#ed64a6] before:rounded-sm">
                    ひとこと
                  </p>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="なくてもOK"
                    rows={4}
                    maxLength={200}
                    className="w-full bg-white/50 border border-white/80 focus:bg-white/70 transition-all rounded-[28px] px-6 py-5 text-base outline-none placeholder:text-sub/50 resize-none"
                  />
                  <span className="text-xs text-sub mt-1 block text-right">{memo.length}/200</span>
                </div>

                {(() => {
                  const selectedArea = areas.find(a => a.id === selectedAreaId);
                  const color = AREA_COLORS[(selectedArea?.colorIndex ?? 0) % AREA_COLORS.length];
                  return (
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-[24px] font-bold text-base border transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-default disabled:active:scale-100 cursor-pointer backdrop-blur-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: `0 4px 16px ${color.activeShadow}`,
                      }}
                    >
                      {isPending ? '送信中...' : '投稿'}
                      <IconSend2
                        size={20}
                        stroke={2}
                        style={{
                          color: color.activeText,
                          filter: `drop-shadow(0 2px 4px ${color.activeShadow})`,
                        }}
                      />
                    </button>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </div>

      {/* FAB: portalでbodyに配置 */}
      {showFab && !showForm && mounted && createPortal(
        <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={switchToForm} className="md:hidden fixed bottom-8 right-6 z-50 text-sm">
          投稿
        </Button>,
        document.body,
      )}
    </div>
  );
}
