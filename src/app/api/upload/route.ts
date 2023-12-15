import { randomUUID } from "crypto";
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

  const static_path = path.join(
    "tmp",
    `${randomUUID()}${path.extname(file.name)}`
  );

  const _absolute_path = path.join(process.cwd(), "public", static_path);
  await writeFile(_absolute_path, buffer);
  return NextResponse.json({
    success: true,
    url: static_path,
  });
}
