import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { families, users, areas, posts, expLogs, reactions } from './schema';
import { DEFAULT_AREAS, EXP_PER_POST, EXP_REASONS, DEV_USERS } from '../../types';
import { sql } from 'drizzle-orm';

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  // 家族を作成
  const [family] = await db
    .insert(families)
    .values({ name: 'テスト家族', inviteCode: 'ABC123' })
    .returning();

  console.log('Family created:', family.id, family.name);

  // ユーザーを作成
  const usersData = DEV_USERS.map((u) => ({ familyId: family.id, ...u }));

  const createdUsers = await db.insert(users).values(usersData).returning();
  for (const u of createdUsers) {
    console.log('User created:', u.id, u.name, `(${u.role})`);
  }

  const [mama, papa, taro] = createdUsers;

  // プリセットエリアを作成
  const areasData = DEFAULT_AREAS.map((area, i) => ({
    familyId: family.id,
    name: area.name,
    iconName: area.iconName,
    colorIndex: area.colorIndex,
    displayOrder: i,
  }));

  const createdAreas = await db.insert(areas).values(areasData).returning();
  for (const a of createdAreas) {
    console.log('Area created:', a.id, a.name);
  }

  // エリアをマップ化
  const areaByName = new Map(createdAreas.map((a) => [a.name, a]));

  // 投稿データを作成
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  const postsData = [
    { userId: mama.id, areaName: 'キッチン', memo: '排水口ピカピカにしたよ!', hoursAgo: 1 },
    { userId: papa.id, areaName: 'お風呂', memo: 'カビ取りがんばった', hoursAgo: 3 },
    { userId: taro.id, areaName: 'リビング', memo: 'そうじきかけた!', hoursAgo: 5 },
    { userId: mama.id, areaName: 'トイレ', memo: null, hoursAgo: 8 },
    { userId: papa.id, areaName: '玄関', memo: 'くつ並べた', hoursAgo: 24 },
    { userId: taro.id, areaName: '洗面所', memo: '歯ブラシ立て洗ったよ!', hoursAgo: 26 },
  ];

  let totalExp = 0;
  const createdPosts: { id: string }[] = [];

  for (const p of postsData) {
    const area = areaByName.get(p.areaName);
    if (!area) continue;

    const [post] = await db
      .insert(posts)
      .values({
        familyId: family.id,
        userId: p.userId,
        areaId: area.id,
        memo: p.memo,
        earnedExp: EXP_PER_POST,
        createdAt: hoursAgo(p.hoursAgo),
      })
      .returning();

    await db.insert(expLogs).values({
      familyId: family.id,
      userId: p.userId,
      postId: post.id,
      amount: EXP_PER_POST,
      reason: EXP_REASONS.DAILY_POST,
    });

    createdPosts.push(post);
    totalExp += EXP_PER_POST;
    console.log('Post created:', post.id, p.areaName, `by ${p.userId === mama.id ? 'ママ' : p.userId === papa.id ? 'パパ' : 'たろう'}`);
  }

  // 家族のtotalExpを更新
  await db
    .update(families)
    .set({ totalExp, updatedAt: new Date() })
    .where(sql`id = ${family.id}`);

  console.log('Total EXP:', totalExp);

  // リアクションを追加（createdPostsを使う）
  // ママの投稿にパパが「たすかる」
  await db.insert(reactions).values({ postId: createdPosts[0].id, userId: papa.id });
  console.log('Reaction: パパ → ママの投稿');
  // パパの投稿にたろうが「たすかる」
  await db.insert(reactions).values({ postId: createdPosts[1].id, userId: taro.id });
  console.log('Reaction: たろう → パパの投稿');
  // たろうの投稿にママとパパが「たすかる」
  await db.insert(reactions).values({ postId: createdPosts[2].id, userId: mama.id });
  await db.insert(reactions).values({ postId: createdPosts[2].id, userId: papa.id });
  console.log('Reaction: ママ&パパ → たろうの投稿');

  await client.end();
  console.log('Seed complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
