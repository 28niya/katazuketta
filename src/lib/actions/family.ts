'use server';

import { db } from '@/lib/db';
import { families, users, expLogs } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { calculateLevel, progressToNextLevel, expThresholdForLevel } from '@/lib/exp';
import { USER_ROLES, AUTH_TYPES } from '@/types';
export async function getFamilyWithLevel(familyId: string) {
  const family = await db.query.families.findFirst({
    where: eq(families.id, familyId),
  });

  if (!family) throw new Error('家族が見つかりません');

  const level = calculateLevel(family.totalExp);
  const progress = progressToNextLevel(family.totalExp);
  const currentThreshold = expThresholdForLevel(level);
  const nextThreshold = expThresholdForLevel(level + 1);

  return {
    ...family,
    level,
    progress,
    currentThreshold,
    nextThreshold,
  };
}

export async function getUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) throw new Error('ユーザーが見つかりません');
  return user;
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

export async function createChildAccount(
  familyId: string,
  inviteCode: string,
  nickname: string,
  pin: string,
  avatarIcon: string,
  avatarColor: string,
) {
  // バリデーション
  if (!nickname.trim()) throw new Error('ニックネームを入力してください');
  if (nickname.length > 50) throw new Error('ニックネームは50文字以内にしてください');
  if (!/^\d{6,8}$/.test(pin)) throw new Error('PINは数字6〜8桁で入力してください');

  // 同じ家族内で重複するニックネームをチェック
  const existing = await db.query.users.findFirst({
    where: and(eq(users.familyId, familyId), eq(users.name, nickname.trim())),
  });
  if (existing) throw new Error('同じ名前のメンバーがいます');

  // ダミーメール生成
  const email = `${inviteCode}-${nickname.trim()}@child.internal`;

  // PIN のハッシュ化（MVP では簡易ハッシュ、本番では bcrypt 等に置換）
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const pinHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const [child] = await db
    .insert(users)
    .values({
      familyId,
      email,
      name: nickname.trim(),
      role: USER_ROLES.MEMBER,
      authType: AUTH_TYPES.CHILD_PIN,
      avatarIcon,
      avatarColor,
      pinHash,
    })
    .returning();

  return child;
}

export async function onboardCreateFamily(
  email: string,
  userName: string,
  familyName: string,
  avatarIcon: string,
  avatarColor: string,
) {
  const family = await createFamily(familyName);
  const [user] = await db
    .insert(users)
    .values({
      familyId: family.id,
      email,
      name: userName.trim(),
      role: USER_ROLES.ADMIN,
      authType: AUTH_TYPES.OAUTH,
      avatarIcon,
      avatarColor,
    })
    .returning();
  return { family, user };
}

export async function onboardJoinFamily(
  email: string,
  userName: string,
  inviteCode: string,
  avatarIcon: string,
  avatarColor: string,
) {
  const family = await joinFamilyByCode(inviteCode);
  const [user] = await db
    .insert(users)
    .values({
      familyId: family.id,
      email,
      name: userName.trim(),
      role: USER_ROLES.MEMBER,
      authType: AUTH_TYPES.OAUTH,
      avatarIcon,
      avatarColor,
    })
    .returning();
  return { family, user };
}

export async function getMemberExpStats(familyId: string) {
  const members = await db.query.users.findMany({
    where: eq(users.familyId, familyId),
  });

  const expResults = await db
    .select({
      userId: expLogs.userId,
      totalExp: sql<number>`coalesce(sum(${expLogs.amount}), 0)::int`,
    })
    .from(expLogs)
    .where(eq(expLogs.familyId, familyId))
    .groupBy(expLogs.userId);

  const expMap = Object.fromEntries(expResults.map((r) => [r.userId, r.totalExp]));

  return members.map((m) => ({
    id: m.id,
    name: m.name,
    avatarIcon: m.avatarIcon,
    avatarColor: m.avatarColor,
    exp: expMap[m.id] ?? 0,
  }));
}

export async function updateProfile(
  userId: string,
  name: string,
  avatarIcon: string,
  avatarColor: string,
) {
  if (!name.trim()) throw new Error('名前を入力してください');
  if (name.length > 50) throw new Error('名前は50文字以内にしてください');

  const [updated] = await db
    .update(users)
    .set({ name: name.trim(), avatarIcon, avatarColor })
    .where(eq(users.id, userId))
    .returning();

  return updated;
}
