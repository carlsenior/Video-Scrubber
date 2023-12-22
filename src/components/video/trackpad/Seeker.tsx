import { AppContext } from "@/app/page";
import { toTimeString } from "@/lib/generalHelpers";
import React, { useContext, useEffect, useRef, useState } from "react";

const Seeker = ({
  currentTimeMs,
  tickerWidth,
  playing,
  seekTo,
  movePayload,
}: {
  currentTimeMs: number;
  tickerWidth: number;
  playing: boolean;
  seekTo: (toInMs: number) => void;
  movePayload: { move: boolean; distance: number };
}) => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });
  const { CELLS_COUNT, metaData } = useContext(AppContext);

  const seekerRef = useRef(null);
  const timeViewRef = useRef(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons == 1) {
      // only react to left mouse button
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
      setMouseClicked(true);
    }
  };

  const setTimeViewerPos = () => {
    // get the distance between the mouse position and the top of the timeView
    const timerView = timeViewRef.current as unknown as HTMLDivElement;
    const parentElement = timerView.parentElement as HTMLDivElement;
    const seekBarElement = parentElement.parentElement as HTMLDivElement;
    const distanceY = mousePos.y - seekBarElement.getBoundingClientRect().top;
    parentElement.style.marginTop = `${distanceY + 5}px`; // 5px offset Y for beauty
  };

  const handleMouseUp = () => {
    setMouseClicked(false);
  };

  const total_canvas_width = tickerWidth * CELLS_COUNT;
  const total_duration = metaData.duration;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSeekerMove = (e: MouseEvent) => {
    if (!mouseClicked || e.buttons != 1) return;
    const deltaX = e.clientX - mousePos.x;

    const translateX = getTranslateX(seekerRef);
    let newTranslateX = translateX + deltaX;
    if (newTranslateX < 0) newTranslateX = 0;
    if (newTranslateX > total_canvas_width) newTranslateX = total_canvas_width;
    moveSeekBar(newTranslateX);
    const seek_to_Ms =
      (newTranslateX / total_canvas_width) * total_duration * 1000;

    seekTo(seek_to_Ms);
    setTimeViewContent(seek_to_Ms);
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const setTimeViewContent = (timeMS: number) => {
    const timeView = timeViewRef.current as unknown as HTMLDivElement;
    timeView.textContent = toTimeString(timeMS, true, false);
  };

  const moveSeekBar = (distanceX: number) => {
    const seekDiv = seekerRef.current as unknown as HTMLDivElement;
    seekDiv.style.transform = `translateX(${distanceX}px)`;
  };

  const getTranslateX = (seekerRef: any) => {
    const style = window.getComputedStyle(seekerRef.current);
    const translateX = parseFloat(style.transform.split(",")[4]);
    return translateX ? translateX : 0;
  };

  useEffect(() => {
    // register move seekbar request from tickerlist
    if (movePayload.move) {
      const seek_to_Ms =
        (movePayload.distance / total_canvas_width) * total_duration * 1000;
      seekTo(seek_to_Ms);
      moveSeekBar(movePayload.distance);
      movePayload.move = false;
    }
    // add mousemove event listeners
    if (mouseClicked) {
      window.addEventListener("mousemove", handleSeekerMove);
      window.addEventListener("mouseup", handleMouseUp);
      setTimeViewerPos();
    } else {
      // move seeker to played time
      if (playing && currentTimeMs >= 0) {
        let new_distance =
          (currentTimeMs / total_duration / 1000) * total_canvas_width;
        moveSeekBar(new_distance);
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleSeekerMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSeekerMove, currentTimeMs, mouseClicked]);

  return (
    <div
      id="seeker"
      ref={seekerRef}
      onMouseDown={handleMouseDown}
      className="flex absolute w-[20px] h-full justify-center top-0 z-20 cursor-col-resize"
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
      <div className="pt-[5px] w-[2px] bg-white relative">
        {mouseClicked ? (
          <div className="relative">
            <span
              className="absolute bg-white text-[#101010] text-[10px] text-center font-bold p-1 rounded timeviewer"
              ref={timeViewRef}
            >
              00:00:00
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Seeker;
