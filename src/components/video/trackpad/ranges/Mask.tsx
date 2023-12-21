import React from "react";

const Mask = ({
  left,
  width,
  height,
}: {
  left: number;
  width: number;
  height: number;
}) => {
  return (
    <div
      className="bg-[#303030] absolute top-[-2px] rounded"
      style={{ left, width, height: height + 4 }} // that's why border 2px
    ></div>
  );
};

export default Mask;
