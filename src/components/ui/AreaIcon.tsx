import { AREA_COLORS } from '@/types';

type AreaIconProps = {
  iconName: string;
  colorIndex: number;
  size?: string;
};

export function AreaIcon({ iconName, colorIndex, size = 'text-4xl' }: AreaIconProps) {
  const color = AREA_COLORS[colorIndex % AREA_COLORS.length];

  return (
    <i
      className={`bx ${iconName} ${size} gradient-icon bg-gradient-to-br ${color.gradient}`}
    />
  );
}
