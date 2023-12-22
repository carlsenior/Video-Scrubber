"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.css";
import Seeker from "./Seeker";
import { AppContext } from "@/app/page";
import TickersList from "./TickersList";
import ThumbCanvasContainer from "./canvas/ThumbCanvasContainer";
import ContextMenu from "@/components/contextmenu/ContextMenu";

const TrackPad = ({
  currentTimeMs,
  seekTo,
  playing,
}: {
  currentTimeMs: number;
  seekTo: (toInMs: number) => void;
  playing: boolean;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { CELLS_COUNT } = useContext(AppContext);

  const [tickerWidth, setTickerWidth] = useState(0);
  const [tickerCounts, setTickerCounts] = useState(CELLS_COUNT * 2); // because intial ticker count is 16

  const [showContext, setShowContext] = useState(false);
  const [contextPos, setContextPos] = useState({
    x: 0,
    y: 0,
  });

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

  const handleShowContext = (e: any) => {
    const _target = e.currentTarget as HTMLElement;
    e.preventDefault();

    setContextPos({
      x: e.clientX - _target.getBoundingClientRect().x,
      y: e.clientY - _target.getBoundingClientRect().y,
    });

    setShowContext(true);
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
      onContextMenu={handleShowContext}
    >
      {showContext && (
        <ContextMenu
          position={contextPos}
          closeMenu={() => setShowContext(false)}
        />
      )}
      <TickersList
        count={tickerCounts}
        tickerWidth={tickerWidth}
        handleMoveSeekBar={setMovePayload}
      />
      <ThumbCanvasContainer
        tickerWidth={tickerWidth}
        handleMoveSeekBar={setMovePayload}
      />
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
