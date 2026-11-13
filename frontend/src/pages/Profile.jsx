import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import ImageCropper from "../components/ImageCropper";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", bio: "" });
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [cropFile, setCropFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => api.get("/posts/mine").then((r) => setPosts(r.data.posts));
  useEffect(() => {
    if (user) setForm({ name: user.name || "", bio: user.bio || "" });
    load();
  }, [user?._id]);
  useEffect(() => {
    if (!profileFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(profileFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profileFile]);
  const selectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Select a valid image file");
    if (file.size > 5 * 1024 * 1024)
      return setError("Image must be 5 MB or smaller");
    setError("");
    setCropFile(file);
    e.target.value = "";
  };
  const save = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (form.name.trim().length < 3)
      return setError("Name must be at least 3 characters");
    const body = new FormData();
    body.append("name", form.name);
    body.append("bio", form.bio);
    if (profileFile) body.append("profilePicture", profileFile);
    try {
      setBusy(true);
      const { data } = await api.patch("/users/me", body);
      setUser(data.user);
      setProfileFile(null);
      setMessage("Profile updated successfully");
    } catch (e) {
      setError(e.response?.data?.message || "Could not update profile");
    } finally {
      setBusy(false);
    }
  };
  const picture = preview || user?.profilePicture;
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-[330px_1fr]">
      <section className="card h-fit p-6">
        <h1 className="text-xl font-black">Your profile</h1>
        <div className="my-5 flex flex-col items-center gap-3">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-violet-100 text-3xl font-bold text-brand">
            {picture ? (
              <img
                src={picture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              form.name?.[0]?.toUpperCase()
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand">
            <ImagePlus size={16} /> Change profile picture
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={selectImage}
            />
          </label>
        </div>

        <div className="mt-5 flex justify-around border-t pt-4 text-center text-sm">
          <div>
            <b>{user?.followers?.length || 0}</b>
            <p className="muted">Followers</p>
          </div>
          <div>
            <b>{user?.following?.length || 0}</b>
            <p className="muted">Following</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4 mt-8">
          <label className="block text-sm font-semibold">
            Name
            <input
              className="field mt-1.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              minLength="3"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              className="field mt-1.5 bg-slate-50 text-slate-500"
              value={user?.email || ""}
              readOnly
            />
          </label>
          <label className="block text-sm font-semibold">
            Bio
            <textarea
              className="field mt-1.5 min-h-24"
              maxLength="300"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell people about yourself"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}
          <button disabled={busy} className="btn btn-primary w-full">
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
        {/* <div className="mt-5 flex justify-around border-t pt-4 text-center text-sm">
          <div>
            <b>{user?.followers?.length || 0}</b>
            <p className="muted">Followers</p>
          </div>
          <div>
            <b>{user?.following?.length || 0}</b>
            <p className="muted">Following</p>
          </div>
        </div> */}
      </section>
      <section>
        <h2 className="mb-4 text-xl font-black">
          Your posts{" "}
          <span className="text-sm font-normal muted">({posts.length})</span>
        </h2>
        {posts.length ? (
          <div className="space-y-4">
            {posts.map((p) => (
              <PostCard key={p._id} post={p} onChange={load} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-sm muted">
            You haven't published anything yet.
          </div>
        )}
      </section>
      {cropFile && (
        <ImageCropper
          file={cropFile}
          aspect={1}
          circular
          onCancel={() => setCropFile(null)}
          onComplete={(file) => {
            setProfileFile(file);
            setCropFile(null);
          }}
        />
      )}
    </main>
  );
}
