import { v4 as uuid } from "uuid";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
import Promise from "bluebird";
import { getTickerTimestamps } from "@/lib/generalHelpers";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "File not found" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const file_name = `${uuid()}${path.extname(file.name)}`;

  const _absolute_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "videos",
    file_name
  );

  const output_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "thumbnails",
    file_name
  );

  if (!fs.existsSync(path.join(output_dir))) {
    fs.mkdirSync(path.join(output_dir), { recursive: true });
  }

  await writeFile(_absolute_path, buffer);

  return Promise.promisify((cb) => {
    Ffmpeg.ffprobe(_absolute_path, (err, metadata) => {
      if (err) {
        return cb(err);
      }
      return cb(null, metadata);
    });
  })()
    .then((metadata: any) => {
      const timestamps = getTickerTimestamps(metadata.format.duration, 16);

      return Promise.promisify((cb) => {
        Ffmpeg(_absolute_path)
          .takeScreenshots({
            timestamps,
            filename: `%000i.png`,
            size: "160x120",
            folder: output_dir,
          })
          .on("end", () => {
            return cb(null);
          })
          .on("error", (err: any) => {
            return cb(err);
          });
      })()
        .then(() => {
          return NextResponse.json({
            success: true,
            metadata,
            timestamps,
            filename: file_name,
          });
        })
        .catch((err) => {
          return NextResponse.json({
            success: false,
            error: err,
          });
        });
    })
    .catch((err) => {
      return NextResponse.json({
        success: false,
        error: err,
      });
    });
}
