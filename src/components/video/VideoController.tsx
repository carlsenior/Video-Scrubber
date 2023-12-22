import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import TrackPad from "./trackpad/TrackPad";
import { AppContext } from "@/app/page";
import path from "path";
import Blank from "../fileupload/Blank";
import Fraction from "fraction.js";

const VideoController = () => {
  const { metaData, TMP_WORKS_FOLDER, workStatus, setWorkStatus } =
    useContext(AppContext);

  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);

  const [blankSize, setBlankSize] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  }>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [showBlank, setShowBlank] = useState<boolean>(false);

  const playerRef = useRef(null);

  const handleProgress = (progress: any) => {
    const currentTimeMs = progress.playedSeconds * 1000;
    setCurrentTimeMs(currentTimeMs);

    // determin work status looking at the seekbar, offset 10 ms for UI
    if (
      currentTimeMs < Math.floor(workStatus.startMs) - 10 ||
      currentTimeMs > Math.ceil(workStatus.endMs) + 10
    ) {
      setShowBlank(true);
    } else {
      setShowBlank(false);
    }
  };

  const seekTo = (toInMs: number) => {
    const player = playerRef.current as unknown as ReactPlayer;
    player.seekTo(Math.round(toInMs) / 1000, "seconds");
  };

  useEffect(() => {
    const player = playerRef.current as any;

    setBlankSize({
      width: player?.wrapper.childNodes[0].clientWidth,
      height: player?.wrapper.childNodes[0].clientHeight,
      left: player?.wrapper.childNodes[0].offsetLeft,
      top: player?.wrapper.childNodes[0].offsetTop,
    });
  }, [showBlank]);

  return metaData?.basename ? (
    <div className="w-full py-6 relative">
      <Blank size={blankSize} isShow={showBlank} />
      <ReactPlayer
        ref={playerRef}
        controls={!showBlank}
        progressInterval={200}
        url={path.join(TMP_WORKS_FOLDER, metaData.basename, metaData.works[0])}
        width="100%"
        onProgress={handleProgress}
        onStart={() => {
          setPlaying(true);
        }}
        onPlay={() => {
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);
        }}
      />
      <TrackPad
        currentTimeMs={currentTimeMs}
        seekTo={seekTo}
        playing={playing}
      />
    </div>
  ) : null;
};

export default VideoController;
