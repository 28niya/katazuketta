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
  'hanger', 'shirt', 'wash-machine', 'ironing',
  'vacuum', 'spray', 'trash', 'bucket', 'books',
] as const;
export type AreaIconName = typeof AREA_ICON_NAMES[number];

// DEFAULT_AREAS で使用するアイコン名 (AREA_ICONS 選択肢から除外される)
export const DEFAULT_AREA_ICON_NAMES: ReadonlySet<AreaIconName> = new Set([
  'blender', 'armchair', 'bath', 'wash-dry-shade', 'toilet-paper', 'door',
]);

// --- エリア カラーパレット（作成順にローテーション） ---

export const AREA_COLORS = [
  { gradient: 'from-[#4facfe] to-[#00f2fe]', css: 'linear-gradient(135deg, #4facfe, #00f2fe)', bg: '#dff0fe',
    gradFrom: '#4facfe', gradTo: '#00f2fe',
    activeBg: 'linear-gradient(to bottom right, rgba(79,172,254,0.15), rgba(0,242,254,0.15))', activeBorder: 'rgba(0,242,254,0.4)', activeShadow: 'rgba(0,242,254,0.2)', activeText: '#00f2fe' },     // 青
  { gradient: 'from-[#43e97b] to-[#38f9d7]', css: 'linear-gradient(135deg, #43e97b, #38f9d7)', bg: '#d6f5e8',
    gradFrom: '#43e97b', gradTo: '#38f9d7',
    activeBg: 'linear-gradient(to bottom right, rgba(67,233,123,0.15), rgba(56,249,215,0.15))', activeBorder: 'rgba(56,249,215,0.4)', activeShadow: 'rgba(56,249,215,0.2)', activeText: '#38b2ac' },     // 緑
  { gradient: 'from-[#fde047] to-[#facc15]', css: 'linear-gradient(135deg, #fde047, #facc15)', bg: '#fef9c3',
    gradFrom: '#fde047', gradTo: '#facc15',
    activeBg: 'linear-gradient(to bottom right, rgba(253,224,71,0.15), rgba(250,204,21,0.15))', activeBorder: 'rgba(250,204,21,0.4)', activeShadow: 'rgba(250,204,21,0.2)', activeText: '#eab308' },     // 黄
  { gradient: 'from-[#febf59] to-[#f6ad55]', css: 'linear-gradient(135deg, #febf59, #f6ad55)', bg: '#fff3d6',
    gradFrom: '#febf59', gradTo: '#f6ad55',
    activeBg: 'linear-gradient(to bottom right, rgba(254,191,89,0.15), rgba(246,173,85,0.15))', activeBorder: 'rgba(246,173,85,0.4)', activeShadow: 'rgba(246,173,85,0.2)', activeText: '#f6ad55' },     // オレンジ
  { gradient: 'from-[#ff9a9e] to-[#fecfef]', css: 'linear-gradient(135deg, #ff9a9e, #fecfef)', bg: '#ffe6eb',
    gradFrom: '#ff9a9e', gradTo: '#fecfef',
    activeBg: 'linear-gradient(to bottom right, rgba(255,154,158,0.15), rgba(254,207,239,0.15))', activeBorder: 'rgba(255,154,158,0.4)', activeShadow: 'rgba(255,154,158,0.2)', activeText: '#ed64a6' },     // 桃
  { gradient: 'from-[#a18cd1] to-[#fbc2eb]', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', bg: '#ede6f6',
    gradFrom: '#a18cd1', gradTo: '#fbc2eb',
    activeBg: 'linear-gradient(to bottom right, rgba(161,140,209,0.15), rgba(251,194,235,0.15))', activeBorder: 'rgba(161,140,209,0.4)', activeShadow: 'rgba(161,140,209,0.2)', activeText: '#a18cd1' },     // ラベンダー
] as const;

// --- アバターカラー（AREA_COLORSの先頭カラー = DBに保存する単色値） ---

export const AVATAR_COLOR_VALUES = AREA_COLORS.map((c) => c.css.match(/#[0-9a-f]{6}/gi)?.[0] ?? '#4a5568');

// 単色 → AREA_COLORSインデックス逆引き
const avatarColorToIndex = new Map(AVATAR_COLOR_VALUES.map((c, i) => [c, i]));
export function getColorIndexByAvatarColor(avatarColor: string | null): number {
  return avatarColorToIndex.get(avatarColor ?? '') ?? 0;
}

// --- 開発用シードユーザー ---

export const DEV_USERS = [
  { email: 'mama@example.com', name: 'ママ', role: USER_ROLES.ADMIN, authType: AUTH_TYPES.OAUTH, avatarColor: AVATAR_COLOR_VALUES[4], avatarIcon: 'cherry' satisfies AvatarIconName },
  { email: 'papa@example.com', name: 'パパ', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.OAUTH, avatarColor: AVATAR_COLOR_VALUES[0], avatarIcon: 'car' satisfies AvatarIconName },
  { email: 'ABC123-たろう@child.internal', name: 'たろう', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.CHILD_PIN, avatarColor: AVATAR_COLOR_VALUES[3], avatarIcon: 'cat' satisfies AvatarIconName },
];

// --- プリセットエリア ---

export const DEFAULT_AREAS: ReadonlyArray<{ name: string; iconName: AreaIconName; colorIndex: number }> = [
  { name: 'キッチン', iconName: 'blender', colorIndex: 0 },
  { name: 'リビング', iconName: 'armchair', colorIndex: 1 },
  { name: 'お風呂', iconName: 'bath', colorIndex: 2 },
  { name: '洗面所', iconName: 'wash-dry-shade', colorIndex: 3 },
  { name: 'トイレ', iconName: 'toilet-paper', colorIndex: 4 },
  { name: '玄関', iconName: 'door', colorIndex: 5 },
];
