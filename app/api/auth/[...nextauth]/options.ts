import prisma from "@/prisma/prismaClient";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "m@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        })
        if (!user) throw new Error("Invalid Credentials. Please try again.")
        if (!credentials?.password || !user?.password) throw new Error("Username and password required. Please try again.")
        const isPasswordValid = bcrypt.compare(credentials?.password, user.password)

        if (!isPasswordValid) throw new Error("Invalid Credentials. Please try again.")
        return user;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
}