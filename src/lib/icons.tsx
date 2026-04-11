import {
  // avatars
  IconUser,
  IconCat,
  IconDog,
  IconPaw,
  IconFish,
  IconCar,
  IconCarCrane,
  IconRocket,
  IconAmbulance,
  IconDeviceGamepad2,
  IconBalloon,
  IconApple,
  IconCherry,
  IconIceCream2,
  IconBubbleTea,
  IconRobot,
  IconGhost,
  IconUfo,
  IconMoon,
  IconPlanet,
  IconFlare,
  // kitchen
  IconBlender,
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
  IconArmchair,
  // closet / laundry
  IconHanger,
  IconShirt,
  IconWashMachine,
  IconWashDryShade,
  IconIroning,
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
  { name: 'cat', label: 'ねこ', Icon: IconCat },
  { name: 'dog', label: 'いぬ', Icon: IconDog },
  { name: 'paw', label: 'あしあと', Icon: IconPaw },
  { name: 'fish', label: 'さかな', Icon: IconFish },
  { name: 'car', label: 'くるま', Icon: IconCar },
  { name: 'car-crane', label: 'クレーン車', Icon: IconCarCrane },
  { name: 'rocket', label: 'ロケット', Icon: IconRocket },
  { name: 'ambulance', label: 'きゅうきゅうしゃ', Icon: IconAmbulance },
  { name: 'device-gamepad2', label: 'ゲーム', Icon: IconDeviceGamepad2 },
  { name: 'balloon', label: 'ふうせん', Icon: IconBalloon },
  { name: 'apple', label: 'りんご', Icon: IconApple },
  { name: 'cherry', label: 'さくらんぼ', Icon: IconCherry },
  { name: 'ice-cream-2', label: 'アイス', Icon: IconIceCream2 },
  { name: 'bubble-tea', label: 'タピオカ', Icon: IconBubbleTea },
  { name: 'robot', label: 'ロボット', Icon: IconRobot },
  { name: 'ghost', label: 'おばけ', Icon: IconGhost },
  { name: 'ufo', label: 'UFO', Icon: IconUfo },
  { name: 'moon', label: 'つき', Icon: IconMoon },
  { name: 'planet', label: 'わくせい', Icon: IconPlanet },
  { name: 'flare', label: 'きらめき', Icon: IconFlare },
];

// 全エリアアイコンのレジストリ（resolver 用／プリセット含む）
const AREA_ICON_REGISTRY: ReadonlyArray<IconEntry<AreaIconName>> = [
  { name: 'blender', label: 'キッチン', Icon: IconBlender },
  { name: 'microwave', label: '電子レンジ', Icon: IconMicrowave },
  { name: 'chef-hat', label: '料理', Icon: IconChefHat },
  { name: 'bath', label: 'お風呂', Icon: IconBath },
  { name: 'droplet', label: '水滴', Icon: IconDroplet },
  { name: 'toilet-paper', label: 'トイレ', Icon: IconToiletPaper },
  { name: 'door', label: '玄関', Icon: IconDoor },
  { name: 'armchair', label: '椅子', Icon: IconArmchair },
  { name: 'hanger', label: 'ハンガー', Icon: IconHanger },
  { name: 'shirt', label: '服', Icon: IconShirt },
  { name: 'wash-machine', label: '洗濯機', Icon: IconWashMachine },
  { name: 'wash-dry-shade', label: '物干し', Icon: IconWashDryShade },
  { name: 'ironing', label: 'アイロン', Icon: IconIroning },
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
