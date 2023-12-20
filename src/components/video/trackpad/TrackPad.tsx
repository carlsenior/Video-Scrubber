"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.css";
import Seeker from "./Seeker";
import { AppContext } from "@/app/page";
import TickersList from "./TickersList";
import ThumbCanvasContainer from "./canvas/ThumbCanvasContainer";

const TrackPad = ({
  currentTimeMs,
  seekTo,
  playing,
}: {
  currentTimeMs: number;
  seekTo: (toInSeconds: number) => void;
  playing: boolean;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { CELLS_COUNT } = useContext(AppContext);

  const [tickerWidth, setTickerWidth] = useState(0);
  const [tickerCounts, setTickerCounts] = useState(CELLS_COUNT * 2); // because intial ticker count is 16

  const [movePayload, setMovePayload] = useState({
    move: false,
    distance: 0,
  });

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollWidth, scrollLeft, clientWidth } =
      e.currentTarget as HTMLDivElement;
    if (scrollLeft + clientWidth * 0.5 >= scrollWidth * 0.6) {
      // increase ticker count
      setTickerCounts(tickerCounts + CELLS_COUNT / 2); // +8 cells for smoothly scrolling
    } else if (scrollLeft + clientWidth * 0.5 < scrollWidth * 0.3) {
      // decrease ticker count
      if (tickerCounts > 32) setTickerCounts(tickerCounts - CELLS_COUNT / 2); // -8 cells for smoothly scrolling
    }
  };

  const moveSeekBar = (distanceX: number) => {
    const seekBar = parentRef.current!.parentElement as HTMLDivElement;
    seekBar.style.transform = `translateX(${distanceX}px)`;
  };

  useEffect(() => {
    const parent_width = parentRef.current!.clientWidth as unknown as number;
    setTickerWidth(Math.floor((parent_width - 22) / CELLS_COUNT)); // margin-left: 10px, additioinal 12px of end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-col relative mt-4 w-full h-[200px] text-[#eee] overflow-y-hidden user-select-none"
      ref={parentRef}
      onScroll={onScroll}
    >
      <TickersList
        count={tickerCounts}
        tickerWidth={tickerWidth}
        handleMoveSeekBar={setMovePayload}
      />
      <ThumbCanvasContainer tickerWidth={tickerWidth} />
      <Seeker
        currentTimeMs={currentTimeMs}
        tickerWidth={tickerWidth}
        playing={playing}
        seekTo={seekTo}
        movePayload={movePayload}
      />
    </div>
  );
};

export default TrackPad;
