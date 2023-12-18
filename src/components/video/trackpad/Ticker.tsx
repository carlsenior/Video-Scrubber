import { toTimeString } from "@/lib/generalHelpers";
import React from "react";

const Ticker = ({
  subDuration,
  width,
}: {
  subDuration: number;
  width: number;
}) => {
  return (
    <div className="flex text-[10px] h-[20px] border-[#303030] border-solid border-l-2 track-ticker">
      <span style={{ width: `${width}px` }}>{toTimeString(subDuration)}</span>
    </div>
  );
};

export default Ticker;
