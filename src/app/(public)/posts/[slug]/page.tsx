import Link from "next/link";
import { notFound } from "next/navigation";
import { serverCaller } from "@/trpc/server";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caller = await serverCaller;

  let post;
  try {
    post = await caller.posts.bySlug({ slug });
  } catch {
    notFound();
  }

  if (!post.published) notFound();

  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:underline mb-8 inline-block"
      >
        ← Back to all posts
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{post.title}</h1>
          <time className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
