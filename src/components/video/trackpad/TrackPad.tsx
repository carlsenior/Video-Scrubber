import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.css";
import { getTickerDurationMs } from "@/lib/getTickerDuration";
import Ticker from "./Ticker";
import Seeker from "./Seeker";

const TrackPad = ({ duration }: { duration: number }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [ticketWidth, setticketWidth] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(32); // because intial ticker count is 16

  const tickerDuration = getTickerDurationMs(duration, 16); // typically draw total duration within 16 tickers - one screen

  function getTicketsByCount(count: number) {
    return Array.from({ length: count }, (_, i) => {
      return (
        <Ticker
          key={uuid()}
          subDuration={tickerDuration * i}
          width={ticketWidth}
        />
      );
    });
  }

  console.log("create tickers");
  const tickers = getTicketsByCount(ticketsCount);

  const onScroll = (e: Event) => {
    const { scrollWidth, scrollLeft, clientWidth } =
      e.currentTarget as HTMLDivElement;
    if (scrollLeft + clientWidth >= scrollWidth) {
      setTicketsCount(ticketsCount + 16);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    const parent_width = parentRef.current?.clientWidth as unknown as number;
    setticketWidth(Math.floor((parent_width - 22) / 16) - 2); // border left width: 2px, margin-left: 10px, additioinal 12px

    parentRef.current?.addEventListener("scroll", onScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      parentRef.current?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsCount]);

  return (
    <div
      className="flex flex-col relative mt-4 w-full h-[200px] text-[#eee] overflow-y-hidden"
      ref={parentRef}
    >
      <div className="flex ml-[10px] user-select-none">{tickers}</div>
      <Seeker />
    </div>
  );
};

export default TrackPad;
