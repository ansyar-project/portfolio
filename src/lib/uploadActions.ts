"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function uploadImageAction(
  formData: FormData
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Process and optimize image with sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    // Save the optimized image
    const optimizedFileName = `${randomUUID()}.jpg`;
    const filePath = join(uploadsDir, optimizedFileName);
    await writeFile(filePath, optimizedBuffer);

    // Return the public URL path
    const imagePath = `/uploads/${optimizedFileName}`;

    return { success: true, imagePath };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteImageAction(
  imagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!imagePath || !imagePath.startsWith("/uploads/")) {
      return { success: false, error: "Invalid image path" };
    }

    const { unlink } = await import("fs/promises");
    const fullPath = join(process.cwd(), "public", imagePath);

    try {
      await unlink(fullPath);
    } catch (error) {
      // File might not exist, which is okay
      console.warn("Could not delete file:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
