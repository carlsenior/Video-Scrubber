import React from "react";

const Ticker = ({
  tickerLabel,
  width,
}: {
  tickerLabel: string;
  width: number;
}) => {
  return (
    <div className="flex text-[10px] h-[20px] border-[#303030] border-solid border-l-2 track-ticker">
      <span style={{ width: `${width - 2}px` }}>{tickerLabel}</span>
    </div>
  );
};

export default Ticker;
