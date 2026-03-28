import { getHouseStage, getGardenItems, getItemPosition } from '@/lib/evolution';
import { Tent } from './Tent';
import { SmallHouse } from './SmallHouse';
import { TwoStoryHouse } from './TwoStoryHouse';
import { GardenItem } from './GardenItem';

type HouseSceneProps = {
  level: number;
  familyId: string;
};

export function HouseScene({ level, familyId }: HouseSceneProps) {
  const stage = getHouseStage(level);
  const items = getGardenItems(level);

  return (
    <div className="absolute inset-0 flex items-end justify-center">
      {/* 庭アイテム */}
      {items.map((item) => {
        const pos = getItemPosition(familyId, item.type);
        return (
          <div
            key={item.type}
            className="absolute transition-all duration-500"
            style={{ left: `${pos.x}%`, bottom: `${100 - pos.y}%` }}
          >
            <GardenItem type={item.type} />
          </div>
        );
      })}

      {/* 建物 */}
      <div className="w-24 h-24 md:w-32 md:h-32 mb-4 transition-all duration-700">
        {stage === 'tent' && <Tent />}
        {stage === 'small-house' && <SmallHouse />}
        {stage === 'two-story' && <TwoStoryHouse />}
      </div>
    </div>
  );
}
