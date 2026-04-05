type LevelGaugeProps = {
  familyName: string;
  level: number;
  totalExp: number;
  currentThreshold: number;
  nextThreshold: number;
  progress: number;
};

export function LevelGauge({ familyName, level, totalExp, currentThreshold, nextThreshold, progress }: LevelGaugeProps) {
  const expNeeded = nextThreshold - totalExp;
  const dashOffset = 100 - Math.min(progress * 100, 100);

  return (
      <div
        className="relative w-70 h-70"
        style={{ filter: 'drop-shadow(0 12px 24px rgba(31,38,135,0.06))' }}
      >
        {/* SVGゲージ */}
        <svg viewBox="0 0 36 36" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="grad-circ" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4facfe" />
              <stop offset="100%" stopColor="#ed64a6" />
            </linearGradient>
          </defs>
          {/* 背景の細い円 */}
          <path
            className="text-white/60"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            strokeLinecap="round"
          />
          {/* 進行する円 */}
          <path
            stroke="url(#grad-circ)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: dashOffset,
              transition: 'stroke-dashoffset 1s ease',
            }}
          />
        </svg>

        {/* 中央のすりガラスUI */}
        <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center p-8 bg-white/60 rounded-full scale-[0.82] border border-white/80 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <span className="text-xs font-bold text-sub">{familyName}</span>
          <div className="text-6xl font-bold leading-none bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Lv.{level}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-sub">次のレベルまで</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                {expNeeded}
              </span>
              <span className="text-xs font-bold bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                EXP
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
