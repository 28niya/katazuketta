import { LevelGauge } from '@/components/ui/LevelGauge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FeedSheet } from '@/components/posts/FeedSheet';
import { getFamilyWithLevel } from '@/lib/actions/family';
import { getAreas } from '@/lib/actions/areas';
import { getFeedData } from '@/lib/actions/feed';
import { requireAuth } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await requireAuth();
  const { id: userId, familyId } = session.user;

  const [family, areas, feedData] = await Promise.all([
    getFamilyWithLevel(familyId),
    getAreas(familyId),
    getFeedData(familyId, userId),
  ]);

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 p-6">
      {/* レベルゲージ（常に表示） */}
      <div className="flex justify-center md:sticky md:top-6 md:self-start">
      <LevelGauge
        level={family.level}
        totalExp={family.totalExp}
        currentThreshold={family.currentThreshold}
        nextThreshold={family.nextThreshold}
        progress={family.progress}
      />
      </div>

      {/* モバイル: ボトムシート */}
      <BottomSheet>
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
        />
      </div>
    </div>
  );
}
