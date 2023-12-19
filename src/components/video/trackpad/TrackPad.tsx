"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.css";
import { getTickerTimestamps } from "@/lib/generalHelpers";
import Ticker from "./Ticker";
import Seeker from "./Seeker";
import { AppContext } from "@/app/page";
import ThumbCanvasContainer from "./canvas/ThumbCanvasContainer";

const TrackPad = ({
  currentTimeMs,
  seekTo,
}: {
  currentTimeMs: number;
  seekTo: (toInSeconds: number) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { metaData, CELLS_COUNT } = useContext(AppContext);

  const [tickerWidth, setTickerWidth] = useState(0);
  const [tickerCounts, setTickerCounts] = useState(CELLS_COUNT * 2); // because intial ticker count is 16

  function getTicketsByCount(count: number) {
    const tickerTimeStamps = getTickerTimestamps(
      (metaData.duration * count) / CELLS_COUNT,
      count,
      false
    ); // typically draw total duration within 16 tickers - on screen appproximately
    return Array.from({ length: count }, (_, i) => {
      return (
        <Ticker
          key={uuid()}
          tickerLabel={tickerTimeStamps[i]}
          width={tickerWidth}
        />
      );
    });
  }

  const tickers = getTicketsByCount(tickerCounts);
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
      <div className="flex ml-[10px]">{tickers}</div>
      <ThumbCanvasContainer tickerWidth={tickerWidth} />
      <Seeker
        currentTimeMs={currentTimeMs}
        tickerWidth={tickerWidth}
        seekTo={seekTo}
      />
    </div>
  );
};

export default TrackPad;
