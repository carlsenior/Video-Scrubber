import { AppContext } from "@/app/page";
import React, { useContext, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

const Seeker = ({
  currentTimeMs,
  tickerWidth,
  seekTo,
}: {
  currentTimeMs: number;
  tickerWidth: number;
  seekTo: (toInSeconds: number) => void;
}) => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({
    x: 0,
  });
  const [distanceX, setDistanceX] = useState(0);
  const { CELLS_COUNT, metaData } = useContext(AppContext);
  const _seekTo = debounce(seekTo, 100);
  const seekerRef = useRef(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons == 1) {
      // only react to left mouse button
      setInitialMousePos({
        x: e.clientX,
      });
      setMouseClicked(true);
    }
  };

  const handleMouseUp = () => {
    setMouseClicked(false);
  };

  const total_canvas_width = tickerWidth * CELLS_COUNT;
  const total_duration = metaData.duration;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSeekerMove = (e: MouseEvent) => {
    if (!mouseClicked || e.buttons != 1) return;
    const deltaX = e.clientX - initialMousePos.x;
    const translateX = getTranslateX(seekerRef);
    let newTranslateX = translateX + deltaX;
    if (newTranslateX < 0) newTranslateX = 0;
    setDistanceX(newTranslateX);
    setInitialMousePos({
      x: e.clientX,
    });
    // TODO
    const seek_to_seconds =
      (newTranslateX / total_canvas_width) * total_duration;
    _seekTo(seek_to_seconds);
  };

  const getTranslateX = (seekerRef: any) => {
    const style = window.getComputedStyle(seekerRef.current);
    const translateX = parseFloat(style.transform.split(",")[4]);
    return translateX;
  };

  // // move seeker to played time
  // if (currentTimeMs > 0) {
  //   let new_distance =
  //     (currentTimeMs / total_duration / 1000) * total_canvas_width;
  //   setDistanceX(new_distance);
  //   setInitialMousePos({
  //     x: new_distance,
  //   });
  // }

  useEffect(() => {
    // add event listeners
    if (mouseClicked) {
      window.addEventListener("mousemove", handleSeekerMove);
    }

    // if (started) {
    //   window.removeEventListener("mousemove", handleSeekerMove);
    // } else {
    //   window.addEventListener("mousemove", handleSeekerMove);
    // }

    return () => {
      window.removeEventListener("mousemove", handleSeekerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSeekerMove, mouseClicked]);

  return (
    <div
      id="seeker"
      ref={seekerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="flex absolute w-[20px] h-full justify-center top-0 z-10 pointer-events-auto cursor-col-resize"
      style={{ transform: `translateX(${distanceX}px)` }}
    >
      <svg
        viewBox="0 0 10 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="track-seeker absolute top-0 h-[20px] mt-[-2px]"
      >
        <path
          d="M1.8 12H8.2C8.64183 12 9 11.6418 9 11.2V6.08964C9 5.90249 8.93439 5.72126 8.81458 5.57749L5 1L1.18542 5.57749C1.06561 5.72126 1 5.90249 1 6.08964V11.2C1 11.6418 1.35817 12 1.8 12Z"
          fill="white"
          stroke="white"
          strokeWidth="0.8"
        ></path>
      </svg>
      <div className="pt-[5px] w-[2px] bg-white"></div>
    </div>
  );
};

export default Seeker;
