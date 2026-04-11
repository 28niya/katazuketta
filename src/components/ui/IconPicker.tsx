'use client';

import { GradientIcon } from '@/components/ui/AreaIcon';
import type { TablerIconComponent } from '@/lib/icons';

type IconEntry = {
  name: string;
  label: string;
  Icon: TablerIconComponent;
};

type IconPickerProps = {
  icons: ReadonlyArray<IconEntry>;
  value: string;
  onChange: (name: string) => void;
  colorIndex: number;
};

export function IconPicker({ icons, value, onChange, colorIndex }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {icons.map((icon) => {
        const Icon = icon.Icon;
        const isSelected = value === icon.name;
        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onChange(icon.name)}
            className={`flex items-center justify-center p-3 rounded-[20px] transition-all ${
              isSelected
                ? 'bg-white/80 shadow-sm border border-white'
                : 'border border-transparent hover:bg-white/40'
            }`}
          >
            {isSelected ? (
              <GradientIcon icon={Icon} colorIndex={colorIndex} size={24} />
            ) : (
              <Icon size={24} stroke={1.75} className="text-sub opacity-70" />
            )}
          </button>
        );
      })}
    </div>
  );
}
