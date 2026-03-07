import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { eq, desc, like, sql } from "drizzle-orm";
import { z } from "zod";

const postInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  content: z.string(),
  excerpt: z.string(),
  tags: z.string(),
  published: z.boolean(),
});

export const postsRouter = router({
  // Public
  list: publicProcedure
    .input(z.object({ tag: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const all = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
      });
      if (input?.tag) {
        return all.filter((p) => p.tags.split(",").map((t) => t.trim()).includes(input.tag!));
      }
      return all;
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
      });
      if (!post) throw new Error("Post not found");
      return post;
    }),

  // Admin
  adminList: protectedProcedure.query(async () => {
    return db.query.posts.findMany({ orderBy: [desc(posts.createdAt)] });
  }),

  adminById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });
      if (!post) throw new Error("Post not found");
      return post;
    }),

  create: protectedProcedure
    .input(postInput)
    .mutation(async ({ input }) => {
      const [post] = await db.insert(posts).values(input).returning();
      return post;
    }),

  update: protectedProcedure
    .input(postInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [post] = await db
        .update(posts)
        .set({ ...data, updatedAt: sql`(datetime('now'))` })
        .where(eq(posts.id, id))
        .returning();
      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
    }),

  togglePublished: protectedProcedure
    .input(z.object({ id: z.number(), published: z.boolean() }))
    .mutation(async ({ input }) => {
      const [post] = await db
        .update(posts)
        .set({ published: input.published, updatedAt: sql`(datetime('now'))` })
        .where(eq(posts.id, input.id))
        .returning();
      return post;
    }),
});
