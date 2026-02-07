import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image from a URL to Cloudinary
 * @param url The public URL of the image to upload
 * @param folder The folder in Cloudinary to upload to (default: 'vehicle-imports')
 * @returns The secure URL of the uploaded image
 */
export async function uploadImageFromUrl(
  url: string,
  folder: string = "vehicle-imports"
): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn("Cloudinary credentials not set. Returning original URL.");
    return url;
  }

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    // In case of upload failure, we might want to return the original URL or throw
    // For now, let's return the original URL but log the error,
    // effectively falling back to the hotlinked image if possible, or letting the frontend handle broken links.
    // However, for a robust import, failing might be better.
    // Let's throw so the import service can handle it (e.g. skip the image or fail the row).
    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
