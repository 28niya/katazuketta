import { getUser } from '@/lib/actions/family';
import { db } from '@/lib/db';
import { families } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FamilyPageClient } from '@/components/family/FamilyPageClient';

const DEMO_FAMILY_ID = process.env.DEMO_FAMILY_ID!;
const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function FamilyPage() {
  const [currentUser, family] = await Promise.all([
    getUser(DEMO_USER_ID),
    db.query.families.findFirst({ where: eq(families.id, DEMO_FAMILY_ID) }),
  ]);

  if (!family) throw new Error('家族が見つかりません');

  return (
    <FamilyPageClient
      family={family}
      currentUser={currentUser}
    />
  );
}
