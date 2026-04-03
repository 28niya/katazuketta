'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/home', icon: 'bxs-home-smile', label: 'おうち' },
  { href: '/family', icon: 'bxs-group', label: 'かぞく' },
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
                <i className={`bx ${item.icon} text-lg ${isActive ? 'text-green-accent' : ''}`} />
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
            <i className="bx bxs-spray-can text-2xl gradient-icon bg-gradient-to-br from-[#6ee7b7] to-[#f472b6]" />
            かたづけッタ
          </div>
          <div className="flex gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
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
                  <i className={`bx ${item.icon} text-lg ${isActive ? 'text-green-accent' : ''}`} />
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
