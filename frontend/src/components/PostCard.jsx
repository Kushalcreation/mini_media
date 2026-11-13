import { Heart, Trash2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function PostCard({ post, onChange }) {
  const { user } = useAuth();
  const liked = post.likes?.some(
    (item) =>
      (item._id || item) === user?.id || (item._id || item) === user?._id,
  );
  const own = (post.author?._id || post.author) === (user?.id || user?._id);
  const like = async () => {
    try {
      await api.post(`/api/posts/${post._id}/like`);
      onChange?.();
    } catch (e) {
      alert(e.response?.data?.message || "Unable to like post");
    }
  };
  const remove = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/api/posts/${post._id}`);
      onChange?.();
    } catch (e) {
      alert(e.response?.data?.message || "Unable to delete post");
    }
  };
  return (
    <article className="card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-violet-100 font-bold text-brand">
          {post.author?.profilePicture ? (
            <img
              src={post.author.profilePicture}
              className="h-full w-full object-cover"
            />
          ) : (
            post.author?.name?.[0]?.toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{post.author?.name || "User"}</p>
          <p className="text-xs muted">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        {own && (
          <button
            onClick={remove}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Delete post"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
      {post.text && (
        <p className="whitespace-pre-wrap py-4 leading-7">{post.text}</p>
      )}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="max-h-[520px] w-full rounded-xl bg-slate-50 object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
      <div className="mt-4 flex items-center border-t border-slate-100 pt-3">
        <button
          onClick={like}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${liked ? "text-rose-600" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {post.likes?.length || 0} likes
        </button>
      </div>
    </article>
  );
}
