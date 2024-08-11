/** @format */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";          

export const authOptions: NextAuthOptions = { // This is the configuration object for next-auth. We are using CredentialsProvider for authentication.We can also use other providers like Google, Facebook etc.
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [ // We are checking if the user exists with the given username or email
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with the given credentials");
          }

          if (!user.isVerified) {
            throw new Error(
              "User is not verified.Please verify your account with login"
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user; // Finally CredentialsProvider of next-auth expects a user object to be returned if the credentials are correct
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (error: any) {
          throw new Error("Error in authorizing credentials", error);
        }
      },
    }),
  ],
  callbacks: { // Here we are passing user data first to the jwt callback and then to the session callback
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // If we don't do this, next-auth have pages like /api/auth/signin but we want to have /sign-in so we are overriding the default pages
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
