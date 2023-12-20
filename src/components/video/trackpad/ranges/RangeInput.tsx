import React, { FormEvent, FormEventHandler, useEffect } from "react";
import "./index.scss";

const RangeInput = ({
  size,
  rStart,
  rEnd,
  handleUpdateStart,
  handleUpdateEnd,
}: {
  size: {
    width: number;
    height: number;
  };
  rStart: number;
  rEnd: number;
  handleUpdateStart: FormEventHandler<HTMLInputElement>;
  handleUpdateEnd: FormEventHandler<HTMLInputElement>;
}) => {
  useEffect(() => {
    if (size.height == 0) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute left-0 top-0 rounded"
      style={{ height: size.height, width: size.width }}
    >
      <div
        className="absolute rounded clip-box"
        style={{
          width: `calc(${rEnd - rStart}%)`,
          height: `${size.height + 4}px`, // that's why border 2px
          top: "-2px", // that's why border 2px
          left: `${rStart}%`,
        }}
      >
        <span className="clip_box_des"></span>
        <span className="clip_box_des"></span>
      </div>
      <input
        type="range"
        value={rStart}
        min={0}
        max={100}
        onInput={handleUpdateStart}
      />
      <input
        type="range"
        value={rEnd}
        min={0}
        max={100}
        onInput={handleUpdateEnd}
      />
    </div>
  );
};

export default RangeInput;
