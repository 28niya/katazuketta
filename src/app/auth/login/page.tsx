import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 mb-8">
        <i className="bx bxs-spray-can text-5xl gradient-icon bg-gradient-to-br from-[#6ee7b7] to-[#f472b6]" />
        <h1 className="text-3xl font-bold">かたづけッタ</h1>
        <p className="text-sm text-sub">家族で「おかたづけ」をたのしく</p>
      </div>
      <LoginForm />
    </div>
  );
}
