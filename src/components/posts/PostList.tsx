import { PostCard } from './PostCard';
import { db } from '@/lib/db';
import { users, reactions, areas } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type Post = {
  id: string;
  userId: string;
  areaId: string;
  memo: string | null;
  earnedExp: number;
  createdAt: Date;
};

type PostListProps = {
  posts: Post[];
  currentUserId: string;
};

export async function PostList({ posts, currentUserId }: PostListProps) {
  // ユーザー情報を一括取得
  const userIds = [...new Set(posts.map((p) => p.userId))];
  const userRecords = await Promise.all(
    userIds.map((id) => db.query.users.findFirst({ where: eq(users.id, id) })),
  );
  const userMap = new Map(userRecords.filter(Boolean).map((u) => [u!.id, u!]));

  // エリア情報を一括取得
  const areaIds = [...new Set(posts.map((p) => p.areaId))];
  const areaRecords = await Promise.all(
    areaIds.map((id) => db.query.areas.findFirst({ where: eq(areas.id, id) })),
  );
  const areaMap = new Map(areaRecords.filter(Boolean).map((a) => [a!.id, a!]));

  // リアクション情報を一括取得
  const reactionData = await Promise.all(
    posts.map(async (post) => {
      const allReactions = await db.query.reactions.findMany({
        where: eq(reactions.postId, post.id),
      });
      const hasReacted = allReactions.some((r) => r.userId === currentUserId);
      return { postId: post.id, count: allReactions.length, hasReacted };
    }),
  );
  const reactionMap = new Map(reactionData.map((r) => [r.postId, r]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => {
        const user = userMap.get(post.userId);
        const area = areaMap.get(post.areaId);
        const reaction = reactionMap.get(post.id);
        return (
          <PostCard
            key={post.id}
            post={post}
            area={area ? { name: area.name, iconName: area.iconName, colorIndex: area.colorIndex } : null}
            userName={user?.name ?? '不明'}
            avatarColor={user?.avatarColor ?? '#38b2ac'}
            avatarIcon={user?.avatarIcon ?? 'bxs-user'}
            reactionCount={reaction?.count ?? 0}
            hasReacted={reaction?.hasReacted ?? false}
            currentUserId={currentUserId}
          />
        );
      })}
    </div>
  );
}
