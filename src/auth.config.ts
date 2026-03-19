import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe Auth.js config (no DB, bcrypt, or Node-only modules).
 * Used by `src/proxy.ts`. Full providers + authorize live in `auth.ts`.
 */
export default {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as 'super_admin' | 'client';
        session.user.clientId = token.clientId as string | null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
