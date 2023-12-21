import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  const { filename } = await request.json();
  const absolute_original_video_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "videos",
    filename
  );

  const absolute_streamable_video_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "streamable",
    filename
  );

  const absolute_thumbnails_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "thumbnails",
    filename
  );

  const absolute_works_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "works",
    filename
  );

  if (fs.existsSync(absolute_original_video_path)) {
    fs.unlinkSync(absolute_original_video_path);
    if (fs.existsSync(absolute_thumbnails_dir)) {
      fs.rmSync(absolute_thumbnails_dir, { recursive: true, force: true });
    }
    if (fs.existsSync(absolute_works_dir)) {
      fs.rmSync(absolute_works_dir, { recursive: true, force: true });
    }
    if (fs.existsSync(absolute_streamable_video_dir)) {
      fs.rmSync(absolute_streamable_video_dir, {
        recursive: true,
        force: true,
      });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "File not found" });
}
