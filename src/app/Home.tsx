"use client";
import FileUploadForm from "../components/FileUploadForm";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>();

  return (
    <main className="flex min-h-screen p-24 font-mono">
      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-[550px] bg-white">
              <FileUploadForm setUrl={setUrl} />
            </div>
          </div>
        </div>

        <div className="">
          <h3>This is video tag</h3>
        </div>
      </div>
    </main>
  );
}
