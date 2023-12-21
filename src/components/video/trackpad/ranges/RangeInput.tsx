import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
} from "react";
import "./index.scss";
import { props } from "bluebird";

const RangeInput = ({
  workfile,
  left,
  size,
  rStart,
  rEnd,
  handleUpdateStart,
  handleUpdateEnd,
}: {
  workfile: string;
  left: number;
  size: {
    width: number;
    height: number;
  };
  rStart: number;
  rEnd: number;
  handleUpdateStart: (
    arg0: string,
    arg1: ChangeEvent<HTMLInputElement>
  ) => void;
  handleUpdateEnd: (arg0: string, arg1: ChangeEvent<HTMLInputElement>) => void;
}) => {
  useEffect(() => {
    if (size.height == 0) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute top-0"
      style={{ left, height: size.height, width: size.width }}
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
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          handleUpdateStart(workfile, e)
        }
      />
      <input
        type="range"
        value={rEnd}
        min={0}
        max={100}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          handleUpdateEnd(workfile, e)
        }
      />
    </div>
  );
};

export default RangeInput;
