'use client';

export const BUTTON_VARIANTS = {
  NORMAL: 'NORMAL',
  PRIMARY: 'PRIMARY',
  GLASS: 'GLASS',
  ACCENT: 'ACCENT',
  LIKE: 'LIKE',
  LIKE_ACTIVE: 'LIKE_ACTIVE',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  [BUTTON_VARIANTS.NORMAL]:
    'bg-white/40 border-white/60 text-sub shadow-[0_2px_4px_rgba(0,0,0,0.02)]',
  [BUTTON_VARIANTS.PRIMARY]:
    'bg-white/85 border-white/95 shadow-[0_4px_12px_rgba(79,172,254,0.2),0_4px_12px_rgba(237,100,166,0.2),inset_0_0_20px_rgba(255,255,255,0.5)]',
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
  const isPrimary = variant === BUTTON_VARIANTS.PRIMARY;

  return (
    <button
      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full border font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-default disabled:active:scale-100 ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {isPrimary ? (
        <span className="bg-gradient-to-br from-[#4facfe] to-[#ed64a6] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
