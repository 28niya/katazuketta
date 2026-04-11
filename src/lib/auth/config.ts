import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users, accounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { AUTH_TYPES, IS_DEV } from '@/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: 'child-pin',
      name: 'Child PIN',
      credentials: {
        familyCode: { label: '家族コード' },
        nickname: { label: 'ニックネーム' },
        pin: { label: 'PIN' },
      },
      async authorize(credentials) {
        const { familyCode, nickname, pin } = credentials as {
          familyCode: string;
          nickname: string;
          pin: string;
        };

        if (!familyCode || !nickname || !pin) return null;

        // ダミーメールでユーザーを検索
        const email = `${familyCode.toUpperCase()}-${nickname}@child.internal`;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || user.authType !== AUTH_TYPES.CHILD_PIN || !user.pinHash) return null;

        // PINロックチェック
        if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
          throw new Error('しばらく待ってからやり直してください');
        }

        const isValid = await bcrypt.compare(pin, user.pinHash);

        if (!isValid) {
          // 失敗カウント更新
          const newFailCount = user.pinFailCount + 1;
          const updates: Record<string, unknown> = { pinFailCount: newFailCount };
          if (newFailCount >= 5) {
            updates.pinLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
          }
          await db.update(users).set(updates).where(eq(users.id, user.id));

          if (newFailCount >= 5) {
            throw new Error('しばらく待ってからやり直してください');
          }
          throw new Error('PINが正しくありません');
        }

        // 成功: カウントリセット
        await db.update(users).set({ pinFailCount: 0, pinLockedUntil: null }).where(eq(users.id, user.id));

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    // 開発専用: メールだけでログイン
    ...(IS_DEV
      ? [
          Credentials({
            id: 'dev-login',
            name: 'Dev Login',
            credentials: {
              email: { label: 'Email' },
            },
            async authorize(credentials) {
              const email = (credentials as { email: string }).email;
              if (!email) return null;
              const user = await db.query.users.findFirst({
                where: eq(users.email, email),
              });
              if (!user) return null;
              return { id: user.id, name: user.name, email: user.email };
            },
          }),
        ]
      : []),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        // メールアドレスのホワイトリストチェック
        const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) ?? [];
        if (allowedEmails.length > 0 && !allowedEmails.includes(user.email.toLowerCase())) {
          return false;
        }

        // Google OAuthの場合: 既存ユーザーを検索
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (existingUser) {
          // accountsテーブルにリンクがなければ作成
          const existingAccount = await db.query.accounts.findFirst({
            where: and(
              eq(accounts.provider, 'google'),
              eq(accounts.providerAccountId, account.providerAccountId),
            ),
          });
          if (!existingAccount) {
            await db.insert(accounts).values({
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
              tokenType: account.token_type,
              scope: account.scope,
              idToken: account.id_token,
            });
          }
          return true;
        }

        // 新規ユーザー → 家族作成/参加が必要（未所属状態で仮作成はしない）
        // ここでは一旦許可して、onboarding で家族を紐付ける
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // 初回ログイン時: DBからユーザー情報を取得
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });
        if (dbUser) {
          token.userId = dbUser.id;
          token.familyId = dbUser.familyId;
          token.role = dbUser.role;
          token.needsOnboarding = false;
        } else if (account?.provider === 'google') {
          // DB未登録のGoogleユーザー → onboarding必要
          token.needsOnboarding = true;
          token.email = user.email;
          token.name = user.name;
        }
      }

      // オンボーディング未完了ならDBを再チェック（完了していればトークン更新）
      if (token.needsOnboarding && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email as string),
        });
        if (dbUser) {
          token.userId = dbUser.id;
          token.familyId = dbUser.familyId;
          token.role = dbUser.role;
          token.needsOnboarding = false;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.familyId = token.familyId as string;
        session.user.role = token.role as string;
      }
      if (token.needsOnboarding) {
        session.user.needsOnboarding = true;
      }
      return session;
    },
  },
});
