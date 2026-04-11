'use client';

import { useRouter } from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';

export function BackLink() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity"
    >
      <IconChevronLeft size={20} stroke={2} />
      戻る
    </button>
  );
}
