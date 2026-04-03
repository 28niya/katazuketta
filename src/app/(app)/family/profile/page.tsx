import { getUser } from '@/lib/actions/family';
import { ProfileForm } from '@/components/family/ProfileForm';
import { BackLink } from '@/components/family/BackLink';

const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function ProfilePage() {
  const user = await getUser(DEMO_USER_ID);

  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">
      <BackLink />
      <h1 className="text-xl font-bold">プロフィール編集</h1>
      <ProfileForm user={user} />
    </div>
  );
}
