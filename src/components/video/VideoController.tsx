import React, { useContext, useRef, useState } from "react";
import ReactPlayer from "react-player";
import TrackPad from "./trackpad/TrackPad";
import { AppContext } from "@/app/page";
import path from "path";

const VideoController = () => {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const playerRef = useRef(null);

  const { metaData, TMP_VIDEO_FOLDER } = useContext(AppContext);

  const handleProgress = (progress: any) => {
    setCurrentTimeMs(progress.playedSeconds * 1000);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeMs = parseFloat(e.target.value);
    setCurrentTimeMs(newTimeMs);
    const newTimeSeconds = newTimeMs / 1000; // Convert back to seconds for seeking
    const player = playerRef.current as unknown as ReactPlayer;
    player.seekTo(newTimeSeconds);
  };

  return metaData?.filename ? (
    <div className="w-full">
      <ReactPlayer
        ref={playerRef}
        controls
        url={path.join(TMP_VIDEO_FOLDER, metaData.filename)}
        width="100%"
        // onProgress={handleProgress}
      />
      <TrackPad />
    </div>
  ) : null;
};

export default VideoController;
