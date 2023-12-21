import React from "react";

const Blank = ({
  width,
  height,
  isShow,
}: {
  width: number;
  height: number;
  isShow: boolean;
}) => {
  return (
    <div
      className="absoulute bg-white left-0 top-0"
      style={{ width, height, display: isShow ? "block" : "none" }}
    ></div>
  );
};

export default Blank;
