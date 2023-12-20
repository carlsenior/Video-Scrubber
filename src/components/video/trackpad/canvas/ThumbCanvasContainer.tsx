"use client";

import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ThumbCanvas from "./ThumbCanvas";
import { AppContext } from "@/app/page";
import RangeInput from "../ranges/RangeInput";

const ThumbCanvasContainer = ({ tickerWidth }: { tickerWidth: number }) => {
  // states for canvas
  const parentRef = useRef<HTMLDivElement>(null);
  const { CELLS_COUNT } = useContext(AppContext);
  const [size, setSize] = useState({
    width: tickerWidth * CELLS_COUNT, // cell size is tickerWidth + 2px for border
    height: 0,
  });

  // states for range input
  const [rStart, setRStart] = useState(0);
  const [rEnd, setREnd] = useState(100);

  const handleUpdateRange = (func: (value: number) => void) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      func(e.target.value as unknown as number);
    };
  };

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
      <RangeInput
        size={size}
        rStart={rStart}
        rEnd={rEnd}
        handleUpdateStart={handleUpdateRange(setRStart)}
        handleUpdateEnd={handleUpdateRange(setREnd)}
      />
    </div>
  );
};

export default ThumbCanvasContainer;
