import Link from "next/link";
import { serverCaller } from "@/trpc/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const caller = await serverCaller;
  const posts = await caller.posts.list(tag ? { tag } : undefined);

  // Collect all tags across posts
  const allTags = Array.from(
    new Set(
      posts.flatMap((p) =>
        p.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    )
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">My Blog</h1>
        <p className="text-muted-foreground mt-2">Thoughts, ideas, and writing.</p>
      </header>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/">
            <Badge variant={!tag ? "default" : "outline"}>All</Badge>
          </Link>
          {allTags.map((t) => (
            <Link key={t} href={`/?tag=${t}`}>
              <Badge variant={tag === t ? "default" : "outline"}>{t}</Badge>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => (
            <div key={post.id}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {post.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                  </div>
                  <CardTitle>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
              {i < posts.length - 1 && <Separator className="my-2 opacity-0" />}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
