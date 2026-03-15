const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzbkzw9bn";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Upload an image file to Cloudinary
 */
export async function uploadImage(
  file: File,
  folder: string = "nishancreates"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Cloudinary upload failed");
  }

  return response.json();
}

/**
 * Get optimized image URL from Cloudinary
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const { width = 800, quality = 80, format = "auto" } = options;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${quality},f_${format}/${publicId}`;
}
