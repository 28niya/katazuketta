'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconHomeSpark,
  IconFriends,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import { GradientIcon } from '@/components/ui/AreaIcon';

const NAV_ITEMS: { href: string; Icon: TablerIcon; label: string }[] = [
  { href: '/home', Icon: IconHome, label: 'おうち' },
  { href: '/family', Icon: IconFriends, label: 'かぞく' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* モバイル: ボトムナビ */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-xs z-50 md:hidden">
        <div className="bg-glass backdrop-blur-glass border border-glass-border shadow-glass flex rounded-full p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition-all
                  ${isActive
                    ? 'bg-white/80 text-main shadow-sm'
                    : 'text-sub'
                  }`}
              >
                <Icon size={18} stroke={2} className={isActive ? 'text-green-accent' : ''} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* PC: 上部ナビ */}
      <nav className="hidden md:block bg-glass backdrop-blur-glass border border-glass-border shadow-glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-xl font-bold">
            <GradientIcon icon={IconHomeSpark} gradientId="brand-gradient" size={26} stroke={1.75} />
            かたづけッタ
          </div>
          <div className="flex gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.Icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all
                    ${isActive
                      ? 'bg-white/60 text-main shadow-sm'
                      : 'text-sub hover:bg-white/30'
                    }`}
                >
                  <Icon size={18} stroke={2} className={isActive ? 'text-green-accent' : ''} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
