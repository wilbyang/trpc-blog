"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichEditor } from "@/components/editor";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => router.push("/admin/posts"),
    onError: (e) => setError(e.message),
  });

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent, asDraft = false) {
    e.preventDefault();
    setError("");
    createMutation.mutate({ title, slug, content, excerpt, tags, published: !asDraft && published });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
      <form className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={handleTitleChange} required />
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
            placeholder="Short summary shown in the post list…"
          />
        </div>
        <div className="space-y-1">
          <Label>Content</Label>
          <RichEditor value={content} onChange={setContent} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="nextjs, react, typescript"
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            variant="outline"
            disabled={createMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={(e) => { setPublished(true); handleSubmit(e, false); }}
            disabled={createMutation.isPending}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
