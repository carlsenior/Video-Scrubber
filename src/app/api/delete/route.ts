import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  const { filename } = await request.json();
  const absolute_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "videos",
    filename
  );

  const absolute_thumb_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "thumbnails",
    filename
  );

  if (fs.existsSync(absolute_path)) {
    fs.unlinkSync(absolute_path);
    if (fs.existsSync(absolute_thumb_path)) {
      fs.promises.rmdir(absolute_thumb_path, { recursive: true });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "File not found" });
}
