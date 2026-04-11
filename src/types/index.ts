/**
 * かたづけッタ (Kataduketta) - Core Type Definitions
 */

// --- 環境 ---

export const IS_DEV = process.env.NODE_ENV === 'development';

// --- 定数 ---

export const EXP_REASONS = {
  DAILY_POST: 'DAILY_POST',
  STREAK_BONUS: 'STREAK_BONUS',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export const AUTH_TYPES = {
  OAUTH: 'OAUTH',
  CHILD_PIN: 'CHILD_PIN',
} as const;

// --- 型推論 ---

export type ExpReason = typeof EXP_REASONS[keyof typeof EXP_REASONS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type AuthType = typeof AUTH_TYPES[keyof typeof AUTH_TYPES];

// --- EXP ---

export const EXP_PER_POST = 20;
export const LEVEL_DIVISOR = 40;

// --- アイコン名 (DB保存用の文字列キー) ---
// 実体の Tabler コンポーネントは src/lib/icons.tsx でマッピング

export const AVATAR_ICON_NAMES = [
  // 動物
  'cat', 'dog', 'paw', 'fish',
  // 乗り物
  'car', 'car-crane', 'rocket', 'ambulance',
  // ゲーム
  'device-gamepad2', 'balloon',
  // フード
  'apple', 'cherry', 'ice-cream-2', 'bubble-tea',
  // キャラ
  'robot', 'ghost', 'ufo',
  // 宇宙
  'moon', 'planet', 'flare',
] as const;
export type AvatarIconName = typeof AVATAR_ICON_NAMES[number];

export const AREA_ICON_NAMES = [
  // プリセット (DEFAULT_AREAS で使用、ユーザー選択肢からは除外)
  'blender', 'armchair', 'bath', 'wash-dry-shade', 'toilet-paper', 'door',
  // 追加用 (ユーザーが新規エリア作成時に選べる)
  'microwave', 'chef-hat',
  'droplet',
  'hanger', 'shirt', 'wash-machine', 'ironing', 'wash',
  'vacuum', 'spray', 'trash', 'bucket', 'books',
  'window', 'stairs',
] as const;
export type AreaIconName = typeof AREA_ICON_NAMES[number];

// DEFAULT_AREAS で使用するアイコン名 (AREA_ICONS 選択肢から除外される)
export const DEFAULT_AREA_ICON_NAMES: ReadonlySet<AreaIconName> = new Set([
  'blender', 'armchair', 'bath', 'wash-dry-shade', 'toilet-paper', 'door',
]);

// --- エリア カラーパレット（作成順にローテーション） ---

export const AREA_COLORS = [
  { gradient: 'from-[#fa709a] to-[#fee140]', css: 'linear-gradient(135deg, #fa709a, #fee140)', bg: '#ffead5',
    gradFrom: '#fa709a', gradTo: '#fee140',
    activeBg: 'linear-gradient(to bottom right, rgba(250,112,154,0.15), rgba(254,225,64,0.15))', activeBorder: 'rgba(250,112,154,0.4)', activeShadow: 'rgba(250,112,154,0.2)', activeText: '#e11d48' },     // サンセット (玄関)
  { gradient: 'from-[#ff9a9e] to-[#fecfef]', css: 'linear-gradient(135deg, #ff9a9e, #fecfef)', bg: '#ffe6eb',
    gradFrom: '#ff9a9e', gradTo: '#fecfef',
    activeBg: 'linear-gradient(to bottom right, rgba(255,154,158,0.15), rgba(254,207,239,0.15))', activeBorder: 'rgba(255,154,158,0.4)', activeShadow: 'rgba(255,154,158,0.2)', activeText: '#ed64a6' },     // ピーチ (リビング)
  { gradient: 'from-[#d9afd9] to-[#97d9e1]', css: 'linear-gradient(135deg, #d9afd9, #97d9e1)', bg: '#eae2ee',
    gradFrom: '#d9afd9', gradTo: '#97d9e1',
    activeBg: 'linear-gradient(to bottom right, rgba(217,175,217,0.15), rgba(151,217,225,0.15))', activeBorder: 'rgba(151,217,225,0.4)', activeShadow: 'rgba(151,217,225,0.2)', activeText: '#a78bfa' },     // ミントラベンダー (キッチン)
  { gradient: 'from-[#209cff] to-[#68e0cf]', css: 'linear-gradient(135deg, #209cff, #68e0cf)', bg: '#d9ecfa',
    gradFrom: '#209cff', gradTo: '#68e0cf',
    activeBg: 'linear-gradient(to bottom right, rgba(32,156,255,0.15), rgba(104,224,207,0.15))', activeBorder: 'rgba(32,156,255,0.4)', activeShadow: 'rgba(32,156,255,0.2)', activeText: '#0284c7' },     // マリン (洗面所)
  { gradient: 'from-[#92fe9d] to-[#00c9ff]', css: 'linear-gradient(135deg, #92fe9d, #00c9ff)', bg: '#d5f7ea',
    gradFrom: '#92fe9d', gradTo: '#00c9ff',
    activeBg: 'linear-gradient(to bottom right, rgba(146,254,157,0.15), rgba(0,201,255,0.15))', activeBorder: 'rgba(0,201,255,0.4)', activeShadow: 'rgba(0,201,255,0.2)', activeText: '#06b6d4' },     // ソーダ (お風呂)
  { gradient: 'from-[#13547a] to-[#80d0c7]', css: 'linear-gradient(135deg, #13547a, #80d0c7)', bg: '#d6eef0',
    gradFrom: '#13547a', gradTo: '#80d0c7',
    activeBg: 'linear-gradient(to bottom right, rgba(19,84,122,0.15), rgba(128,208,199,0.15))', activeBorder: 'rgba(19,84,122,0.4)', activeShadow: 'rgba(19,84,122,0.2)', activeText: '#13547a' },     // オーシャン (トイレ)
] as const;

// --- アバターカラー（AREA_COLORSの先頭カラー = DBに保存する単色値） ---

export const AVATAR_COLOR_VALUES = AREA_COLORS.map((c) => c.css.match(/#[0-9a-f]{6}/gi)?.[0] ?? '#4a5568');

// 単色 → AREA_COLORSインデックス逆引き
const avatarColorToIndex = new Map(AVATAR_COLOR_VALUES.map((c, i) => [c, i]));
export function getColorIndexByAvatarColor(avatarColor: string | null): number {
  return avatarColorToIndex.get(avatarColor ?? '') ?? 0;
}

// アバター円の背景グラデーション (DB保存単色 → AREA_COLORS の CSS グラデ)
export function getAvatarGradient(avatarColor: string | null): string {
  return AREA_COLORS[getColorIndexByAvatarColor(avatarColor)].css;
}

// カラーホイール上の反対色 (6色を円環と見なして対向を取る)
export function getComplementaryColorIndex(colorIndex: number): number {
  const n = AREA_COLORS.length;
  return (colorIndex + Math.floor(n / 2)) % n;
}

// --- 開発用シードユーザー ---

export const DEV_USERS = [
  { email: 'mama@example.com', name: 'ママ', role: USER_ROLES.ADMIN, authType: AUTH_TYPES.OAUTH, avatarColor: AVATAR_COLOR_VALUES[4], avatarIcon: 'cherry' satisfies AvatarIconName },
  { email: 'papa@example.com', name: 'パパ', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.OAUTH, avatarColor: AVATAR_COLOR_VALUES[0], avatarIcon: 'car' satisfies AvatarIconName },
  { email: 'ABC123-たろう@child.internal', name: 'たろう', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.CHILD_PIN, avatarColor: AVATAR_COLOR_VALUES[3], avatarIcon: 'cat' satisfies AvatarIconName },
];

// --- プリセットエリア ---

export const DEFAULT_AREAS: ReadonlyArray<{ name: string; iconName: AreaIconName; colorIndex: number }> = [
  { name: '玄関', iconName: 'door', colorIndex: 0 },
  { name: 'リビング', iconName: 'armchair', colorIndex: 1 },
  { name: 'キッチン', iconName: 'blender', colorIndex: 2 },
  { name: '洗面所', iconName: 'wash-dry-shade', colorIndex: 3 },
  { name: 'お風呂', iconName: 'bath', colorIndex: 4 },
  { name: 'トイレ', iconName: 'toilet-paper', colorIndex: 5 },
];
