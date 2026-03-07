"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPostsPage() {
  const { data: posts, refetch } = trpc.posts.adminList.useQuery();
  const toggleMutation = trpc.posts.togglePublished.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Create your first one!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      /{post.slug} · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: post.id,
                        published: !post.published,
                      })
                    }
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                  {post.published && (
                    <Link href={`/posts/${post.slug}`} target="_blank">
                      <Button size="sm" variant="ghost">
                        View ↗
                      </Button>
                    </Link>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Delete this post?")) {
                        deleteMutation.mutate({ id: post.id });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
