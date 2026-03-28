'use server';

import { db } from '@/lib/db';
import { posts, expLogs, families, reactions } from '@/lib/db/schema';
import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { EXP_PER_POST, EXP_REASONS } from '@/types';

export async function createPost(
  familyId: string,
  userId: string,
  areaId: string,
  memo?: string,
) {
  if (memo && memo.length > 200) {
    throw new Error('メモは200文字以内で入力してください');
  }

  const result = await db.transaction(async (tx) => {
    const [newPost] = await tx
      .insert(posts)
      .values({
        familyId,
        userId,
        areaId,
        memo: memo || null,
        earnedExp: EXP_PER_POST,
      })
      .returning();

    await tx.insert(expLogs).values({
      familyId,
      userId,
      postId: newPost.id,
      amount: EXP_PER_POST,
      reason: EXP_REASONS.DAILY_POST,
    });

    const [updatedFamily] = await tx
      .update(families)
      .set({
        totalExp: sql`${families.totalExp} + ${EXP_PER_POST}`,
        updatedAt: new Date(),
      })
      .where(eq(families.id, familyId))
      .returning();

    return { post: newPost, totalExp: updatedFamily.totalExp };
  });

  return result;
}

export async function getPosts(familyId: string, limit = 20, offset = 0) {
  return db.query.posts.findMany({
    where: and(eq(posts.familyId, familyId), isNull(posts.deletedAt)),
    orderBy: [desc(posts.createdAt)],
    limit,
    offset,
  });
}

export async function updatePost(
  postId: string,
  userId: string,
  memo: string,
) {
  if (memo.length > 200) {
    throw new Error('メモは200文字以内で入力してください');
  }

  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, postId), isNull(posts.deletedAt)));

  if (!post) throw new Error('投稿が見つかりません');
  if (post.userId !== userId) throw new Error('この投稿を編集する権限がありません');

  const [updated] = await db
    .update(posts)
    .set({ memo })
    .where(eq(posts.id, postId))
    .returning();

  return updated;
}

export async function deletePost(
  postId: string,
  userId: string,
  userRole: string,
) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, postId), isNull(posts.deletedAt)));

  if (!post) throw new Error('投稿が見つかりません');
  if (post.userId !== userId && userRole !== 'ADMIN') {
    throw new Error('この投稿を削除する権限がありません');
  }

  const [deleted] = await db
    .update(posts)
    .set({ deletedAt: new Date() })
    .where(eq(posts.id, postId))
    .returning();

  return deleted;
}

export async function toggleReaction(postId: string, userId: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, postId), isNull(posts.deletedAt)));

  if (!post) throw new Error('投稿が見つかりません');

  const [existing] = await db
    .select()
    .from(reactions)
    .where(and(eq(reactions.postId, postId), eq(reactions.userId, userId)));

  if (existing) {
    await db.delete(reactions).where(eq(reactions.id, existing.id));
    return { reacted: false };
  }

  await db.insert(reactions).values({ postId, userId });
  return { reacted: true };
}

export async function getReactionCount(postId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reactions)
    .where(eq(reactions.postId, postId));

  return result[0]?.count ?? 0;
}
