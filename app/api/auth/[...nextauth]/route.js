import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "../../../../libs/mongodb";
import User from "../../../../models/users";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    GoogleProvider({ 
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ username: credentials.username });

        if (!user) throw new Error("User not found");

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) throw new Error("Invalid credentials");

        return {
          name: user.username,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Use this redirect callback for both Google and custom authentication
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", `${baseUrl}/api/auth/callback/google`);
      return baseUrl; // Defaults to the baseUrl of your app
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
