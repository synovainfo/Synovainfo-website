import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

// ---------------------------------------------------------------------------
// Type extensions for next-auth — adds role to session and JWT
// ---------------------------------------------------------------------------
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & import("next-auth").DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// ---------------------------------------------------------------------------
// Custom adapter — works only with the existing User model.
// The Prisma schema does not include Account, Session, or VerificationToken
// models, so a full PrismaAdapter from @auth/prisma-adapter is not viable.
// JWT strategy means these adapter methods are never called at runtime.
// ---------------------------------------------------------------------------
const customAdapter: Adapter = {
  async getUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: null,
    };
  },

  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: null,
    };
  },

  async createUser(data) {
    // password is NOT NULL in the schema; OAuth path gets a placeholder
    const user = await prisma.user.create({
      data: {
        name: data.name ?? "",
        email: data.email,
        image: data.image,
        password: "",
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: null,
    };
  },

  async updateUser(user) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name ?? undefined,
        image: user.image ?? undefined,
      },
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
      emailVerified: null,
    };
  },

  // Stub methods — not used with JWT strategy
  async linkAccount() {
    return null;
  },
  async getSessionAndUser() {
    return null;
  },
  async createSession(session) {
    return {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires,
    };
  },
  async updateSession() {
    return null;
  },
  async deleteSession() {},
};

// ---------------------------------------------------------------------------
// Auth.js v5 configuration
// ---------------------------------------------------------------------------
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password || !user.isActive) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    // OAuth stubs — enable by configuring env vars
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role ?? "VIEWER";
      }
      // Support session refresh after role changes
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
