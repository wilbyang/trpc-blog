"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichEditor } from "@/components/editor";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const { data: post, isLoading } = trpc.posts.adminById.useQuery({ id });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setTags(post.tags);
      setPublished(post.published);
    }
  }, [post]);

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => router.push("/admin/posts"),
    onError: (e) => setError(e.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    updateMutation.mutate({ id, title, slug, content, excerpt, tags, published });
  }

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!post) return <p className="text-destructive">Post not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            pattern="[a-z0-9-]+"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <Label>Content</Label>
          <RichEditor value={content} onChange={setContent} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="published">Published</Label>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={updateMutation.isPending}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/posts")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
