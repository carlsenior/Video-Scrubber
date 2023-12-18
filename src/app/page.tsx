"use client";

import VideoController from "@/components/video/VideoController";
import FileUploadForm from "@/components/fileupload/FileUploadForm";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>();
  const [filename, setFileName] = useState<string>();

  return (
    <main className="flex min-h-screen p-2 font-mono">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <div className="bg-[#101010]">
            <FileUploadForm setUrl={setUrl} setFileName={setFileName} />
          </div>
        </div>

        <div className="col-span-3">
          <VideoController url={url} filename={filename} />
        </div>
      </div>
    </main>
  );
}
