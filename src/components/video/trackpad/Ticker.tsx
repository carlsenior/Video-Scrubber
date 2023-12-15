import React from "react";

const getTimeString = (timeMs: number) => {
  const time = timeMs / 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Ticker = ({ subDuration }: { subDuration: number }) => {
  return (
    <div className="flex flex-grow text-[10px] h-[20px] border-[#303030] border-solid border-l-2 track-ticker">
      <span>{getTimeString(subDuration)}</span>
    </div>
  );
};

export default Ticker;
