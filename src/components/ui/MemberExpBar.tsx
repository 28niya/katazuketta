'use client';

import { AREA_COLORS, getColorIndexByAvatarColor } from '@/types';

type MemberStat = {
  id: string;
  name: string;
  avatarIcon: string;
  avatarColor: string | null;
  exp: number;
  postCount: number;
};

type MemberExpBarProps = {
  members: MemberStat[];
  totalExp: number;
};

export function MemberExpBar({ members, totalExp }: MemberExpBarProps) {
  if (members.length === 0) return null;

  const sorted = [...members].sort((a, b) => b.exp - a.exp);

  return (
    <div className="w-full flex flex-col gap-3 px-2 mt-2">
      {sorted.map((member) => {
        const percent = totalExp > 0 ? (member.exp / totalExp) * 100 : 0;
        const colorIndex = getColorIndexByAvatarColor(member.avatarColor);
        const color = AREA_COLORS[colorIndex];

        return (
          <div key={member.id} className="flex items-center gap-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: member.avatarColor ?? '#4a5568' }}
            >
              <i className={`bx ${member.avatarIcon} text-sm text-white`} />
            </div>
            <div className="flex-grow flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px] font-bold text-sub">
                <span>{member.name}</span>
                <span>{member.exp.toLocaleString()} / {totalExp.toLocaleString()} EXP</span>
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
