import { getToken } from "next-auth/jwt";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // NextAuth v5 uses "authjs.session-token" as both cookie name and salt
    cookieName: "authjs.session-token",
    salt: "authjs.session-token",
  });

  const session = token
    ? { user: { email: token.email as string, name: token.name as string } }
    : null;

  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
