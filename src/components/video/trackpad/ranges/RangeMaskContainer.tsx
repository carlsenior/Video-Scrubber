import { AppContext } from "@/app/page";
import {
  getTimeStampsMsFromFileName,
  getWidthInBaseMedia,
} from "@/lib/generalHelpers";
import React, { useContext, useMemo, useRef, useState } from "react";
import RangeInput from "./RangeInput";
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
  const { metaData, setWorkStatus } = useContext(AppContext);

  const containerRef = useRef(null);
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

  const handleUpdateStart = function (
    workfile: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const _index = metaData.works.indexOf(workfile);

    // handle the update of rStart
    const original_pair = rStart_rEnd_pairs[_index];
    const new_pair = {
      rStart: Number(event.currentTarget.value),
      rEnd: original_pair.rEnd,
    };

    // prevent out of rEnd
    if (new_pair.rStart > new_pair.rEnd - 3) {
      return;
    }

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

    // update working status
    setWorkStatus({
      workfile,
      mask: -1,
      startMs:
        _timestamps[0] +
        (_timestamps[1] - _timestamps[0]) * (new_pair.rStart / 100),
      endMs:
        _timestamps[1] -
        (1 - new_pair.rEnd / 100) * (_timestamps[1] - _timestamps[0]),
    });
  };

  const handleMoveSeekBarInInputRange = (e: MouseEvent) => {
    const _distance =
      e.clientX -
      (
        containerRef.current as unknown as HTMLDivElement
      ).getBoundingClientRect().x;

    handleMoveSeekBar({ move: true, distance: _distance });
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

    // prevent out of rStart
    if (new_pair.rEnd < new_pair.rStart + 3) {
      return;
    }

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

    // update working status
    setWorkStatus({
      workfile,
      mask: -1,
      startMs:
        _timestamps[0] +
        ((_timestamps[1] - _timestamps[0]) * new_pair.rStart) / 100,
      endMs:
        _timestamps[1] -
        (1 - new_pair.rEnd / 100) * (_timestamps[1] - _timestamps[0]),
    });
  };

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
              handleMoveSeekBar={handleMoveSeekBarInInputRange}
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
      ref={containerRef}
      style={{ width: canvasSize.width, height: canvasSize.height }}
    >
      {rangeMaskComponentList}
    </div>
  );
};

export default RangeMaskContainer;
