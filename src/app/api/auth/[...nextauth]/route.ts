import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني / Email", type: "email", placeholder: "admin@globalizetl.com" },
        password: { label: "كلمة المرور / Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Hardcoded admin and editor users for the dashboard
        const adminEmail = "admin@globalizetl.com";
        const adminPass = "admin123456";
        const editorEmail = "editor@globalizetl.com";
        const editorPass = "editor123456";

        if (credentials.email === adminEmail && credentials.password === adminPass) {
          return {
            id: "1",
            name: "مدير النظام (Admin)",
            email: adminEmail,
            role: "ADMIN"
          };
        } else if (credentials.email === editorEmail && credentials.password === editorPass) {
          return {
            id: "2",
            name: "محرر المحتوى (Editor)",
            email: editorEmail,
            role: "EDITOR"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/dashboard/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "f3b97b0a70183b56a3e9c5643bc7db053f3e7ff0ba156a5996924b10b0a880dc",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
