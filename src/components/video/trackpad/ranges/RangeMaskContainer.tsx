import { AppContext } from "@/app/page";
import {
  getTimeStampsMsFromFileName,
  getWidthInBaseMedia,
} from "@/lib/generalHelpers";
import React, { useContext, useMemo, useState } from "react";
import RangeInput from "./RangeInput";
// import { cloneDeep } from "lodash";
import Mask from "./Mask";

const RangeMaskContainer = ({
  canvasSize,
  handleMoveSeekBar,
}: {
  canvasSize: {
    width: number;
    height: number;
  };
  handleMoveSeekBar: (movePayload: { move: boolean; distance: number }) => void;
}) => {
  const { metaData, setMetaData } = useContext(AppContext);
  // total duration of media
  const duration = metaData.duration;

  const getWidthInBase = (positionMs: number) => {
    return getWidthInBaseMedia(positionMs, canvasSize.width, duration);
  };

  const initial_range_pairs = metaData.works.map(
    (work_file_name: string, i: number) => {
      return {
        rStart: 0,
        rEnd: 100,
      };
    }
  );

  const [rStart_rEnd_pairs, setRStart_rEnd_pairs] =
    useState<{ rStart: number; rEnd: number }[]>(initial_range_pairs);

  // // we create initial n+1 masks
  // let _initial_mask_pairs: {
  //   mLeft: number;
  //   mWidth: number;
  // }[] = metaData.works.map((work_file_name: string, i: number) => {
  //   return {
  //     mLeft: 0,
  //     mWidth: 0,
  //   };
  // });

  // _initial_mask_pairs.push({
  //   mLeft: 0,
  //   mWidth: 0,
  // });

  // const [mStart_mEnd_pairs, setMStart_mEnd_pairs] =
  //   useState<{ mLeft: number; mWidth: number }[]>(_initial_mask_pairs);

  // const maskList = mStart_mEnd_pairs.map(
  //   (mask_pair: { mLeft: number; mWidth: number }, i: number) => {
  //     return (
  //       <Mask
  //         key={i}
  //         left={mask_pair.mLeft}
  //         width={mask_pair.mWidth}
  //         height={canvasSize.height}
  //       />
  //     );
  //   }
  // );

  const handleUpdateStart = function (
    workfile: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const _index = metaData.works.indexOf(workfile);

    // const rStart = Number(event.currentTarget.value);
    // const _timestamps = getTimeStampsMsFromFileName(workfile);
    // const _subDurationMs = _timestamps[1] - _timestamps[0];
    // const startMs = Math.floor(
    //   _timestamps[0] + (rStart / 100) * _subDurationMs
    // );
    // const endMs = _timestamps[1];
    // const res = await getTrimedMedia(
    //   metaData.basename,
    //   workfile,
    //   startMs,
    //   endMs
    // );
    // setMetaData(
    //   Object.assign({}, metaData, {
    //     works: [
    //       ...metaData.works.slice(0, _index),
    //       res.new_work_file,
    //       ...metaData.works.slice(_index + 1),
    //     ],
    //   })
    // );
    // handle the update of rStart
    const original_pair = rStart_rEnd_pairs[_index];
    const new_pair = {
      rStart: Number(event.currentTarget.value),
      rEnd: original_pair.rEnd,
    };
    setRStart_rEnd_pairs([
      ...rStart_rEnd_pairs.slice(0, _index),
      new_pair,
      ...rStart_rEnd_pairs.slice(_index + 1),
    ]);

    // handle move seekbar
    const _timestamps = getTimeStampsMsFromFileName(workfile);
    const _amount_of_changes =
      event.currentTarget.getBoundingClientRect().width *
      (new_pair.rStart / 100);
    handleMoveSeekBar({
      move: true,
      distance: _amount_of_changes + getWidthInBase(_timestamps[0]),
    });

    // // handle the update of mask
    // const mask_data = mStart_mEnd_pairs[index];
    // setMStart_mEnd_pairs([
    //   ...mStart_mEnd_pairs.slice(0, index),
    //   {
    //     mLeft: mask_data.mLeft,
    //     mWidth:
    //       mask_data.mWidth + event.target.offsetWidth * (new_pair.rStart / 100),
    //   },
    //   ...mStart_mEnd_pairs.slice(index + 1),
    // ]);
  };

  const handleUpdateEnd = function (
    workfile: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const _index = metaData.works.indexOf(workfile);
    const original_pair = rStart_rEnd_pairs[_index];
    const new_pair = {
      rStart: original_pair.rStart,
      rEnd: Number(event.currentTarget.value),
    };
    setRStart_rEnd_pairs([
      ...rStart_rEnd_pairs.slice(0, _index),
      new_pair,
      ...rStart_rEnd_pairs.slice(_index + 1),
    ]);

    // handle move seekbar
    const _timestamps = getTimeStampsMsFromFileName(workfile);
    const _amount_of_changes =
      event.currentTarget.getBoundingClientRect().width *
      (1 - new_pair.rEnd / 100);
    handleMoveSeekBar({
      move: true,
      distance: getWidthInBase(_timestamps[1]) - _amount_of_changes,
    });

    // // handle the update of mask
    // const mask_data = mStart_mEnd_pairs[index + 1];
    // setMStart_mEnd_pairs([
    //   ...mStart_mEnd_pairs.slice(0, index + 1),
    //   {
    //     mLeft:
    //       mask_data.mLeft -
    //       (1 - new_pair.rEnd / 100) * event.target.offsetWidth,
    //     mWidth:
    //       mask_data.mWidth +
    //       (1 - new_pair.rEnd / 100) * event.target.offsetWidth,
    //   },
    //   ...mStart_mEnd_pairs.slice(index + 2),
    // ]);
  };

  // mask list data
  // let _previous_timestamps = null;
  // let maskListDatas: {
  //   mLeft: number;
  //   mWidth: number;
  // }[] = [];

  // for (let index = 0; index <= metaData.works.length; index++) {
  //   const work_file_name = metaData.works[index];
  //   const _timestamps = getTimeStampsMsFromFileName(work_file_name);
  //   if (index == 0) {
  //     maskListDatas.push({
  //       mLeft: 0,
  //       mWidth: Math.floor(
  //         canvasSize.width * (_timestamps[0] / (duration * 1000))
  //       ),
  //     });
  //     _previous_timestamps = _timestamps;
  //   }
  // }

  // const maskListDatas = metaData.works.map(
  //   (work_file_name: string, i: number) => {
  //     const _timeStamps = getTimeStampsMsFromFileName(work_file_name);
  //     let _maskData = null;
  //     if (i == 0) {
  //       _maskData = {
  //         mLeft: 0,
  //         mWidth: Math.floor(
  //           canvasSize.width * (_timeStamps[0] / (duration * 1000))
  //         ),
  //       };
  //       _previous_timestamps = _timeStamps;
  //       return _maskData;
  //     } else {
  //       _maskData = {
  //         mLeft: Math.floor(
  //           canvasSize.width * (_previous_timestamps![1] / (duration * 1000))
  //         ),
  //         mWidth: Math.floor(
  //           (canvasSize.width * (_timeStamps[0] - _previous_timestamps![1])) /
  //             (duration * 1000)
  //         ),
  //       };
  //       _previous_timestamps = _timeStamps;
  //       return _maskData;
  //     }
  //   }
  // );
  // // add one more mask for end

  // maskListDatas.push({
  //   mLeft: Math.floor(
  //     canvasSize.width * (_previous_timestamps![1] / (duration * 1000))
  //   ),
  //   mWidth: Math.floor(
  //     canvasSize.width -
  //       canvasSize.width * (_previous_timestamps![1] / (duration * 1000))
  //   ),
  // });

  const rangeMaskComponentList = useMemo(() => {
    // track previous stamp
    let _previous_stamps_track: number[] = [];

    const inputList = metaData.works.map(
      (work_file_name: string, i: number) => {
        const _timeStamps = getTimeStampsMsFromFileName(work_file_name);
        const _left = Math.floor(
          canvasSize.width * (_timeStamps[0] / (duration * 1000))
        );
        const _width = Math.floor(
          (canvasSize.width * (_timeStamps[1] - _timeStamps[0])) /
            (duration * 1000)
        );

        const leftMask = (
          <Mask
            key={`mask-${i}`}
            index={i}
            previous={i == 0 ? [] : _previous_stamps_track}
            current={_timeStamps}
            rStart={rStart_rEnd_pairs[i].rStart}
            rEnd={i == 0 ? 100 : rStart_rEnd_pairs[i - 1].rEnd}
            canvasWidth={canvasSize.width}
            height={canvasSize.height}
          />
        );
        _previous_stamps_track = _timeStamps;

        return (
          <div key={`div-mask-input-${i}`}>
            {leftMask}
            <RangeInput
              key={`range-${i}`}
              workfile={work_file_name}
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
          </div>
        );
      }
    );

    const final_right_mask = (
      <Mask
        key={`mask-${inputList.length}`}
        index={inputList.length}
        height={canvasSize.height}
        previous={_previous_stamps_track}
        current={[]}
        rStart={0}
        rEnd={rStart_rEnd_pairs[inputList.length - 1].rEnd}
        canvasWidth={canvasSize.width}
      />
    );

    return [...inputList, final_right_mask];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasSize.height,
    canvasSize.width,
    duration,
    metaData.works,
    rStart_rEnd_pairs,
  ]);

  return (
    <div
      className="absolute left-0 top-0"
      style={{ width: canvasSize.width, height: canvasSize.height }}
    >
      {rangeMaskComponentList}
    </div>
  );
};

export default RangeMaskContainer;
