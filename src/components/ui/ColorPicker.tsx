'use client';

import { IconCheck } from '@tabler/icons-react';
import { AREA_COLORS } from '@/types';

type ColorPickerProps = {
  value: number;
  onChange: (index: number) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {AREA_COLORS.map((color, i) => {
        const isSelected = value === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
            style={{
              background: color.css,
              opacity: isSelected ? 1 : 0.6,
              transform: isSelected ? 'scale(1.1)' : 'scale(0.9)',
              boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            <IconCheck
              size={20}
              stroke={3}
              className="text-white transition-all"
              style={{
                opacity: isSelected ? 1 : 0,
                transform: isSelected ? 'scale(1)' : 'scale(0.5)',
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
