import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/routers/_app";
import { auth } from "@/auth";

const createCaller = createCallerFactory(appRouter);

// Server-side caller for RSC: reads session via next/headers (auth() works fine here)
export const serverCaller = createCaller(async () => {
  const session = await auth();
  if (!session?.user?.email) return { session: null };
  return {
    session: {
      user: { email: session.user.email, name: session.user.name ?? "" },
    },
  };
});
