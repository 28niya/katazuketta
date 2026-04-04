import { getUser } from '@/lib/actions/family';
import { ProfileForm } from '@/components/family/ProfileForm';
import { BackLink } from '@/components/family/BackLink';
import { requireAuth } from '@/lib/auth/session';

export default async function ProfilePage() {
  const session = await requireAuth();
  const user = await getUser(session.user.id);

  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">
      <BackLink />
      <h1 className="text-xl font-bold">プロフィール編集</h1>
      <ProfileForm user={user} />
    </div>
  );
}
