"use client";

import { getThumbnails } from "@/lib/apiHelper";
import { getTimestampsFromFileNames } from "@/lib/generalHelpers";
import React, { useEffect, useRef } from "react";

const ThumbCanvas = ({
  duration,
  tickerWidth,
  tickerDuration,
  url,
  filename,
}: {
  duration: number;
  tickerWidth: number;
  tickerDuration: number;
  url: string;
  filename: undefined | string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = async (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const res = await getThumbnails(filename as string); // thumbnail file names
    const timestamps = getTimestampsFromFileNames(res.result);
    return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    // img.src = url;
  };

  // console.log("drawing", [duration, tickerDuration, tickerWidth, url]);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    try {
      if (duration > 0) {
        draw(canvas, ctx as CanvasRenderingContext2D);
      }
    } catch (e: any) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ThumbCanvas;
