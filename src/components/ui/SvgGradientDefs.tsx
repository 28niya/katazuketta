import { AREA_COLORS } from '@/types';

// ブランドロゴ用のグラデーション (AREA_COLORSとは別系)
const BRAND_GRADIENT = { from: '#6ee7b7', to: '#f472b6' };

// Tabler アイコンの viewBox が常に "0 0 24 24" なので、userSpaceOnUse で 24x24 に固定する。
// objectBoundingBox (デフォルト) だと、水平/垂直線やドットなど bbox が 0 次元の path で
// グラデーションが degenerate になり WebKit 系で描画されない問題を避ける。
export function SvgGradientDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {AREA_COLORS.map((c, i) => (
          <linearGradient
            key={i}
            id={`area-gradient-${i}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
          >
            <stop offset="0%" stopColor={c.gradFrom} />
            <stop offset="100%" stopColor={c.gradTo} />
          </linearGradient>
        ))}
        <linearGradient
          id="brand-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor={BRAND_GRADIENT.from} />
          <stop offset="100%" stopColor={BRAND_GRADIENT.to} />
        </linearGradient>
      </defs>
    </svg>
  );
}
