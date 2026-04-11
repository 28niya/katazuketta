import { createElement } from 'react';
import { getAvatarIcon } from '@/lib/icons';

type AvatarIconProps = {
  iconName: string;
  size?: number;
  stroke?: number;
  className?: string;
};

export function AvatarIcon({
  iconName,
  size = 20,
  stroke = 2,
  className,
}: AvatarIconProps) {
  return createElement(getAvatarIcon(iconName), { size, stroke, className });
}
