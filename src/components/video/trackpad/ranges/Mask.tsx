import { AppContext } from "@/app/page";
import React, { useContext } from "react";

const Mask = ({
  index,
  height,
  previous,
  current,
  rStart,
  rEnd,
  canvasWidth,
}: {
  index: number;
  height: number;
  previous: number[];
  current: number[];
  rStart: number;
  rEnd: number;
  canvasWidth: number;
}) => {
  const { metaData } = useContext(AppContext);
  const duration = metaData.duration;
  const mask_count = metaData.works.length + 1;

  const getWidthInBaseMedia = (ms: number) => {
    return Math.floor(canvasWidth * (ms / (duration * 1000)));
  };

  // base left + amount of change from rStart of input range, current is empty if final right mask
  const _left =
    index != mask_count - 1
      ? (index == 0 ? 0 : getWidthInBaseMedia(previous[1])) -
        ((100 - rEnd) / 100) * getWidthInBaseMedia(previous[1] - previous[0])
      : getWidthInBaseMedia(previous[1]) -
        (1 - rEnd / 100) * getWidthInBaseMedia(previous[1] - previous[0]);

  // base width + amount of change from rStart of input range
  const _width =
    index != mask_count - 1
      ? (index == 0
          ? getWidthInBaseMedia(current[0])
          : getWidthInBaseMedia(current[1] - current[0])) +
        (rStart / 100) * getWidthInBaseMedia(current[1] - current[0])
      : canvasWidth -
        getWidthInBaseMedia(previous[1]) +
        (1 - rEnd / 100) * getWidthInBaseMedia(previous[1] - previous[0]);
  return (
    <div
      className="bg-[#303030] absolute top-[-2px] rounded"
      style={{ left: _left, width: _width, height: height + 4 }} // that's why border 2px
    ></div>
  );
};

export default Mask;
