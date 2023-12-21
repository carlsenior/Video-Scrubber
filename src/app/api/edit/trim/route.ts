import { NextRequest, NextResponse } from "next/server";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";
import Promise from "bluebird";
import fs from "fs";
import { getFilenamesInFolderSorted } from "../../getFilenamesInFolderSorted";

export async function POST(request: NextRequest) {
  const { basename, workfile, startMs, endMs } = await request.json();

  const absolute_work_file_dir = path.join(
    process.cwd(),
    "public",
    "tmp",
    "works",
    basename
  );

  const _absolute_work_file_path = path.join(absolute_work_file_dir, workfile);

  const new_work_file = `${startMs}_${endMs}${path.extname(workfile)}`;
  const _absolute_new_work_file_path = path.join(
    absolute_work_file_dir,
    new_work_file
  );

  return Promise.promisify((cb) => {
    Ffmpeg()
      .input(_absolute_work_file_path)
      .outputOptions([`-ss ${startMs}ms`, `-to ${endMs}ms`])
      .output(_absolute_new_work_file_path)
      .on("end", () => cb(null))
      .on("error", (err) => cb(err))
      .run();
  })()
    .then(() => {
      // unlink the old work file
      fs.unlink(_absolute_work_file_path, (err) => {
        if (err) {
          console.error("old file unlink error - ", err);
          return NextResponse.json({ success: false, error: err });
        }
        return NextResponse.json({
          success: true,
          new_work_file: new_work_file,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return NextResponse.json({ success: false, error: err });
    });
}
