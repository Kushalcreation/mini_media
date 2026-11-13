import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const load = () =>
    api
      .get("/posts")
      .then((r) => setPosts(r.data.posts))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  return (
    <main className="feed-layout mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden space-y-4 lg:block">
        <div className="card sticky top-4 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-violet-100 font-bold text-brand">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold">{user?.name}</p>
              <p className="text-xs muted">Your space</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 muted">
            Share updates, connect with people, and discover new perspectives.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-block text-sm font-bold text-brand"
          >
            View your profile →
          </Link>
        </div>
        <div className="card sticky top-4 p-5">
          <p className="font-bold">Quick links</p>
          <div className="mt-3 space-y-3 text-sm">
            <Link className="block muted hover:text-brand" to="/people">
              Discover people
            </Link>
            <Link className="block muted hover:text-brand" to="/my-posts">
              Your posts
            </Link>
            <Link className="block muted hover:text-brand" to="/create">
              Create a post
            </Link>
          </div>
          <h2 className="mt-4 text-[10px] opacity-40 ">
            @All Rights Reserved <br />
            kushalcoding127@gmail.com
          </h2>
        </div>
      </aside>
      <section className="feed-scroll min-w-0 space-y-5">
        <div>
          <p className="text-sm font-semibold text-brand">YOUR COMMUNITY</p>
          <h1 className="mt-1 text-2xl font-black">Explore the feed</h1>
          <p className="mt-1 text-sm muted">
            Fresh thoughts and moments from your community.
          </p>
        </div>
        <Link
          to="/create"
          className="card flex items-center gap-3 p-4 hover:border-violet-200"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 font-bold text-brand">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm muted">
            What's on your mind, {user?.name?.split(" ")[0]}?
          </span>
          <span className="btn btn-primary ml-auto text-xs">Create</span>
        </Link>
        {loading ? (
          <p className="py-10 text-center muted">Loading posts…</p>
        ) : posts.length ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onChange={load} />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="font-bold">It's quiet here</p>
            <p className="mt-1 text-sm muted">
              Be the first to share something.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
