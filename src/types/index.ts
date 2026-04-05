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

// --- 開発用シードユーザー ---

export const DEV_USERS = [
  { email: 'mama@example.com', name: 'ママ', role: USER_ROLES.ADMIN, authType: AUTH_TYPES.OAUTH, avatarColor: '#ed64a6', avatarIcon: 'bxs-heart' },
  { email: 'papa@example.com', name: 'パパ', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.OAUTH, avatarColor: '#38b2ac', avatarIcon: 'bxs-star' },
  { email: 'ABC123-たろう@child.internal', name: 'たろう', role: USER_ROLES.MEMBER, authType: AUTH_TYPES.CHILD_PIN, avatarColor: '#f6ad55', avatarIcon: 'bxs-cat' },
] as const;

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
  { gradient: 'from-[#4facfe] to-[#00f2fe]', css: 'linear-gradient(135deg, #4facfe, #00f2fe)', bg: '#dff0fe',
    activeBg: 'linear-gradient(to bottom right, rgba(79,172,254,0.15), rgba(0,242,254,0.15))', activeBorder: 'rgba(0,242,254,0.4)', activeShadow: 'rgba(0,242,254,0.2)', activeText: '#00f2fe' },     // 青
  { gradient: 'from-[#43e97b] to-[#38f9d7]', css: 'linear-gradient(135deg, #43e97b, #38f9d7)', bg: '#d6f5e8',
    activeBg: 'linear-gradient(to bottom right, rgba(67,233,123,0.15), rgba(56,249,215,0.15))', activeBorder: 'rgba(56,249,215,0.4)', activeShadow: 'rgba(56,249,215,0.2)', activeText: '#38b2ac' },     // 緑
  { gradient: 'from-[#667eea] to-[#764ba2]', css: 'linear-gradient(135deg, #667eea, #764ba2)', bg: '#e4dff8',
    activeBg: 'linear-gradient(to bottom right, rgba(102,126,234,0.15), rgba(118,75,162,0.15))', activeBorder: 'rgba(118,75,162,0.4)', activeShadow: 'rgba(118,75,162,0.2)', activeText: '#764ba2' },     // 紫
  { gradient: 'from-[#febf59] to-[#f6ad55]', css: 'linear-gradient(135deg, #febf59, #f6ad55)', bg: '#fff3d6',
    activeBg: 'linear-gradient(to bottom right, rgba(254,191,89,0.15), rgba(246,173,85,0.15))', activeBorder: 'rgba(246,173,85,0.4)', activeShadow: 'rgba(246,173,85,0.2)', activeText: '#f6ad55' },     // オレンジ
  { gradient: 'from-[#ff9a9e] to-[#fecfef]', css: 'linear-gradient(135deg, #ff9a9e, #fecfef)', bg: '#ffe6eb',
    activeBg: 'linear-gradient(to bottom right, rgba(255,154,158,0.15), rgba(254,207,239,0.15))', activeBorder: 'rgba(255,154,158,0.4)', activeShadow: 'rgba(255,154,158,0.2)', activeText: '#ed64a6' },     // 桃
  { gradient: 'from-[#a18cd1] to-[#fbc2eb]', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', bg: '#ede6f6',
    activeBg: 'linear-gradient(to bottom right, rgba(161,140,209,0.15), rgba(251,194,235,0.15))', activeBorder: 'rgba(161,140,209,0.4)', activeShadow: 'rgba(161,140,209,0.2)', activeText: '#a18cd1' },     // ラベンダー
] as const;

// --- エリア アイコンパレット ---

export const AREA_ICONS = [
  { name: 'bxs-dish', label: 'キッチン' },
  { name: 'bxs-bath', label: 'お風呂' },
  { name: 'bxs-brush', label: 'ブラシ' },
  { name: 'bxs-droplet', label: '水滴' },
  { name: 'bxs-bed', label: 'ベッド' },
  { name: 'bxs-door-open', label: 'ドア' },
  { name: 'bxs-cabinet', label: '棚' },
  { name: 'bxs-t-shirt', label: 'Tシャツ' },
  { name: 'bxs-tree', label: '木' },
  { name: 'bxs-car', label: '車' },
  { name: 'bxs-washer', label: '洗濯機' },
  { name: 'bxs-fridge', label: '冷蔵庫' },
  { name: 'bxs-book-reader', label: '本棚' },
  { name: 'bxs-cat', label: 'ペット' },
  { name: 'bxs-sun', label: '太陽' },
  { name: 'bxs-shopping-bag', label: 'バッグ' },
  { name: 'bxs-home', label: 'おうち' },
  { name: 'bxs-spa', label: 'スパ' },
  { name: 'bxs-box', label: '箱' },
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
