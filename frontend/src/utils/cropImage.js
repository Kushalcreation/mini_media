export default function getCroppedImage(
  imageSrc,
  pixelCrop,
  fileName = "cropped-image.jpg",
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas is not supported"));
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Could not crop image"));
          resolve(
            new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            }),
          );
        },
        "image/jpeg",
        0.92,
      );
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}
