"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.css";
import { getTickerDurationMs } from "@/lib/generalHelpers";
import Ticker from "./Ticker";
import Seeker from "./Seeker";
import ThumbCanvas from "./ThumbCanvas";

const TrackPad = ({
  duration,
  url,
  filename,
}: {
  duration: number;
  url: string;
  filename: undefined | string;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [tickerCounts, setTickerCounts] = useState(32); // because intial ticker count is 16

  const tickerDuration = getTickerDurationMs(duration, 16); // typically draw total duration within 16 tickers - one screen

  function getTicketsByCount(count: number) {
    return Array.from({ length: count }, (_, i) => {
      return (
        <Ticker
          key={uuid()}
          subDuration={tickerDuration * i}
          width={tickerWidth}
        />
      );
    });
  }

  const tickers = getTicketsByCount(tickerCounts);
  const onScroll = (e: Event) => {
    const { scrollWidth, scrollLeft, clientWidth } =
      e.currentTarget as HTMLDivElement;
    if (scrollLeft + clientWidth * 0.5 >= scrollWidth * 0.6) {
      setTickerCounts(tickerCounts + 16);
    } else if (scrollLeft + clientWidth * 0.5 < scrollWidth * 0.2) {
      if (tickerCounts > 32) setTickerCounts(tickerCounts - 16);
    }

    // if (scrollLeft + clientWidth * 0.5 < scrollWidth * 0.5) {
    //   if (tickerCounts >setTickerCounts) settickerCounts(tsetTickerCounts -setTickerCounts);
    // }
  };

  useEffect(() => {
    const parent_width = parentRef.current?.clientWidth as unknown as number;
    setTickerWidth(Math.floor((parent_width - 22) / 16) - 2); // border left width: 2px, margin-left: 10px, additioinal 12px of end

    parentRef.current?.addEventListener("scroll", onScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      parentRef.current?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-col relative mt-4 w-full h-[200px] text-[#eee] overflow-y-hidden"
      ref={parentRef}
    >
      <div className="flex ml-[10px] user-select-none">{tickers}</div>
      <ThumbCanvas
        duration={duration}
        tickerWidth={tickerWidth}
        tickerDuration={tickerDuration}
        url={url}
        filename={filename}
      />
      <Seeker />
    </div>
  );
};

export default TrackPad;
