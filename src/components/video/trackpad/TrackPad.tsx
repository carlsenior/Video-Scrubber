import React from "react";
import "./index.css";
import { getTickerDurationMs } from "@/lib/getTickerDuration";
import Ticker from "./Ticker";
import Seeker from "./Seeker";

const TrackPad = ({ duration }: { duration: number }) => {
  const ticker_count = 16;
  const tickerDuration = getTickerDurationMs(duration, ticker_count);
  const tickers = Array.from({ length: ticker_count }, (_, i) => {
    return <Ticker key={i} subDuration={tickerDuration * i} />;
  });
  return (
    <div className="flex flex-col relative mt-4 w-full h-[200px] text-[#eee] overflow-y-hidden">
      <div className="flex">{tickers}</div>
      <Seeker />
    </div>
  );
};

export default TrackPad;
