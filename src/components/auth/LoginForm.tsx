'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';

type Mode = 'select' | 'child';

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('select');
  const [familyCode, setFamilyCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/home' });
  };

  const handleChildLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const result = await signIn('child-pin', {
        familyCode,
        nickname,
        pin,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'PINが正しくありません' : result.error);
      } else {
        window.location.href = '/home';
      }
    } catch {
      setError('ログインに失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="w-full max-w-sm flex flex-col gap-4">
        <GlassCard>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full py-3 bg-white/80 border border-white/90 rounded-2xl font-bold text-sm transition-all hover:bg-white active:scale-95"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Googleでログイン
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-sub/20" />
              <span className="text-xs text-sub">または</span>
              <div className="flex-1 h-px bg-sub/20" />
            </div>

            <Button
              variant={BUTTON_VARIANTS.GLASS}
              onClick={() => setMode('child')}
              className="w-full justify-center"
            >
              <i className="bx bxs-baby-carriage text-lg" />
              子どもアカウントでログイン
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <GlassCard>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => { setMode('select'); setError(''); }}
            className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity self-start"
          >
            <i className="bx bx-chevron-left text-xl" />
            戻る
          </button>

          <h2 className="font-bold text-center">子どもアカウント</h2>

          <div>
            <label className="text-xs text-sub block mb-1">家族コード</label>
            <input
              type="text"
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none tracking-[0.2em] text-center font-bold"
            />
          </div>

          <div>
            <label className="text-xs text-sub block mb-1">ニックネーム</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="たろう"
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-sub block mb-1">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="123456"
              className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 text-sm focus:bg-white/70 transition-colors outline-none tracking-[0.3em] text-center"
            />
          </div>

          {error && (
            <p className="text-xs text-pink-accent text-center">{error}</p>
          )}

          <Button
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={handleChildLogin}
            disabled={submitting || !familyCode || !nickname || pin.length < 6}
            className="w-full justify-center"
          >
            {submitting ? 'ログイン中...' : 'ログイン'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
