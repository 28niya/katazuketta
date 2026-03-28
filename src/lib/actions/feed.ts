'use server';

import { db } from '@/lib/db';
import { posts, users, areas, reactions } from '@/lib/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';

export async function getFeedData(familyId: string, currentUserId: string) {
  // 投稿を取得
  const postList = await db.query.posts.findMany({
    where: and(eq(posts.familyId, familyId), isNull(posts.deletedAt)),
    orderBy: [desc(posts.createdAt)],
    limit: 20,
  });

  // ユーザー情報を一括取得
  const userIds = [...new Set(postList.map((p) => p.userId))];
  const userRecords = await Promise.all(
    userIds.map((id) => db.query.users.findFirst({ where: eq(users.id, id) })),
  );
  const userMap: Record<string, { id: string; name: string; avatarColor: string | null; avatarIcon: string }> = {};
  for (const u of userRecords) {
    if (u) userMap[u.id] = { id: u.id, name: u.name, avatarColor: u.avatarColor, avatarIcon: u.avatarIcon };
  }

  // エリア情報を一括取得
  const areaIds = [...new Set(postList.map((p) => p.areaId))];
  const areaRecords = await Promise.all(
    areaIds.map((id) => db.query.areas.findFirst({ where: eq(areas.id, id) })),
  );
  const areaMap: Record<string, { id: string; name: string; iconName: string; colorIndex: number }> = {};
  for (const a of areaRecords) {
    if (a) areaMap[a.id] = { id: a.id, name: a.name, iconName: a.iconName, colorIndex: a.colorIndex };
  }

  // リアクション情報を一括取得
  const reactionMap: Record<string, { count: number; hasReacted: boolean }> = {};
  for (const post of postList) {
    const allReactions = await db.query.reactions.findMany({
      where: eq(reactions.postId, post.id),
    });
    reactionMap[post.id] = {
      count: allReactions.length,
      hasReacted: allReactions.some((r) => r.userId === currentUserId),
    };
  }

  return {
    posts: postList,
    users: userMap,
    areaMap,
    reactions: reactionMap,
  };
}
