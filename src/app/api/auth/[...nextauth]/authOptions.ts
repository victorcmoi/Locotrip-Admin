import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
  }
  interface User {
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, request) {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error('Missing username or password');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': request.headers?.['x-forwarded-for']
          },
          body: JSON.stringify({
            email,
            password
          }),
        });

        console.log(response);

        const user = await response.json();

        if (response.ok) {
          return { id: user.id, email: user.email, accessToken: user.token}
        }

        throw new Error(user.message);
      },
    }),
  ],
};
