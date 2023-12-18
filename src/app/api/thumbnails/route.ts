import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import os from "os";
import Promise from "bluebird";

export async function POST(request: NextRequest) {
  const { filename } = await request.json();

  const absolute_source_path = path.join(
    process.cwd(),
    "public",
    "tmp",
    "videos",
    filename
  );
  const output_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "thumbnails",
    filename
  );

  if (!fs.existsSync(path.join(output_dir))) {
    fs.mkdirSync(path.join(output_dir), { recursive: true });
  }

  const temp = os.tmpdir();

  const fetch_thumbnails = (_command: any) => {
    return Promise.promisify<string[]>((cb) => {
      _command
        .on("end", () => {
          cb(null);
        })
        .on("filenames", (_filenames: string[]) => {
          cb(null, _filenames);
        })
        .on("error", (err: any) => {
          cb(err);
        })
        .run();
    });
  };

  let command = ffmpeg(absolute_source_path)
    .takeScreenshots({
      count: 16,
      filename: `%s.png`,
      size: "160x120",
      folder: output_dir,
    })
    .output(path.join(temp, `at-%s.png`));

  return fetch_thumbnails(command)()
    .then((result) => {
      return NextResponse.json({
        success: true,
        result,
      });
    })
    .catch((err) => {
      return NextResponse.json({
        success: false,
        err,
      });
    });
}
