export const runtime = 'nodejs';
import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/mongodb";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        await connectDB();
        const user = await User.find({ email }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user[0].password) {
          throw new Error("Invalid email or password");
        }
        const isMatched = await bcrypt.compare(password, user[0].password);
        if (!isMatched) {
          throw new Error("Invalid email or password");
        }
        const userData = {
          name: user[0].name,
          email: user[0].email,
          image: user[0].image,
          id: user[0]._id.toString(),
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    // error: "/signin?error=true"
  },
  callbacks: {
    async session({ session, token }) {
      // Attach the user ID to the session object
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Attach the user ID to the JWT token
      if (user) {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          token.id = existingUser._id.toString(); // Use the database `_id`
        }
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = (await User.findOne({ email: user?.email })) as {
          _id: string;
          image: string;
          authProviderId: string;
        };
        if (existingUser) {
          console.log("User alredy exist");
          // if(!existingUser.authProviderId){
          //   return false
          // }
          if (existingUser.image === "") {
            await User.updateOne(
              { _id: existingUser._id },
              { $set: { image: user?.image } }
            );
          }
          return true;
        }
        const newUser = new User({
          name: user?.name,
          email: user?.email,
          image: user?.image,
          authProviderId: user?.id,
        });
        await newUser.save();
      }
      return true;
    },
  },
});
