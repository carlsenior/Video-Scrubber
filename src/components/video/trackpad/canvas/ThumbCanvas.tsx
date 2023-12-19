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
  const duration = metaData.duration;
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
        (tickerWidth + 2) * i, // left border width = 2
        0,
        canvas_width > tickerWidth + 2 ? tickerWidth + 2 : canvas_width,
        size.height
      );
      canvas_width -= tickerWidth + 2;
    });

    // let total_duration = duration * 1000; // miliseconds
    // console.log(total_duration, tickerDuration);
    // res.filenames.forEach((filename: string, i: number) => {
    //   const remaining_duration = total_duration - tickerDuration * i;
    //   drawCanvasFromImage(
    //     filename,
    //     canvas,
    //     (tickerWidth + 2) * i, // left border width = 2
    //     0,
    //     (tickerWidth + 2) *
    //       (remaining_duration / tickerDuration >= 1
    //         ? 1
    //         : remaining_duration / tickerDuration),
    //     canvas.height
    //   );
    // });
  };

  useEffect(() => {
    if (size.height == 0) return;
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    draw(canvas, canvas.getContext("2d") as CanvasRenderingContext2D, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width]);

  return <canvas width={size.width} height={size.height} ref={canvasRef} />;
};

export default ThumbCanvas;
