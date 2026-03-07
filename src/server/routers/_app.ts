import { postsRouter } from "./posts";
import { router } from "@/server/trpc";

export const appRouter = router({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
