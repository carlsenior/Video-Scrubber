"use client";

import VideoController from "@/components/video/VideoController";
import FileUploadForm from "@/components/fileupload/FileUploadForm";
import { createContext, useState } from "react";
import path from "path";

const TMP_VIDEO_FOLDER = path.join("tmp", "videos");
const TMP_THUMB_FOLDER = path.join("tmp", "thumbnails"); // should be nested in video filename
const CELLS_COUNT = 16;
const AppContext = createContext<any>({});

export default function Home() {
  const [metaData, setMetaData] = useState<any>({});

  return (
    <AppContext.Provider
      value={{
        TMP_VIDEO_FOLDER,
        TMP_THUMB_FOLDER,
        CELLS_COUNT,
        metaData,
        setMetaData,
      }}
    >
      <main className="flex min-h-screen p-2 font-mono">
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
