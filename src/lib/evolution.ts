export type HouseStage = 'tent' | 'small-house' | 'two-story';

export type GardenItem = {
  type: string;
  label: string;
  unlocksAt: number;
};

const GARDEN_ITEMS: GardenItem[] = [
  { type: 'flower', label: '花', unlocksAt: 2 },
  { type: 'fence', label: '柵', unlocksAt: 3 },
  { type: 'mailbox', label: 'ポスト', unlocksAt: 4 },
  { type: 'tree', label: '木', unlocksAt: 6 },
  { type: 'dog', label: 'いぬ', unlocksAt: 7 },
  { type: 'bench', label: 'ベンチ', unlocksAt: 8 },
  { type: 'lamp', label: '街灯', unlocksAt: 9 },
];

export function getHouseStage(level: number): HouseStage {
  if (level >= 10) return 'two-story';
  if (level >= 5) return 'small-house';
  return 'tent';
}

export function getGardenItems(level: number): GardenItem[] {
  return GARDEN_ITEMS.filter((item) => level >= item.unlocksAt);
}

/**
 * familyId を seed にしてアイテムごとの配置位置を決定
 * リロードしても同じ位置になる
 */
export function getItemPosition(
  familyId: string,
  itemType: string,
): { x: number; y: number } {
  let hash = 0;
  const seed = familyId + itemType;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  // 0〜1 の範囲に正規化し、配置可能エリア内に収める
  const normalize = (h: number) => ((h & 0x7fffffff) % 1000) / 1000;
  const x = 10 + normalize(hash) * 80; // 10%〜90%
  const y = 60 + normalize(hash >> 8) * 30; // 60%〜90%（地面エリア）
  return { x, y };
}
