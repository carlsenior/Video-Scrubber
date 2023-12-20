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

  const _absolute_original_video_path = path.join(
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

  const works_video_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "works",
    file_name
  );

  // Create output directories of thumbnails if they don't exist
  if (!fs.existsSync(path.join(output_dir))) {
    fs.mkdirSync(path.join(output_dir), { recursive: true });
  }

  // Create output directories of works if they don't exist
  if (!fs.existsSync(path.join(works_video_dir))) {
    fs.mkdirSync(path.join(works_video_dir), { recursive: true });
  }

  await writeFile(_absolute_original_video_path, buffer);

  return Promise.promisify((cb) => {
    Ffmpeg.ffprobe(_absolute_original_video_path, (err, metadata) => {
      if (err) {
        return cb(err);
      }
      return cb(null, metadata);
    });
  })()
    .then(async (metadata: any) => {
      const timestamps = getTickerTimestamps(metadata.format.duration, 16);

      // create working file named start_end.mp4, start and end is timestampsMS
      const _work_file_name = `00000_${Math.floor(
        metadata.format.duration * 1000
      )}.mp4`;
      const absolute_work_video_file_path = path.join(
        works_video_dir,
        _work_file_name
      );
      await writeFile(absolute_work_video_file_path, buffer);

      return Promise.promisify((cb) => {
        Ffmpeg(_absolute_original_video_path)
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
            workfilename: _work_file_name,
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
