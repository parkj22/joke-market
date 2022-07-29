import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            name: string,
            email: string,
            image: string,
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
    }
}