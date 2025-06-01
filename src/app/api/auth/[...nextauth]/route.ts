import NextAuth, { SessionStrategy, AuthOptions } from "next-auth";
import { authOptions as rawAuthOptions } from "@/lib/authOptions";

// Ensure authOptions.session.strategy is set to either "jwt" or "database"
if (rawAuthOptions.session && typeof rawAuthOptions.session.strategy === "string") {
  if (rawAuthOptions.session.strategy !== "jwt" && rawAuthOptions.session.strategy !== "database") {
    throw new Error('authOptions.session.strategy must be "jwt" or "database"');
  }
  // Cast to SessionStrategy to satisfy type checker
  rawAuthOptions.session.strategy = rawAuthOptions.session.strategy as SessionStrategy;
}

// Ensure session.strategy is typed as SessionStrategy
const authOptions: AuthOptions = {
  ...rawAuthOptions,
  session: {
    ...rawAuthOptions.session,
    strategy: rawAuthOptions.session?.strategy as SessionStrategy,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
