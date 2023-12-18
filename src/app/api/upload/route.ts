import { v4 as uuid } from "uuid";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "File not found" });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const file_name = `${uuid()}${path.extname(file.name)}`;

  const static_path = path.join("tmp", "videos", file_name);

  const _absolute_path = path.join(process.cwd(), "public", static_path);
  await writeFile(_absolute_path, buffer);
  return NextResponse.json({
    success: true,
    filename: file_name,
  });
}
