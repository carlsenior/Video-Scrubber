"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.css";
import { getTickerTimestamps } from "@/lib/generalHelpers";
import Ticker from "./Ticker";
import Seeker from "./Seeker";
import { AppContext } from "@/app/page";
import ThumbCanvasContainer from "./canvas/ThumbCanvasContainer";

const TrackPad = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { metaData } = useContext(AppContext);

  const [tickerWidth, setTickerWidth] = useState(0);
  const [tickerCounts, setTickerCounts] = useState(32); // because intial ticker count is 16

  function getTicketsByCount(count: number) {
    const tickerTimeStamps = getTickerTimestamps(
      (metaData.duration * count) / 16,
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
      setTickerCounts(tickerCounts + 8);
    } else if (scrollLeft + clientWidth * 0.5 < scrollWidth * 0.3) {
      // decrease ticker count
      if (tickerCounts > 32) setTickerCounts(tickerCounts - 8);
    }
  };

  useEffect(() => {
    const parent_width = parentRef.current!.clientWidth as unknown as number;
    setTickerWidth(Math.floor((parent_width - 22) / 16) - 2); // border left width: 2px, margin-left: 10px, additioinal 12px of end
  }, []);

  return (
    <div
      className="flex flex-col relative mt-4 w-full h-[200px] text-[#eee] overflow-y-hidden user-select-none"
      ref={parentRef}
      onScroll={onScroll}
    >
      <div className="flex ml-[10px]">{tickers}</div>
      <ThumbCanvasContainer tickerWidth={tickerWidth} />
      <Seeker />
    </div>
  );
};

export default TrackPad;
