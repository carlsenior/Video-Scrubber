import React, { useEffect, useRef, useState } from "react";

const Seeker = () => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({
    x: 0,
  });
  const [distanceX, setDistanceX] = useState(0);
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
  };

  const getTranslateX = (seekerRef: any) => {
    const style = window.getComputedStyle(seekerRef.current);
    const translateX = parseFloat(style.transform.split(",")[4]);
    return translateX;
  };

  useEffect(() => {
    if (mouseClicked) {
      window.addEventListener("mousemove", handleSeekerMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleSeekerMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleSeekerMove, mouseClicked]);

  return (
    <div
      id="seeker"
      ref={seekerRef}
      onMouseDown={handleMouseDown}
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
