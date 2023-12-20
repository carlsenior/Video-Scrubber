import { AppContext } from "@/app/page";
import { getTimeStampsMsFromFileName } from "@/lib/generalHelpers";
import React, { useContext, useState } from "react";
import RangeInput from "./RangeInput";

const RangeInputList = ({
  canvasSize,
}: {
  canvasSize: {
    width: number;
    height: number;
  };
}) => {
  const { metaData, TMP_WORKS_FOLDER } = useContext(AppContext);

  const initial_pairs = metaData.works.map((work_file_name: string) => {
    return {
      rStart: 0,
      rEnd: 100,
    };
  });

  const [rStart_rEnd_pairs, setRStart_rEnd_pairs] =
    useState<{ rStart: number; rEnd: number }[]>(initial_pairs);

  const duration = metaData.duration;

  const rangelists = metaData.works.map((work_file_name: string, i: number) => {
    const _timeStamps = getTimeStampsMsFromFileName(work_file_name);
    const _left = Math.floor(
      canvasSize.width * (_timeStamps[0] / (duration * 1000))
    );
    const _width = Math.floor(
      (canvasSize.width * (_timeStamps[1] - _timeStamps[0])) / (duration * 1000)
    );

    const handleUpdateStart = function (
      event: React.FormEvent<HTMLInputElement>
    ) {
      const original_pair = rStart_rEnd_pairs[i];
      const new_pair = {
        rStart: Number(event.currentTarget.value),
        rEnd: original_pair.rEnd,
      };
      setRStart_rEnd_pairs([
        ...rStart_rEnd_pairs.slice(0, i),
        new_pair,
        ...rStart_rEnd_pairs.slice(i + 1),
      ]);
    };

    const handleUpdateEnd = function (
      event: React.FormEvent<HTMLInputElement>
    ) {
      const original_pair = rStart_rEnd_pairs[i];
      const new_pair = {
        rStart: original_pair.rStart,
        rEnd: Number(event.currentTarget.value),
      };
      setRStart_rEnd_pairs([
        ...rStart_rEnd_pairs.slice(0, i),
        new_pair,
        ...rStart_rEnd_pairs.slice(i + 1),
      ]);
    };

    return (
      <RangeInput
        key={i}
        left={_left}
        size={{
          width: _width,
          height: canvasSize.height,
        }}
        rStart={rStart_rEnd_pairs[i].rStart}
        rEnd={rStart_rEnd_pairs[i].rEnd}
        handleUpdateStart={handleUpdateStart}
        handleUpdateEnd={handleUpdateEnd}
      />
    );
  });

  return (
    <div
      className="absolute left-0 top-0"
      style={{ width: canvasSize.width, height: canvasSize.height }}
    >
      {rangelists}
    </div>
  );
};

export default RangeInputList;
