import {
  // avatars
  IconUser,
  IconCat,
  IconDog,
  IconStar,
  IconHeart,
  IconSun,
  IconMoon,
  IconLeaf,
  IconDiamond,
  IconCrown,
  // kitchen
  IconBlender,
  IconFridge,
  IconMicrowave,
  IconChefHat,
  // bath / washroom / toilet
  IconBath,
  IconDroplet,
  IconToiletPaper,
  // entrance / rooms
  IconDoor,
  IconHome,
  IconHomeSpark,
  IconHomePlus,
  IconBed,
  IconSofa,
  IconArmchair,
  // closet / laundry
  IconHanger,
  IconShirt,
  IconWashMachine,
  IconWashDryShade,
  // cleaning / storage
  IconVacuumCleaner,
  IconSpray,
  IconTrash,
  IconBucket,
  IconBooks,
  // ui
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import { DEFAULT_AREA_ICON_NAMES, type AreaIconName, type AvatarIconName } from '@/types';

export type TablerIconComponent = TablerIcon;

// アプリのロゴアイコン（ヘッダー／ログイン等で固定使用）
export const AppLogoIcon = IconHomeSpark;
// 「家族をつくる」導線で使うアイコン
export const AddFamilyIcon = IconHomePlus;

type IconEntry<N extends string> = { name: N; label: string; Icon: TablerIconComponent };

export const AVATAR_ICONS: ReadonlyArray<IconEntry<AvatarIconName>> = [
  { name: 'user', label: 'ひと', Icon: IconUser },
  { name: 'cat', label: 'ねこ', Icon: IconCat },
  { name: 'dog', label: 'いぬ', Icon: IconDog },
  { name: 'star', label: 'ほし', Icon: IconStar },
  { name: 'heart', label: 'ハート', Icon: IconHeart },
  { name: 'sun', label: 'たいよう', Icon: IconSun },
  { name: 'moon', label: 'つき', Icon: IconMoon },
  { name: 'leaf', label: 'はっぱ', Icon: IconLeaf },
  { name: 'diamond', label: 'ダイヤ', Icon: IconDiamond },
  { name: 'crown', label: 'おうかん', Icon: IconCrown },
];

// 全エリアアイコンのレジストリ（resolver 用／プリセット含む）
const AREA_ICON_REGISTRY: ReadonlyArray<IconEntry<AreaIconName>> = [
  { name: 'blender', label: 'キッチン', Icon: IconBlender },
  { name: 'fridge', label: '冷蔵庫', Icon: IconFridge },
  { name: 'microwave', label: '電子レンジ', Icon: IconMicrowave },
  { name: 'chef-hat', label: '料理', Icon: IconChefHat },
  { name: 'bath', label: 'お風呂', Icon: IconBath },
  { name: 'droplet', label: '水滴', Icon: IconDroplet },
  { name: 'toilet-paper', label: 'トイレ', Icon: IconToiletPaper },
  { name: 'door', label: '玄関', Icon: IconDoor },
  { name: 'home', label: 'おうち', Icon: IconHome },
  { name: 'bed', label: 'ベッド', Icon: IconBed },
  { name: 'sofa', label: 'リビング', Icon: IconSofa },
  { name: 'armchair', label: '椅子', Icon: IconArmchair },
  { name: 'hanger', label: 'ハンガー', Icon: IconHanger },
  { name: 'shirt', label: '服', Icon: IconShirt },
  { name: 'wash-machine', label: '洗濯機', Icon: IconWashMachine },
  { name: 'wash-dry-shade', label: '物干し', Icon: IconWashDryShade },
  { name: 'vacuum', label: '掃除機', Icon: IconVacuumCleaner },
  { name: 'spray', label: 'スプレー', Icon: IconSpray },
  { name: 'trash', label: 'ゴミ箱', Icon: IconTrash },
  { name: 'bucket', label: 'バケツ', Icon: IconBucket },
  { name: 'books', label: '本', Icon: IconBooks },
];

// ユーザーが新規エリア作成時に選べるアイコン一覧 (プリセットで使うものは除外)
export const AREA_ICONS: ReadonlyArray<IconEntry<AreaIconName>> = AREA_ICON_REGISTRY.filter(
  (i) => !DEFAULT_AREA_ICON_NAMES.has(i.name),
);

const avatarIconMap = new Map(AVATAR_ICONS.map((i) => [i.name, i.Icon] as const));
const areaIconMap = new Map(AREA_ICON_REGISTRY.map((i) => [i.name, i.Icon] as const));

export function getAvatarIcon(name: string): TablerIconComponent {
  return avatarIconMap.get(name as AvatarIconName) ?? IconUser;
}

export function getAreaIcon(name: string): TablerIconComponent {
  return areaIconMap.get(name as AreaIconName) ?? IconHome;
}
