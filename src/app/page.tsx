"use client";

import VideoController from "@/components/video/VideoController";
import FileUploadForm from "@/components/fileupload/FileUploadForm";
import { createContext, useState } from "react";
import path from "path";

const TMP_VIDEO_FOLDER = path.join("tmp", "videos");
const TMP_THUMB_FOLDER = path.join("tmp", "thumbnails"); // should be nested in original video filename
const TMP_WORKS_FOLDER = path.join("tmp", "works"); // should be nested in original video filename
const TMP_STREAMABLE_FOLDER = path.join("tmp", "streamable"); // should be nested in original video filename
const CELLS_COUNT = 16;
const AppContext = createContext<any>({});

export default function Home() {
  const [metaData, setMetaData] = useState<any>({});

  const [workStatus, setWorkStatus] = useState<{
    workfile: string;
    mask: number;
    startMs: number;
    endMs: number;
  }>({
    workfile: "",
    mask: -1,
    startMs: 0,
    endMs: 0,
  });

  return (
    <AppContext.Provider
      value={{
        TMP_VIDEO_FOLDER,
        TMP_THUMB_FOLDER,
        TMP_WORKS_FOLDER,
        TMP_STREAMABLE_FOLDER,
        CELLS_COUNT,
        metaData,
        workStatus,
        setWorkStatus,
        setMetaData,
      }}
    >
      <main className="min-h-screen p-2 font-mono">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <div className="bg-[#101010]">
              <FileUploadForm />
            </div>
          </div>

          <div className="col-span-3">
            <VideoController />
          </div>
        </div>
      </main>
    </AppContext.Provider>
  );
}

export { AppContext };
