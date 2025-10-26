import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user?: {
      id?: string;
      email?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
    };
  }
  interface User {
    accessToken: string;
    id?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error('Missing username or password');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          const apiUser = data.user || {};
          return {
            accessToken: data.token,
            id: apiUser.id,
            email: apiUser.email,
            role: apiUser.role,
            // Map snake_case to camelCase for convenience
            firstName: apiUser.first_name ?? apiUser.firstName,
            lastName: apiUser.last_name ?? apiUser.lastName,
          } as any;
        }

        throw new Error(data.message || 'Login failed');
      },
    }),
  ],
};
