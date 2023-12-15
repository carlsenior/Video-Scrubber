"use client";

import FileUploadForm from "../components/FileUploadForm";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>();

  return (
    <main className="flex min-h-screen p-24 font-mono">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="bg-white">
            <FileUploadForm setUrl={setUrl} />
          </div>
        </div>

        <div className="col-span-2">
          <h3>This is video tag - {url}</h3>
        </div>
      </div>
    </main>
  );
}
