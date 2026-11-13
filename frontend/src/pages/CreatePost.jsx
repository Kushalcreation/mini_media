import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import api from "../services/api";
import ImageCropper from "../components/ImageCropper";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [cropFile, setCropFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);
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
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim() && !imageFile)
      return setError("Write something or add an image");
    const body = new FormData();
    body.append("text", text);
    if (imageFile) body.append("image", imageFile);
    try {
      setBusy(true);
      await api.post("/api/posts", body);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Could not create post");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-black">Create a post</h1>
      <p className="mb-6 text-sm muted">
        Share a thought, update, or moment with everyone.
      </p>
      <form onSubmit={submit} className="card space-y-5 p-6">
        <label className="block text-sm font-semibold">
          What's happening?
          <textarea
            className="field mt-2 min-h-36 resize-y"
            maxLength="2000"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something worth sharing…"
          />
          <span className="mt-1 block text-right text-xs muted">
            {text.length}/2000
          </span>
        </label>
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-violet-300 px-4 py-3 text-sm font-semibold text-brand hover:bg-violet-50">
            <ImagePlus size={18} /> Select image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={selectImage}
            />
          </label>
          <p className="mt-1 text-xs muted">
            JPG, PNG, WEBP or GIF · Maximum 5 MB · Crop before publishing
          </p>
        </div>
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Cropped post preview"
              className="max-h-80 w-full rounded-xl object-contain bg-slate-50"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setPreview("");
              }}
              className="absolute right-2 top-2 rounded-full bg-white p-2 shadow"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="btn btn-muted"
          >
            Cancel
          </button>
          <button disabled={busy} className="btn btn-primary">
            {busy ? "Uploading…" : "Publish post"}
          </button>
        </div>
      </form>
      {cropFile && (
        <ImageCropper
          file={cropFile}
          aspect={1}
          onCancel={() => setCropFile(null)}
          onComplete={(file) => {
            setImageFile(file);
            setCropFile(null);
          }}
        />
      )}
    </main>
  );
}
