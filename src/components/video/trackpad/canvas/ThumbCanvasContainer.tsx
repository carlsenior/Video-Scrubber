"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import ThumbCanvas from "./ThumbCanvas";
import { AppContext } from "@/app/page";

const ThumbCanvasContainer = ({ tickerWidth }: { tickerWidth: number }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { metaData } = useContext(AppContext);

  const [size, setSize] = useState({
    width: (tickerWidth + 2) * 16,
    height: 0,
  });

  useEffect(() => {
    const containerDiv = parentRef.current as unknown as HTMLCanvasElement;
    setSize({
      width: (tickerWidth + 2) * 16,
      height: containerDiv.clientHeight,
    });
  }, [tickerWidth]);

  return (
    <div className="ml-[10px] mt-1 sm:mt-3 h-10 relative" ref={parentRef}>
      <ThumbCanvas size={size} tickerWidth={tickerWidth} />
    </div>
  );
};

export default ThumbCanvasContainer;
