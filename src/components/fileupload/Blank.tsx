import React from "react";

const Blank = ({
  size,
  isShow,
}: {
  size: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  isShow: boolean;
}) => {
  return (
    <div
      className="bg-[#101010] absolute"
      style={{
        width: size.width,
        height: size.height,
        display: isShow ? "block" : "none",
        left: size.left,
        top: size.top,
      }}
    ></div>
  );
};

export default Blank;
