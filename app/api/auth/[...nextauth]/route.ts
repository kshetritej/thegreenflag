import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "./options";

const handler = nextAuth({
  ...authOptions,
});
export { handler as GET, handler as POST };
