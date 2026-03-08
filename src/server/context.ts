import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function createContext() {
  const cookieStore = await cookies();

  // Try both the HTTP (dev) and HTTPS (prod) cookie names
  const httpCookieName = "authjs.session-token";
  const httpsCookieName = "__Secure-authjs.session-token";

  const httpToken = cookieStore.get(httpCookieName)?.value;
  const httpsToken = cookieStore.get(httpsCookieName)?.value;
  const sessionToken = httpToken ?? httpsToken;
  const cookieName = httpToken ? httpCookieName : httpsCookieName;

  if (!sessionToken) return { session: null };

  // Build a minimal Request so getToken can decode the JWE
  const fakeReq = new Request("http://localhost", {
    headers: { cookie: `${cookieName}=${sessionToken}` },
  });

  const token = await getToken({
    req: fakeReq,
    secret: process.env.AUTH_SECRET,
    cookieName,
    salt: cookieName,
  });

  const session = token
    ? { user: { email: token.email as string, name: token.name as string } }
    : null;

  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
