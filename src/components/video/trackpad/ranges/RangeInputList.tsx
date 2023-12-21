import { AppContext } from "@/app/page";
import { getTimeStampsMsFromFileName } from "@/lib/generalHelpers";
import React, { useContext, useState } from "react";
import RangeInput from "./RangeInput";
import { cloneDeep } from "lodash";
import Mask from "./Mask";

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

  const [rStart_rEnd_pairs, setRStart_rEnd_pairs] = useState<
    { rStart: number; rEnd: number }[]
  >(cloneDeep(initial_pairs));

  const duration = metaData.duration;

  // create state variable list for masks
  let initial_mask_pairs = metaData.works.map(
    (work_file_name: string, i: number) => {
      const _timestamps = getTimeStampsMsFromFileName(work_file_name);
      if (i == 0) {
        return {
          mLeft: 0,
          mWidth: (_timestamps[0] / (duration * 1000)) * canvasSize.width,
        };
      } else {
        return {
          mLeft: (_timestamps[0] / (duration * 1000)) * canvasSize.width,
          mWidth:
            ((_timestamps[1] - _timestamps[0]) / (duration * 1000)) *
            canvasSize.width,
        };
      }
    }
  );
  // add one more mask
  const last_work = metaData.works[metaData.works.length - 1];
  const _last_timestamps = getTimeStampsMsFromFileName(last_work);

  initial_mask_pairs.push({
    mLeft: (_last_timestamps[1] / (duration * 1000)) * canvasSize.width,
    mWidth:
      canvasSize.width -
      (_last_timestamps[1] / (duration * 1000)) * canvasSize.width,
  });

  const [mStart_mEnd_pairs, setMStart_mEnd_pairs] = useState<
    { mLeft: number; mWidth: number }[]
  >(cloneDeep(initial_mask_pairs));

  const masks = mStart_mEnd_pairs.map(
    (mask_pair: { mLeft: number; mWidth: number }, i: number) => {
      return (
        <Mask
          key={i}
          left={mask_pair.mLeft}
          width={mask_pair.mWidth}
          height={canvasSize.height}
        />
      );
    }
  );

  const rangelists = metaData.works.map((work_file_name: string, i: number) => {
    const _timeStamps = getTimeStampsMsFromFileName(work_file_name);
    const _left = Math.floor(
      canvasSize.width * (_timeStamps[0] / (duration * 1000))
    );
    const _width = Math.floor(
      (canvasSize.width * (_timeStamps[1] - _timeStamps[0])) / (duration * 1000)
    );

    const handleUpdateStart = function (
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      // handle the update of rStart
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

      // handle the update of mask
      const initial_mask = initial_mask_pairs[i];

      setMStart_mEnd_pairs([
        ...mStart_mEnd_pairs.slice(0, i),
        {
          mLeft: initial_mask.mLeft,
          mWidth:
            initial_mask.mWidth +
            event.target.offsetWidth * (new_pair.rStart / 100),
        },
        ...mStart_mEnd_pairs.slice(i + 1),
      ]);
    };

    const handleUpdateEnd = function (
      event: React.ChangeEvent<HTMLInputElement>
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

      // handle the update of mask
      const initial_mask = initial_mask_pairs[i];

      setMStart_mEnd_pairs([
        ...mStart_mEnd_pairs.slice(0, i + 1),
        {
          mLeft:
            initial_mask.mLeft -
            (1 - new_pair.rEnd / 100) * event.target.offsetWidth,
          mWidth:
            initial_mask.mWidth +
            (1 - new_pair.rEnd / 100) * event.target.offsetWidth,
        },
        ...mStart_mEnd_pairs.slice(i + 2),
      ]);
    };

    return (
      <RangeInput
        key={work_file_name}
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
      {masks}
      {rangelists}
    </div>
  );
};

export default RangeInputList;
