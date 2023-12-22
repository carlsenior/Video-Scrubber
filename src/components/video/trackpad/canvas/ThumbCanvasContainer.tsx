"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import ThumbCanvas from "./ThumbCanvas";
import { AppContext } from "@/app/page";
import RangeMaskContainer from "../ranges/RangeMaskContainer";

const ThumbCanvasContainer = ({
  tickerWidth,
  handleMoveSeekBar,
}: {
  tickerWidth: number;
  handleMoveSeekBar: (movePayload: { move: boolean; distance: number }) => void;
}) => {
  // states for canvas
  const parentRef = useRef<HTMLDivElement>(null);
  const { CELLS_COUNT } = useContext(AppContext);
  const [size, setSize] = useState({
    width: tickerWidth * CELLS_COUNT, // cell size is tickerWidth + 2px for border
    height: 0,
  });

  useEffect(() => {
    const containerDiv = parentRef.current as unknown as HTMLCanvasElement;
    setSize({
      width: tickerWidth * CELLS_COUNT,
      height: containerDiv.clientHeight,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerWidth]);

  return (
    <div className="ml-[10px] mt-1 sm:mt-3 h-10 relative" ref={parentRef}>
      <ThumbCanvas size={size} tickerWidth={tickerWidth} />
      <RangeMaskContainer
        canvasSize={size}
        handleMoveSeekBar={handleMoveSeekBar}
      />
    </div>
  );
};

export default ThumbCanvasContainer;
