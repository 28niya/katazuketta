import { IconHomeSpark } from '@tabler/icons-react';
import { GradientIcon } from '@/components/ui/AreaIcon';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 mb-8">
        <GradientIcon icon={IconHomeSpark} gradientId="brand-gradient" size={56} stroke={1.5} />
        <h1 className="text-3xl font-bold">かたづけッタ</h1>
        <p className="text-sm text-sub">家族で「おかたづけ」をたのしく</p>
      </div>
      <LoginForm />
    </div>
  );
}
