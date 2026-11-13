import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import { X, Check } from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import getCroppedImage from "../utils/cropImage.js";

export default function PostImageCropper({ file, onCancel, onComplete }) {
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file || !(file instanceof Blob)) {
      console.error("Invalid image file:", file);
      return;
    }
    const url = URL.createObjectURL(file);
    setImage(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const finish = async () => {
    if (!completedCrop?.width || !completedCrop?.height) return;

    try {
      setBusy(true);

      const cropped = await getCroppedImage(
        image,
        completedCrop,
        file.name.replace(/\.[^.]+$/, "") + "-cropped.jpg",
      );

      onComplete(cropped);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4">
      <section className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-bold text-lg">Crop your post image</h2>
            <p className="text-xs text-slate-500">
              Drag the corners or edges to resize your selection
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        {/* Resizable crop area */}
        <div className="flex max-h-[65vh] min-h-[300px] items-center justify-center overflow-auto bg-slate-950 p-4">
          {image && (
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c, pixelCrop) => setCompletedCrop(pixelCrop)}
              keepSelection
              ruleOfThirds
            >
              <img
                src={image}
                alt="Crop post"
                className="block max-h-[60vh] max-w-full object-contain"
              />
            </ReactCrop>
          )}
        </div>

        {/* Footer */}
        <footer className="flex justify-end gap-3 border-t p-4">
          <button type="button" onClick={onCancel} className="btn btn-muted">
            Cancel
          </button>

          <button
            type="button"
            onClick={finish}
            disabled={busy || !completedCrop?.width}
            className="btn btn-primary flex items-center gap-2"
          >
            <Check size={17} />
            {busy ? "Cropping..." : "Use cropped image"}
          </button>
        </footer>
      </section>
    </div>
  );
}
