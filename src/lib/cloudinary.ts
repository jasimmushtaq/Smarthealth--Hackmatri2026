/**
 * Cloudinary unsigned upload utility for doctor profile images.
 * Uses the Cloudinary REST API directly — no SDK needed.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const hasValidCloudinaryConfig = Boolean(CLOUD_NAME && UPLOAD_PRESET);

if (!hasValidCloudinaryConfig) {
  console.warn(
    "Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."
  );
}

/**
 * Upload an image file to Cloudinary using an unsigned upload preset.
 *
 * @param file   - The image File to upload
 * @param folder - Cloudinary folder path (default: "doctor-profiles")
 * @returns The optimized secure URL of the uploaded image
 * @throws  Error if the upload fails or Cloudinary is not configured
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "doctor-profiles"
): Promise<string> {
  if (!hasValidCloudinaryConfig) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Cloudinary upload failed (HTTP ${response.status})`
    );
  }

  const data = await response.json();

  // Return the secure URL with auto-format and auto-quality transforms
  // e.g. https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v123/doctor-profiles/abc.jpg
  const secureUrl: string = data.secure_url;
  return secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");
}
