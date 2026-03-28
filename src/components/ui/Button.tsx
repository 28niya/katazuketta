'use client';

export const BUTTON_VARIANTS = {
  GLASS: 'GLASS',
  ACCENT: 'ACCENT',
  LIKE: 'LIKE',
  LIKE_ACTIVE: 'LIKE_ACTIVE',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  [BUTTON_VARIANTS.GLASS]:
    'bg-white/40 border-white/70 text-sub',
  [BUTTON_VARIANTS.ACCENT]:
    'bg-green-accent/20 border-green-accent/30 text-green-accent',
  [BUTTON_VARIANTS.LIKE]:
    'bg-white/40 border-white/70 text-sub',
  [BUTTON_VARIANTS.LIKE_ACTIVE]:
    'bg-white border-white text-pink-accent shadow-[0_4px_12px_rgba(237,100,166,0.15)]',
};

type ButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = BUTTON_VARIANTS.GLASS, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`flex items-center gap-1.5 px-4 py-2 rounded-[20px] border font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-default disabled:active:scale-100 ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
