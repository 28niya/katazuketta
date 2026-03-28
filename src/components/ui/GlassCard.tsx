type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-glass backdrop-blur-glass border border-glass-border shadow-glass rounded-3xl p-6 ${className}`}>
      {children}
    </div>
  );
}
