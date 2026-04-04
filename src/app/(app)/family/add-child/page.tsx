import { getUser } from '@/lib/actions/family';
import { db } from '@/lib/db';
import { families } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { AddChildWrapper } from '@/components/family/AddChildWrapper';
import { BackLink } from '@/components/family/BackLink';
import { requireAuth } from '@/lib/auth/session';

export default async function AddChildPage() {
  const session = await requireAuth();

  const [currentUser, family] = await Promise.all([
    getUser(session.user.id),
    db.query.families.findFirst({ where: eq(families.id, session.user.familyId) }),
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
