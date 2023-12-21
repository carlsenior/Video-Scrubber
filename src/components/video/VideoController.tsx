import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import TrackPad from "./trackpad/TrackPad";
import { AppContext } from "@/app/page";
import path from "path";
import Blank from "../fileupload/Blank";

const VideoController = () => {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [blankWidth, setBlankWidth] = useState<number>(0);
  const [blankHeight, setBlankHeight] = useState<number>(0);

  const playerRef = useRef(null);

  const { metaData, TMP_WORKS_FOLDER } = useContext(AppContext);

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

  useEffect(() => {
    const player = playerRef.current as any;
    setBlankWidth(player?.wrapper.childNodes[0].clientWidth);
    setBlankHeight(player?.wrapper.childNodes[0].clientHeight);
  }, []);

  return metaData?.basename ? (
    <div className="w-full py-6 relative">
      <Blank width={blankWidth} height={blankHeight} isShow={false} />
      <ReactPlayer
        ref={playerRef}
        controls
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
