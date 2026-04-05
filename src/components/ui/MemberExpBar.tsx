'use client';

import { AREA_COLORS } from '@/types';

type MemberStat = {
  id: string;
  name: string;
  avatarIcon: string;
  avatarColor: string | null;
  exp: number;
};

type MemberExpBarProps = {
  members: MemberStat[];
};

export function MemberExpBar({ members }: MemberExpBarProps) {
  if (members.length === 0) return null;

  const maxExp = Math.max(...members.map((m) => m.exp), 1);
  const sorted = [...members].sort((a, b) => b.exp - a.exp);

  return (
    <div className="w-full flex flex-col gap-2.5 px-2">
      {sorted.map((member) => {
        const percent = maxExp > 0 ? (member.exp / maxExp) * 100 : 0;
        const colorIndex = AREA_COLORS.findIndex((c) => c.css.match(/#[0-9a-f]{6}/i)?.[0] === member.avatarColor);
        const color = AREA_COLORS[colorIndex >= 0 ? colorIndex : 0];

        return (
          <div key={member.id} className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: member.avatarColor ?? '#4a5568' }}
            >
              <i className={`bx ${member.avatarIcon} text-sm text-white`} />
            </div>
            <div className="flex-grow flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-bold text-sub">
                <span>{member.name}</span>
                <span>{member.exp.toLocaleString()} EXP</span>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(percent, 2)}%`,
                    background: color.css,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
