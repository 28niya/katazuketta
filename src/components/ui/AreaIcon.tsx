import { createElement } from 'react';
import { getAreaIcon, type TablerIconComponent } from '@/lib/icons';

type AreaIconProps = {
  iconName: string;
  colorIndex: number;
  size?: number;
  stroke?: number;
  className?: string;
};

export function AreaIcon({
  iconName,
  colorIndex,
  size = 36,
  stroke = 1.75,
  className,
}: AreaIconProps) {
  return createElement(getAreaIcon(iconName), {
    size,
    stroke,
    className,
    style: { stroke: `url(#area-gradient-${colorIndex})` },
  });
}

type GradientIconProps = {
  icon: TablerIconComponent;
  colorIndex?: number;
  gradientId?: string;
  size?: number;
  stroke?: number;
  className?: string;
};

// Tabler コンポーネントを直接渡してグラデーション描画する汎用版
export function GradientIcon({
  icon,
  colorIndex,
  gradientId,
  size = 24,
  stroke = 1.75,
  className,
}: GradientIconProps) {
  const id = gradientId ?? `area-gradient-${colorIndex ?? 0}`;
  return createElement(icon, {
    size,
    stroke,
    className,
    style: { stroke: `url(#${id})` },
  });
}
