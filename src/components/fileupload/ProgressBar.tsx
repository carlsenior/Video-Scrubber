import React from "react";

const ProgressBar = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className="relative mt-5 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
      <div
        className="absolute left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
