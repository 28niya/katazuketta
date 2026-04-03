import { getUser } from '@/lib/actions/family';
import { db } from '@/lib/db';
import { families } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { AddChildForm } from '@/components/family/AddChildForm';
import { BackLink } from '@/components/family/BackLink';
import { AddChildWrapper } from '@/components/family/AddChildWrapper';

const DEMO_FAMILY_ID = process.env.DEMO_FAMILY_ID!;
const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function AddChildPage() {
  const [currentUser, family] = await Promise.all([
    getUser(DEMO_USER_ID),
    db.query.families.findFirst({ where: eq(families.id, DEMO_FAMILY_ID) }),
  ]);

  if (currentUser.role !== 'ADMIN' || !family) redirect('/family');

  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">
      <BackLink />
      <h1 className="text-xl font-bold">子どもアカウントを追加</h1>
      <GlassCard>
        <AddChildWrapper familyId={family.id} inviteCode={family.inviteCode} />
      </GlassCard>
    </div>
  );
}
