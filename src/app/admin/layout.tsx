import Link from "next/link";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-muted/40">
      {session && (
        <nav className="bg-background border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/posts" className="font-semibold text-sm hover:underline">
              Admin
            </Link>
            <Link href="/admin/posts/new" className="text-sm text-muted-foreground hover:underline">
              New Post
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              View Blog
            </Link>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:underline"
            >
              Sign out
            </button>
          </form>
        </nav>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
