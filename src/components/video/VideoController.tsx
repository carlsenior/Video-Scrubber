import React, { useContext, useRef, useState } from "react";
import ReactPlayer from "react-player";
import TrackPad from "./trackpad/TrackPad";
import { AppContext } from "@/app/page";
import path from "path";

const VideoController = () => {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const playerRef = useRef(null);

  const { metaData, TMP_VIDEO_FOLDER } = useContext(AppContext);

  const handleProgress = (progress: any) => {
    setCurrentTimeMs(progress.playedSeconds * 1000);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newTimeMs = parseFloat(e.target.value);
    // setCurrentTimeMs(newTimeMs);
    // const newTimeSeconds = newTimeMs / 1000; // Convert back to seconds for seeking
    // const player = playerRef.current as unknown as ReactPlayer;
    // player.seekTo(newTimeSeconds);
  };

  const seekTo = (toInSeconds: number) => {
    const player = playerRef.current as unknown as ReactPlayer;
    player.seekTo(toInSeconds);
  };

  return metaData?.filename ? (
    <div className="w-full">
      <ReactPlayer
        ref={playerRef}
        controls
        progressInterval={200}
        url={path.join(TMP_VIDEO_FOLDER, metaData.filename)}
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
