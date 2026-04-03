'use client';

import { useRouter } from 'next/navigation';

export function BackLink() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm text-sub hover:opacity-70 transition-opacity"
    >
      <i className="bx bx-chevron-left text-xl" />
      戻る
    </button>
  );
}
