import React, { ChangeEvent, useEffect, useRef } from "react";
import "./index.scss";

const RangeInput = ({
  workfile,
  left,
  size,
  rStart,
  rEnd,
  handleUpdateStart,
  handleUpdateEnd,
  handleMoveSeekBar,
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
  handleMoveSeekBar: (e: MouseEvent) => void;
}) => {
  const clipRef = useRef(null);
  const moveSeekBar = (e: MouseEvent) => {
    if (e.target == clipRef.current) {
      handleMoveSeekBar(e);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleUpdateEnd(workfile, e);
  };

  useEffect(() => {
    window.addEventListener("dblclick", moveSeekBar);
    return () => {
      window.removeEventListener("dblclick", moveSeekBar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute top-0"
      style={{ left, height: size.height, width: size.width }}
    >
      <div
        className="absolute rounded clip-box"
        ref={clipRef}
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
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleUpdateStart(workfile, e)
        }
      />
      <input
        type="range"
        value={rEnd}
        min={0}
        max={100}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleUpdateEnd(workfile, e)
        }
      />
    </div>
  );
};

export default RangeInput;
