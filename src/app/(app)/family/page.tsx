import { getUser } from '@/lib/actions/family';
import { db } from '@/lib/db';
import { families } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FamilyPageClient } from '@/components/family/FamilyPageClient';
import { requireAuth } from '@/lib/auth/session';

export default async function FamilyPage() {
  const session = await requireAuth();

  const [currentUser, family] = await Promise.all([
    getUser(session.user.id),
    db.query.families.findFirst({ where: eq(families.id, session.user.familyId) }),
  ]);

  if (!family) throw new Error('家族が見つかりません');

  return (
    <FamilyPageClient
      family={family}
      currentUser={currentUser}
    />
  );
}
