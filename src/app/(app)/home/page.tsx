import { LevelGauge } from '@/components/ui/LevelGauge';
import { MemberExpBar } from '@/components/ui/MemberExpBar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FeedSheet } from '@/components/posts/FeedSheet';
import { getFamilyWithLevel, getMemberExpStats } from '@/lib/actions/family';
import { getAreas } from '@/lib/actions/areas';
import { getFeedData } from '@/lib/actions/feed';
import { requireAuth } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await requireAuth();
  const { id: userId, familyId } = session.user;

  const [family, areas, feedData, memberStats] = await Promise.all([
    getFamilyWithLevel(familyId),
    getAreas(familyId),
    getFeedData(familyId, userId),
    getMemberExpStats(familyId),
  ]);

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 p-6">
      {/* レベルゲージ（常に表示） */}
      <div className="flex flex-col items-center md:sticky md:top-6 md:self-start">
        <LevelGauge
          familyName={family.name}
          level={family.level}
          totalExp={family.totalExp}
          currentThreshold={family.currentThreshold}
          nextThreshold={family.nextThreshold}
          progress={family.progress}
        />
        <MemberExpBar members={memberStats} />
      </div>

      {/* モバイル: ボトムシート */}
      <BottomSheet peekHeight={100}>
        <FeedSheet
          posts={feedData.posts}
          users={feedData.users}
          areas={areas}
          areaMap={feedData.areaMap}
          reactions={feedData.reactions}
          familyId={familyId}
          currentUserId={userId}
        />
      </BottomSheet>

      {/* PC: 右カラムにフィード */}
      <div className="hidden md:block">
        <FeedSheet
          posts={feedData.posts}
          users={feedData.users}
          areas={areas}
          areaMap={feedData.areaMap}
          reactions={feedData.reactions}
          familyId={familyId}
          currentUserId={userId}
          showFab={false}
        />
      </div>
    </div>
  );
}
