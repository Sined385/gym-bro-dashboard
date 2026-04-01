import type { UserPost } from "@/lib/queries";

export function UserPostsList({ posts }: { posts: UserPost[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-gray-400">
        Recent Posts
      </h2>
      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-gray-800 bg-gray-950 p-3"
          >
            <p className="line-clamp-2 text-sm text-gray-300">{p.content}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>{p.like_count} likes</span>
              <span>{p.comment_count} comments</span>
              <span className="ml-auto">
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-8 text-center text-gray-600">No posts yet</p>
        )}
      </div>
    </div>
  );
}
