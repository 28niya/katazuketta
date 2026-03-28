type ExpBarProps = {
  level: number;
  totalExp: number;
  currentThreshold: number;
  nextThreshold: number;
  progress: number;
};

export function ExpBar({ level, totalExp, currentThreshold, nextThreshold, progress }: ExpBarProps) {
  const expInLevel = totalExp - currentThreshold;
  const expNeeded = nextThreshold - currentThreshold;

  return (
    <div className="bg-glass backdrop-blur-glass border border-glass-border shadow-glass rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <i className="bx bxs-star text-highlight" />
          Lv. {level}
        </div>
        <span className="text-xs font-bold text-sub">
          {expInLevel} / {expNeeded} EXP
        </span>
      </div>
      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-accent rounded-full transition-all duration-800 ease-out"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
