import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(process.cwd(), "public", "uploads", filename);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }
    const fileBuffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase();

    let contentType = "application/octet-stream";
    switch (ext) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "webp":
        contentType = "image/webp";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving upload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
