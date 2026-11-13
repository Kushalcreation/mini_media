// import cloudinary from "../config/cloudinary.js";

// export function uploadBufferToCloudinary(fileBuffer, folder) {
//   return new Promise((res, rej) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: "image" },
//       (error, result) => (error ? rej(error) : res(result)),
//     );
//     stream.end(fileBuffer);
//   });
// }

// export async function deleteCloudinaryImage(publicId) {
//   if (!publicId) return;
//   try {
//     await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
//   } catch (error) {
//     console.error("Cloudinary cleanup failed:", error.message);
//   }
// }

import cloudinary from "../config/cloudinary.js";

export function uploadBufferToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY ERROR:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            error: error.error,
          });

          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}
