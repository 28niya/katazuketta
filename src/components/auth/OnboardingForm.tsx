'use client';

import { useState } from 'react';
import {
  IconCheck,
  IconChevronLeft,
  IconHomePlus,
  IconUsersGroup,
} from '@tabler/icons-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { GradientIcon } from '@/components/ui/AreaIcon';
import { AREA_COLORS, AVATAR_COLOR_VALUES } from '@/types';
import { AVATAR_ICONS } from '@/lib/icons';
import { onboardCreateFamily, onboardJoinFamily } from '@/lib/actions/family';

const ONBOARDING_STEP = {
  SELECT: 'SELECT',
  CREATE: 'CREATE',
  JOIN: 'JOIN',
  PROFILE: 'PROFILE',
} as const;

type OnboardingStep = typeof ONBOARDING_STEP[keyof typeof ONBOARDING_STEP];
type FlowType = typeof ONBOARDING_STEP.CREATE | typeof ONBOARDING_STEP.JOIN;

export function OnboardingForm({ email, name: initialName }: { email: string; name: string }) {
  const [step, setStep] = useState<OnboardingStep>(ONBOARDING_STEP.SELECT);
  const [userName, setUserName] = useState(initialName);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(AVATAR_ICONS[0].name);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>(ONBOARDING_STEP.CREATE);

  const goToProfile = (type: FlowType) => {
    setError('');
    if (type === ONBOARDING_STEP.CREATE && !familyName.trim()) {
      setError('家族名を入力してください');
      return;
    }
    if (type === ONBOARDING_STEP.JOIN && !inviteCode.trim()) {
      setError('招待コードを入力してください');
      return;
    }
    setFlowType(type);
    setStep(ONBOARDING_STEP.PROFILE);
  };

  const handleSubmit = async () => {
    setError('');
    if (!userName.trim()) { setError('名前を入力してください'); return; }
    setSubmitting(true);
    try {
      if (flowType === ONBOARDING_STEP.CREATE) {
        await onboardCreateFamily(email, userName.trim(), familyName.trim(), selectedIcon, AVATAR_COLOR_VALUES[selectedColorIndex]);
      } else {
        await onboardJoinFamily(email, userName.trim(), inviteCode.trim(), selectedIcon, AVATAR_COLOR_VALUES[selectedColorIndex]);
      }
      window.location.href = '/home';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  // ステップ1: 選択
  if (step === ONBOARDING_STEP.SELECT) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-4">
        <GlassCard>
          <div className="flex flex-col gap-4">
            <Button
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => setStep(ONBOARDING_STEP.CREATE)}
              className="w-full justify-center"
            >
              <IconHomePlus size={18} stroke={2} />
              家族をつくる
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-sub/20" />
              <span className="text-xs text-sub">または</span>
              <div className="flex-1 h-px bg-sub/20" />
            </div>

            <Button
              variant={BUTTON_VARIANTS.GLASS}
              onClick={() => setStep(ONBOARDING_STEP.JOIN)}
              className="w-full justify-center"
            >
              <IconUsersGroup size={18} stroke={2} />
              招待コードで参加
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ステップ2: 家族名 or 招待コード
  if (step === ONBOARDING_STEP.CREATE || step === ONBOARDING_STEP.JOIN) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-4">
        <GlassCard>
          <div className="flex flex-col gap-5">
            <button
              onClick={() => { setStep(ONBOARDING_STEP.SELECT); setError(''); }}
              className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity self-start"
            >
              <IconChevronLeft size={20} stroke={2} />
              戻る
            </button>

            <h2 className="font-bold text-center">
              {step === ONBOARDING_STEP.CREATE ? '家族をつくる' : '招待コードで参加'}
            </h2>

            {step === ONBOARDING_STEP.CREATE && (
              <div>
                <p className="text-xs font-bold text-sub mb-2 pl-1">家族名</p>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="かわいけ"
                  maxLength={100}
                  className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none"
                />
              </div>
            )}

            {step === ONBOARDING_STEP.JOIN && (
              <div>
                <p className="text-xs font-bold text-sub mb-2 pl-1">招待コード</p>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none tracking-[0.2em] text-center font-bold"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-pink-accent text-center">{error}</p>
            )}

            <Button
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={() => goToProfile(step as FlowType)}
              className="self-center"
            >
              つぎへ
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ステップ3: プロフィール設定
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <GlassCard>
        <div className="flex flex-col gap-5">
          <button
            onClick={() => { setStep(flowType); setError(''); }}
            className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity self-start"
          >
            <IconChevronLeft size={20} stroke={2} />
            戻る
          </button>

          <h2 className="font-bold text-center">あなたのプロフィール</h2>

          {/* プレビュー */}
          <div className="flex items-center justify-center py-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: AVATAR_COLOR_VALUES[selectedColorIndex] }}
            >
              <AvatarIcon iconName={selectedIcon} size={32} className="text-white" />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-sub mb-2 pl-1">なまえ</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="名前"
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
                    <IconCheck
                      size={20}
                      stroke={3}
                      className="text-white transition-all"
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
                const Icon = icon.Icon;
                const isIconSelected = selectedIcon === icon.name;
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
                    {isIconSelected ? (
                      <GradientIcon icon={Icon} colorIndex={selectedColorIndex} size={24} />
                    ) : (
                      <Icon size={24} stroke={1.75} className="text-sub opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-pink-accent text-center">{error}</p>
          )}

          <Button
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={handleSubmit}
            disabled={submitting}
            className="self-center"
          >
            {submitting ? '処理中...' : 'はじめる'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
