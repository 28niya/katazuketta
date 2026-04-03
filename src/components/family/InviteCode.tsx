'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';

type Props = {
  code: string;
};

export function InviteCode({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-sub mb-1">招待コード</p>
          <span className="text-2xl font-bold tracking-[0.2em] bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            {code}
          </span>
        </div>
        <Button variant={BUTTON_VARIANTS.GLASS} onClick={handleCopy} className="text-xs">
          <i className={`bx ${copied ? 'bx-check' : 'bx-copy'} text-base`} />
          {copied ? 'コピー済み' : 'コピー'}
        </Button>
      </div>
    </GlassCard>
  );
}
