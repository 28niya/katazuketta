/**
 * かたづけッタ (Kataduketta) - Core Type Definitions
 */

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
export const LEVEL_DIVISOR = 20;

// --- ユーザー アバターアイコン ---

export const AVATAR_ICONS = [
  { name: 'bxs-user', label: 'ひと' },
  { name: 'bxs-cat', label: 'ねこ' },
  { name: 'bxs-dog', label: 'いぬ' },
  { name: 'bxs-star', label: 'ほし' },
  { name: 'bxs-heart', label: 'ハート' },
  { name: 'bxs-sun', label: 'たいよう' },
  { name: 'bxs-moon', label: 'つき' },
  { name: 'bxs-leaf', label: 'はっぱ' },
  { name: 'bxs-diamond', label: 'ダイヤ' },
  { name: 'bxs-crown', label: 'おうかん' },
] as const;

// --- エリア カラーパレット（作成順にローテーション） ---

export const AREA_COLORS = [
  { gradient: 'from-[#4facfe] to-[#00f2fe]', css: 'linear-gradient(135deg, #4facfe, #00f2fe)', bg: '#dff0fe' },     // 青
  { gradient: 'from-[#43e97b] to-[#38f9d7]', css: 'linear-gradient(135deg, #43e97b, #38f9d7)', bg: '#d6f5e8' },     // 緑
  { gradient: 'from-[#667eea] to-[#764ba2]', css: 'linear-gradient(135deg, #667eea, #764ba2)', bg: '#e4dff8' },     // 紫
  { gradient: 'from-[#febf59] to-[#f6ad55]', css: 'linear-gradient(135deg, #febf59, #f6ad55)', bg: '#fff3d6' },     // オレンジ
  { gradient: 'from-[#ff9a9e] to-[#fecfef]', css: 'linear-gradient(135deg, #ff9a9e, #fecfef)', bg: '#ffe6eb' },     // 桃
  { gradient: 'from-[#a18cd1] to-[#fbc2eb]', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', bg: '#ede6f6' },     // ラベンダー
] as const;

// --- エリア アイコンパレット ---

export const AREA_ICONS = [
  { name: 'bxs-droplet', label: '水滴' },
  { name: 'bxs-bath', label: 'お風呂' },
  { name: 'bxs-dish', label: 'キッチン' },
  { name: 'bxs-bed', label: 'ベッド' },
  { name: 'bxs-door-open', label: 'ドア' },
  { name: 'bxs-tree', label: '木' },
  { name: 'bxs-cabinet', label: '棚' },
  { name: 'bxs-brush', label: 'ブラシ' },
  { name: 'bxs-t-shirt', label: 'Tシャツ' },
  { name: 'bxs-magic-wand', label: 'その他' },
] as const;

// --- プリセットエリア ---

export const DEFAULT_AREAS = [
  { name: 'キッチン', iconName: 'bxs-dish', colorIndex: 0 },
  { name: 'リビング', iconName: 'bxs-brush', colorIndex: 1 },
  { name: 'お風呂', iconName: 'bxs-bath', colorIndex: 2 },
  { name: '洗面所', iconName: 'bxs-droplet', colorIndex: 0 },
  { name: 'トイレ', iconName: 'bxs-droplet', colorIndex: 3 },
  { name: '寝室', iconName: 'bxs-bed', colorIndex: 4 },
  { name: '玄関', iconName: 'bxs-door-open', colorIndex: 5 },
] as const;
