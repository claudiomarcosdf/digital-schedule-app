import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from 'next-auth/react';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email"},
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        const payload = {
          login: credentials?.email,
          password: credentials?.password,
        };        
        
        const response = await fetch(backendURL+'/users/login', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        }); 
        
        const user = await response.json();
        if (!response.ok) return null;
        
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com", password: "123", role: "user" }

        // const isValidEmail = user.email == credentials?.email
        // const isValidPassword = user.password == credentials?.password

        // if (!isValidEmail || !isValidPassword) return null
        return user
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const customUser = user as unknown as any

      if (user) {
        return {
          ...token,
          name: customUser.username,
          email: customUser.login,
          role: customUser.role,
          accessToken: customUser.token
        }
      }

    return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role,
          accessToken: token.accessToken
        }
      }
  },    
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/access'
  }
}

export const headerAuthorizationToken = async () => {
  const session = await getSession();
  // @ts-ignore comment
  const accessToken = session?.user?.accessToken || '';

  console.log(session)

  const defaultOptions = {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  };
  
  return defaultOptions;
}