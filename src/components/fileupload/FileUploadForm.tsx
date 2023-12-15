"use client";

import { uploadFile } from "@/lib/fileupload";
import React, { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ProgressContainer from "./ProgressContainer";
import { AxiosRequestConfig } from "axios";

const FileUploadForm = ({ setUrl }: { setUrl: (arg0: string) => void }) => {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  const clearFile = () => {
    setFile(undefined);
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = "";
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.set("file", file);

      const options: AxiosRequestConfig = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress(progressEvent: any) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      };

      const res = await uploadFile(data, options);
      setTimeout(() => {
        setProgress(0);
      }, 500);
      setUrl(res.url);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="py-6 px-9"
      onSubmit={onSubmit}
      encType="multipart/form-data"
    >
      <div className="pt-4 mb-6 ">
        <div className="mb-8 bg-white rounded-md">
          <input
            type="file"
            name="file"
            id="file"
            accept="video/*"
            className="sr-only"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <label
            htmlFor="file"
            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center cursor-pointer"
          >
            <div>
              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                Drop files here
              </span>
              <span className="mb-2 block text-base font-medium text-[#6B7280]">
                Or
              </span>
              <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                Browse
              </span>
            </div>
          </label>
        </div>

        <ProgressContainer
          file={file}
          clearFile={clearFile}
          progress={progress}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={uploading}
          className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
        >
          {uploading ? <LoadingSpinner /> : "Send File"}
        </button>
      </div>
    </form>
  );
};

export default FileUploadForm;
