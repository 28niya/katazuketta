import { ExpBar } from '@/components/ui/ExpBar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FeedSheet } from '@/components/posts/FeedSheet';
import { HouseScene } from '@/components/house/HouseScene';
import { getFamilyWithLevel } from '@/lib/actions/family';
import { getAreas } from '@/lib/actions/areas';
import { getFeedData } from '@/lib/actions/feed';

// TODO: セッションから取得する。仮でseedデータのIDを使用
const DEMO_FAMILY_ID = process.env.DEMO_FAMILY_ID!;
const DEMO_USER_ID = process.env.DEMO_USER_ID!;

export default async function HomePage() {
  const [family, areas, feedData] = await Promise.all([
    getFamilyWithLevel(DEMO_FAMILY_ID),
    getAreas(DEMO_FAMILY_ID),
    getFeedData(DEMO_FAMILY_ID, DEMO_USER_ID),
  ]);

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6 md:py-4">
      {/* おうち + EXP（常に表示） */}
      <div className="px-5 py-4 md:px-0">
        <div className="bg-glass-light backdrop-blur-glass border border-glass-border-light rounded-3xl relative overflow-hidden h-56 md:h-72">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[85%] z-10">
            <ExpBar
              level={family.level}
              totalExp={family.totalExp}
              currentThreshold={family.currentThreshold}
              nextThreshold={family.nextThreshold}
              progress={family.progress}
            />
          </div>
          <HouseScene
            level={family.level}
            familyId={family.id}
          />
        </div>
      </div>

      {/* モバイル: ボトムシート */}
      <BottomSheet>
        <FeedSheet
          posts={feedData.posts}
          users={feedData.users}
          areas={areas}
          areaMap={feedData.areaMap}
          reactions={feedData.reactions}
          familyId={DEMO_FAMILY_ID}
          currentUserId={DEMO_USER_ID}
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
          familyId={DEMO_FAMILY_ID}
          currentUserId={DEMO_USER_ID}
        />
      </div>
    </div>
  );
}
