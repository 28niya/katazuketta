import { getUser, getFamilyMembers } from '@/lib/actions/family';
import { db } from '@/lib/db';
import { families } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { MembersPageClient } from '@/components/family/MembersPageClient';
import { BackLink } from '@/components/family/BackLink';

const DEMO_FAMILY_ID = process.env.DEMO_FAMILY_ID!;
const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function MembersPage() {
  const [currentUser, members, family] = await Promise.all([
    getUser(DEMO_USER_ID),
    getFamilyMembers(DEMO_FAMILY_ID),
    db.query.families.findFirst({ where: eq(families.id, DEMO_FAMILY_ID) }),
  ]);

  if (!family) throw new Error('家族が見つかりません');

  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">
      <BackLink />
      <h1 className="text-xl font-bold">ファミリー</h1>
      <MembersPageClient
        family={family}
        members={members}
        currentUser={currentUser}
      />
    </div>
  );
}
