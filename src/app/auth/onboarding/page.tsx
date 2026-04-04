import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/auth/OnboardingForm';

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if (!session.user.needsOnboarding) redirect('/home');

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 mb-8">
        <i className="bx bxs-spray-can text-5xl gradient-icon bg-gradient-to-br from-[#6ee7b7] to-[#f472b6]" />
        <h1 className="text-3xl font-bold">ようこそ!</h1>
        <p className="text-sm text-sub">家族をつくるか、招待コードで参加しましょう</p>
      </div>
      <OnboardingForm email={session.user.email!} name={session.user.name ?? ''} />
    </div>
  );
}
