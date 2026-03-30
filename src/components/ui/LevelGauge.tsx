type LevelGaugeProps = {
  level: number;
  totalExp: number;
  currentThreshold: number;
  nextThreshold: number;
  progress: number;
};

export function LevelGauge({ level, totalExp, currentThreshold, nextThreshold, progress }: LevelGaugeProps) {
  const expNeeded = nextThreshold - totalExp;
  const dashOffset = 100 - Math.min(progress * 100, 100);

  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px]"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/60 rounded-full scale-[0.82] border border-white/80 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-5xl font-bold leading-none bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Lv.{level}
          </div>
          <p className="text-xs text-sub mt-2">次のレベルまで</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
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
