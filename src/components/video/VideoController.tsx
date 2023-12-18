import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import TrackPad from "./trackpad/TrackPad";

const VideoController = ({
  url,
  filename,
}: {
  url: undefined | string;
  filename: undefined | string;
}) => {
  const [durationMs, setDurationMs] = useState<number>(0);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const playerRef = useRef(null);

  const handleDurationMs = (durationInSeconds: number) => {
    setDurationMs(durationInSeconds * 1000);
  };

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

  return url ? (
    <div className="w-full">
      <ReactPlayer
        ref={playerRef}
        controls
        url={url}
        width="100%"
        onDuration={handleDurationMs}
        onProgress={handleProgress}
      />
      <TrackPad duration={durationMs} url={url} filename={filename} />
    </div>
  ) : null;
};

export default VideoController;
