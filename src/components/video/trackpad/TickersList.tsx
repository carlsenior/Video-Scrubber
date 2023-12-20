import { AppContext } from "@/app/page";
import { getTickerTimestamps } from "@/lib/generalHelpers";
import { v4 as uuid } from "uuid";
import React, { useContext, useRef } from "react";
import Ticker from "./Ticker";

const TickersList = ({
  count,
  tickerWidth,
  handleMoveSeekBar,
}: {
  count: number;
  tickerWidth: number;
  handleMoveSeekBar: (movePayload: { move: boolean; distance: number }) => void;
}) => {
  const { metaData, CELLS_COUNT } = useContext(AppContext);
  const listRef = useRef(null);

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

  const tickers = getTicketsByCount(count);

  const moveSeekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const distanceX =
      e.clientX -
      (listRef.current as unknown as HTMLDivElement).getBoundingClientRect().x;
    handleMoveSeekBar({ move: true, distance: distanceX });
  };

  return (
    <div className="flex ml-[10px]" onClick={moveSeekBar} ref={listRef}>
      {tickers}
    </div>
  );
};

export default TickersList;
