import { AppContext } from "@/app/page";
import { getWidthInBaseMedia } from "@/lib/generalHelpers";
import React, { useContext, useEffect, useRef, useState } from "react";
import classnames from "classnames";

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
  const [clicked, setClicked] = useState(false);
  const maskRef = useRef(null);
  const { metaData } = useContext(AppContext);
  const duration = metaData.duration;
  const mask_count = metaData.works.length + 1;

  const getWidthInBase = (positionMs: number) => {
    return getWidthInBaseMedia(positionMs, canvasWidth, duration);
  };

  const _classnames = classnames(
    "bg-[#303030] absolute top-[-2px] rounded z-10 cursor-pointer",
    {
      "mask-border": clicked,
    }
  );

  // base left + amount of change from rStart of input range, current is empty if final right mask
  let _left = 0;
  if (index != mask_count - 1) {
    if (index == 0) {
      _left = 0;
    } else {
      _left =
        getWidthInBase(previous[1]) -
        ((100 - rEnd) / 100) * getWidthInBase(previous[1] - previous[0]);
    }
  } else {
    _left =
      getWidthInBase(previous[1]) -
      (1 - rEnd / 100) * getWidthInBase(previous[1] - previous[0]);
  }

  // base width + amount of change from rStart of input range
  let _width = 0;
  if (index != mask_count - 1) {
    if (index == 0) {
      _width =
        getWidthInBase(current[0]) +
        (rStart / 100) * getWidthInBase(current[1] - current[0]);
    } else {
      _width =
        getWidthInBase(current[1] - current[0]) +
        (rStart / 100) * getWidthInBase(current[1] - current[0]);
    }
  } else {
    _width =
      canvasWidth -
      getWidthInBase(previous[1]) +
      (1 - rEnd / 100) * getWidthInBase(previous[1] - previous[0]);
  }

  const handleMouseClick = (e: any) => {
    const maskDiv = e.target;
    if (maskDiv == maskRef.current) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseClick);
    return () => {
      window.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);

  return (
    <div
      ref={maskRef}
      className={_classnames}
      style={{ left: _left, width: Math.round(_width), height: height + 4 }} // that's why border 2px
    ></div>
  );
};

export default Mask;
