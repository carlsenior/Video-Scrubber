export function getTickerDurationMs(durationSecs: number, divide: number) {
  // miliseconds // 16 divides
  if (durationSecs === 0) {
    return 0;
  }
  return Math.ceil((durationSecs * 1000) / divide);
}

export function getTickerTimestamps(
  durationSec: number,
  divide: number,
  showMiliSeconds = true
) {
  const interval = getTickerDurationMs(durationSec, divide);
  const timestamps = [];
  for (let i = 0; i < divide; i++) {
    timestamps.push(toTimeString(interval * i, showMiliSeconds, false));
  }
  return timestamps;
}

export function toTimeString(
  miliSecond: number,
  showMilliSeconds = false,
  fullFormat = false
) {
  const sec = Math.floor(miliSecond / 1000);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  // add 0 if value < 10; Example: 2 => 02
  let mainString = "";
  if (fullFormat) {
    mainString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    if (hours == 0) {
      if (minutes == 0) {
        mainString = `:${seconds.toString().padStart(2, "0")}`;
      } else {
        mainString = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
    } else {
      mainString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  const remainMS =
    miliSecond - hours * 3600 * 1000 - minutes * 60 * 1000 - seconds * 1000;
  return (
    mainString +
    (showMilliSeconds
      ? remainMS == 0
        ? ".000"
        : `.${remainMS.toString().padStart(3, "0")}`
      : "")
  );
}

// filename is 00000_12345598.mp4 (Ms)
export function getTimeStampsMsFromFileName(filename: string) {
  const _remove_ext_name = filename.replace(/\..+$/g, "");
  return _remove_ext_name.split("_").map((x) => Number(x));
}

// get width in base media
export function getWidthInBaseMedia(
  ms: number,
  canvasWidth: number,
  base_duration: number
) {
  return canvasWidth * (ms / (base_duration * 1000));
}
