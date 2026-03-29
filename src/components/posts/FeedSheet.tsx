'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { PostCard } from './PostCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AreaIcon } from '@/components/ui/AreaIcon';
import { createPost } from '@/lib/actions/posts';
import { createArea, deleteArea } from '@/lib/actions/areas';
import { AREA_ICONS, AREA_COLORS } from '@/types';

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
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState<string>(AREA_ICONS[0].name);
  const [newAreaColorIndex, setNewAreaColorIndex] = useState(0);
  const [isEditingAreas, setIsEditingAreas] = useState(false);
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

  const handleDeleteArea = (areaId: string) => {
    startTransition(async () => {
      await deleteArea(areaId);
      if (selectedAreaId === areaId) setSelectedAreaId(null);
      router.refresh();
    });
  };

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;
    startTransition(async () => {
      const area = await createArea(familyId, newAreaName, newAreaIcon, newAreaColorIndex);
      setSelectedAreaId(area.id);
      setNewAreaName('');
      setNewAreaColorIndex(0);
      setAddStep(1);
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
            <h2 className="text-sm font-bold opacity-80" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))', textShadow: '0 4px 12px rgba(31, 38, 135, 0.1)' }}>みんなの活動</h2>

            {posts.length === 0 ? (
              <div className="text-center py-8">
                <i className="bx bxs-spray-can text-5xl gradient-icon bg-gradient-to-br from-[#4facfe] to-[#38b2ac] mb-3" />
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
          <div className="flex flex-col gap-8">
            {/* ヘッダー */}
            <div className="mt-2">
              <button
                onClick={switchToFeed}
                className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity"
              >
                <i className="bx bx-chevron-left text-xl" />
                戻る
              </button>
            </div>

            {/* エリア選択 */}
            <div>
              <p className="text-[15px] font-bold mb-4 flex items-center gap-2 before:block before:w-1 before:h-4 before:bg-gradient-to-b before:from-[#4facfe] before:to-[#ed64a6] before:rounded-sm">
                どこを かたづけッタ？
              </p>
              <div className="grid grid-cols-3 gap-3">
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
                        className="flex flex-col items-center gap-2 py-4 rounded-[24px] text-xs font-bold border transition-colors duration-200 w-full"
                        style={isSelected && !isEditingAreas ? {
                          background: areaColor.activeBg,
                          borderColor: areaColor.activeBorder,
                          boxShadow: `0 4px 12px ${areaColor.activeShadow}`,
                        } : {
                          background: 'rgba(255,255,255,0.2)',
                          borderColor: 'transparent',
                        }}
                      >
                        <i
                          className={`bx ${area.iconName} text-[36px] gradient-icon bg-gradient-to-br ${areaColor.gradient}`}
                          style={isSelected && !isEditingAreas ? { opacity: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' } : { opacity: 0.8 }}
                        />
                        <span className="text-[11px]">{area.name}</span>
                      </button>

                      {/* 編集モード: マイナスバッジ */}
                      {isEditingAreas && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id); }}
                          className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-white/90 text-sub shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-white flex items-center justify-center z-10 cursor-pointer active:bg-sub active:text-white transition-colors"
                        >
                          <i className="bx bx-minus text-base font-bold" />
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
                    <i className="bx bx-plus text-[32px] opacity-80" />
                    <span className="text-[11px] font-bold">追加</span>
                  </button>
                )}

                {/* エリア追加フォーム（グリッド内、完了の上） */}
                {isAdding && (
                  <div className="col-span-3 bg-white/50 border border-white/80 rounded-[28px] p-5 shadow-sm backdrop-blur-md">
                    <p className="text-[14px] font-bold mb-3 pl-1">新しい場所を追加</p>

                    {addStep === 1 ? (
                      <>
                        <input
                          value={newAreaName}
                          onChange={(e) => setNewAreaName(e.target.value)}
                          placeholder="場所の名前（例: 子供部屋）"
                          maxLength={50}
                          className="w-full bg-white/60 border border-white/80 focus:bg-white/90 transition-all rounded-[16px] px-4 py-3 text-[14px] outline-none placeholder:text-sub/60 mb-4"
                          autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                          <Button variant={BUTTON_VARIANTS.NORMAL} onClick={() => { setIsAdding(false); setNewAreaName(''); }} className="text-[14px]">
                            キャンセル
                          </Button>
                          <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={() => setAddStep(2)} disabled={!newAreaName.trim()} className="text-[14px]">
                            次へ
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px] text-sub mb-3 pl-1">「{newAreaName}」のカラーとアイコン</p>

                        {/* カラー選択（スクエア＋チェック） */}
                        <p className="text-[13px] font-bold text-sub mb-2 pl-1">カラーを選ぶ</p>
                        <div className="flex gap-3 mb-4 pl-1">
                          {AREA_COLORS.map((color, i) => {
                            const isColorSelected = newAreaColorIndex === i;
                            return (
                              <button
                                key={i}
                                onClick={() => setNewAreaColorIndex(i)}
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

                        {/* アイコン選択（使用済みを除外） */}
                        <p className="text-[13px] font-bold text-sub mb-2 pl-1">アイコンを選ぶ</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
                          {(() => {
                            const usedIcons = new Set(areas.map(a => a.iconName));
                            const availableIcons = AREA_ICONS.filter(icon => !usedIcons.has(icon.name));
                            return (availableIcons.length > 0 ? availableIcons : AREA_ICONS).map((icon) => {
                              const isIconSelected = newAreaIcon === icon.name;
                              const selectedColor = AREA_COLORS[newAreaColorIndex];
                              return (
                                <button
                                  key={icon.name}
                                  onClick={() => setNewAreaIcon(icon.name)}
                                  className={`p-3 rounded-[20px] transition-all flex-shrink-0 ${
                                    isIconSelected
                                      ? 'bg-white/80 shadow-sm border border-white'
                                      : 'border border-transparent hover:bg-white/40'
                                  }`}
                                >
                                  <i className={`bx ${icon.name} text-[28px] ${isIconSelected ? `gradient-icon bg-gradient-to-br ${selectedColor.gradient}` : 'text-sub opacity-70'}`} />
                                </button>
                              );
                            });
                          })()}
                        </div>

                        <div className="flex gap-3 justify-end">
                          <Button variant={BUTTON_VARIANTS.NORMAL} onClick={() => setAddStep(1)} className="text-[14px]">
                            戻る
                          </Button>
                          <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={handleAddArea} disabled={isPending} className="text-[14px]">
                            追加する
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 編集モード切り替え（グリッド末尾） */}
                <button
                  onClick={() => {
                    if (isEditingAreas) { setIsAdding(false); setNewAreaName(''); setAddStep(1); }
                    setIsEditingAreas(!isEditingAreas);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-[24px] border transition-all ${
                    isEditingAreas
                      ? 'col-span-3 py-3 bg-white/90 border-white shadow-[0_4px_12px_rgba(31,38,135,0.05)]'
                      : 'flex-col py-4 bg-white/20 border-transparent hover:bg-white/30'
                  }`}
                >
                  <i className={`bx ${isEditingAreas ? 'bx-check' : 'bx-pencil'} ${isEditingAreas ? 'text-[22px]' : 'text-[28px]'} text-sub`} />
                  <span className={`font-bold text-sub ${isEditingAreas ? 'text-[13px]' : 'text-[11px]'}`}>{isEditingAreas ? '完了' : '編集'}</span>
                </button>
              </div>
            </div>

            {/* メモ入力 + 投稿ボタン（エリア選択後に表示） */}
            {selectedAreaId && (
              <>
                <div>
                  <p className="text-[15px] font-bold mb-3 flex items-center gap-2 before:block before:w-1 before:h-4 before:bg-gradient-to-b before:from-[#4facfe] before:to-[#ed64a6] before:rounded-sm">
                    ひとこと
                  </p>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="なくてもOK"
                    rows={4}
                    maxLength={200}
                    className="w-full bg-white/50 border border-white/80 focus:bg-white/70 transition-all rounded-[28px] px-6 py-5 text-[15px] outline-none placeholder:text-sub/50 resize-none"
                  />
                  <span className="text-[11px] text-sub mt-1 block text-right">{memo.length}/200</span>
                </div>

                {(() => {
                  const selectedArea = areas.find(a => a.id === selectedAreaId);
                  const color = AREA_COLORS[(selectedArea?.colorIndex ?? 0) % AREA_COLORS.length];
                  return (
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-[24px] font-bold text-[16px] border transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-default disabled:active:scale-100 cursor-pointer backdrop-blur-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: `0 4px 16px ${color.activeShadow}`,
                      }}
                    >
                      {isPending ? '送信中...' : '投稿'}
                      <i
                        className="bx bxs-paper-plane text-xl"
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

      {/* FAB: ポータルで画面に直接配置 */}
      {!showForm && mounted && createPortal(
        <Button variant={BUTTON_VARIANTS.PRIMARY} onClick={switchToForm} className="fixed bottom-8 right-6 z-50 text-[14px]">
          投稿
        </Button>,
        document.body,
      )}
    </div>
  );
}
