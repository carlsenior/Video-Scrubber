"use client";

import { deleteFile, uploadFile } from "@/lib/apiHelper";
import React, { useContext, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ProgressContainer from "./ProgressContainer";
import { AxiosRequestConfig } from "axios";
import { AppContext } from "@/app/page";

const FileUploadForm = () => {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { metaData, setMetaData } = useContext(AppContext);

  const fileInputRef = useRef(null);

  const clearFile = async () => {
    setMetaData(undefined);
    setFile(undefined);
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = "";
    }
    if (metaData?.filename) {
      await deleteFile(metaData.filename);
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

      setMetaData({
        duration: res.metadata.format.duration,
        filename: res.filename,
        timestamps: res.timestamps,
      });

      setTimeout(() => {
        setProgress(0);
      }, 500);
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
            disabled={uploading}
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
