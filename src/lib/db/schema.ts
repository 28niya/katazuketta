import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// --- families ---
export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  inviteCode: varchar('invite_code', { length: 10 }).notNull().unique(),
  totalExp: integer('total_exp').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- users ---
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  avatarColor: varchar('avatar_color', { length: 7 }),
  avatarIcon: varchar('avatar_icon', { length: 50 }).notNull().default('bxs-user'),
  role: varchar('role', { length: 10 }).notNull().default('MEMBER'),
  authType: varchar('auth_type', { length: 20 }).notNull().default('OAUTH'),
  pinHash: varchar('pin_hash', { length: 255 }),
  pinFailCount: integer('pin_fail_count').notNull().default(0),
  pinLockedUntil: timestamp('pin_locked_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- areas (おうちの場所) ---
export const areas = pgTable('areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  iconName: varchar('icon_name', { length: 50 }).notNull(),
  colorIndex: integer('color_index').notNull().default(0),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- posts ---
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  areaId: uuid('area_id').references(() => areas.id).notNull(),
  memo: text('memo'),
  earnedExp: integer('earned_exp').notNull().default(20),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// --- reactions ---
export const reactions = pgTable(
  'reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => posts.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('reactions_post_user_idx').on(table.postId, table.userId),
  ],
);

// --- exp_logs ---
export const expLogs = pgTable('exp_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  postId: uuid('post_id').references(() => posts.id),
  amount: integer('amount').notNull(),
  reason: varchar('reason', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
