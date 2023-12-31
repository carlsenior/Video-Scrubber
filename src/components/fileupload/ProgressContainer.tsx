import React, { useContext } from "react";
import ProgressBar from "./ProgressBar";
import { AppContext } from "@/app/page";

const ProgressContainer = ({
  file,
  clearFile,
  progress,
}: {
  file: undefined | File;
  clearFile: () => void;
  progress: number;
}) => {
  const { metaData } = useContext(AppContext);

  return file ? (
    <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
      <div className="flex items-center justify-between">
        <span className="truncate pr-3 text-base font-medium text-[#07074D]">
          {file.name}
        </span>
        {metaData?.basename ? (
          <button type="button" className="text-[#07074D]" onClick={clearFile}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : null}
      </div>
      <ProgressBar progress={progress} />
    </div>
  ) : null;
};

export default ProgressContainer;
