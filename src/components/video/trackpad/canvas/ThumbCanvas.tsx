import { AppContext } from "@/app/page";
import path from "path";
import React, { useContext, useEffect, useRef } from "react";

const ThumbCanvas = ({
  size,
  tickerWidth,
}: {
  size: {
    width: number;
    height: number;
  };
  tickerWidth: number;
}) => {
  const { metaData, TMP_THUMB_FOLDER } = useContext(AppContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvasFromImage = (
    _image_url: string,
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, dx, dy, dWidth, dHeight);
    };
    img.src = _image_url;
  };

  const draw = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    size: any
  ) => {
    const thumbnail_image_names = [
      "0001.png",
      "0002.png",
      "0003.png",
      "0004.png",
      "0005.png",
      "0006.png",
      "0007.png",
      "0008.png",
      "0009.png",
      "0010.png",
      "0011.png",
      "0012.png",
      "0013.png",
      "0014.png",
      "0015.png",
      "0016.png",
    ];
    let canvas_width = size.width;

    thumbnail_image_names.forEach((filename: string, i: number) => {
      const image_url = path.join(
        TMP_THUMB_FOLDER,
        metaData.filename!,
        filename
      );
      drawCanvasFromImage(
        image_url,
        ctx,
        tickerWidth * i,
        0,
        canvas_width > tickerWidth ? tickerWidth : canvas_width,
        size.height
      );
      canvas_width -= tickerWidth;
    });
  };

  useEffect(() => {
    if (size.height == 0) return;
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    draw(canvas, canvas.getContext("2d") as CanvasRenderingContext2D, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width]);

  return (
    <canvas
      className="rounded"
      width={size.width}
      height={size.height}
      ref={canvasRef}
    />
  );
};

export default ThumbCanvas;
