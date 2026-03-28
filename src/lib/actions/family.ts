'use server';

import { db } from '@/lib/db';
import { families, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { calculateLevel, progressToNextLevel, expThresholdForLevel } from '@/lib/exp';
import { getHouseStage, getGardenItems } from '@/lib/evolution';

export async function getFamilyWithLevel(familyId: string) {
  const family = await db.query.families.findFirst({
    where: eq(families.id, familyId),
  });

  if (!family) throw new Error('家族が見つかりません');

  const level = calculateLevel(family.totalExp);
  const progress = progressToNextLevel(family.totalExp);
  const currentThreshold = expThresholdForLevel(level);
  const nextThreshold = expThresholdForLevel(level + 1);
  const houseStage = getHouseStage(level);
  const gardenItems = getGardenItems(level);

  return {
    ...family,
    level,
    progress,
    currentThreshold,
    nextThreshold,
    houseStage,
    gardenItems,
  };
}

export async function getFamilyMembers(familyId: string) {
  return db.query.users.findMany({
    where: eq(users.familyId, familyId),
  });
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 紛らわしい文字を除外
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createFamily(name: string) {
  const inviteCode = generateInviteCode();

  const [family] = await db
    .insert(families)
    .values({ name, inviteCode })
    .returning();

  return family;
}

export async function joinFamilyByCode(inviteCode: string) {
  const family = await db.query.families.findFirst({
    where: eq(families.inviteCode, inviteCode.toUpperCase()),
  });

  if (!family) throw new Error('コードが見つかりません');

  return family;
}
