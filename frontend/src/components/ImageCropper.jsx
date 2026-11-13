import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn } from "lucide-react";
import getCroppedImage from "../utils/cropImage";

export default function ImageCropper({
  file,
  aspect = 1,
  circular = false,
  onCancel,
  onComplete,
}) {
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImage(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);
  const finish = async () => {
    if (!area) return;
    try {
      setBusy(true);
      const cropped = await getCroppedImage(
        image,
        area,
        file.name.replace(/\.[^.]+$/, "") + "-cropped.jpg",
      );
      onComplete(cropped);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <section className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-bold">Crop your image</h2>
            <p className="text-xs text-slate-500">
              Adjust the image before uploading
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </header>
        <div className="relative h-80 bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? "round" : "rect"}
            showGrid={!circular}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center gap-3 p-4">
          <ZoomIn size={18} />
          <input
            aria-label="Zoom"
            className="w-full"
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <span className="w-10 text-right text-xs">{zoom.toFixed(1)}x</span>
        </div>
        <footer className="flex justify-end gap-2 border-t p-4">
          <button type="button" className="btn btn-muted" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || !area}
            onClick={finish}
          >
            {busy ? "Cropping…" : "Use cropped image"}
          </button>
        </footer>
      </section>
    </div>
  );
}
