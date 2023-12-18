export function getTickerDurationMs(totalDurationMs: number, divide: number) {
  // miliseconds // 16 divides
  if (totalDurationMs === 0) {
    return 0;
  }
  return Math.ceil(totalDurationMs / divide);
}

export function toTimeString(miliSecond: number, showMilliSeconds = false) {
  const sec = Math.floor(miliSecond / 1000);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  // add 0 if value < 10; Example: 2 => 02
  const mainString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const remainMS =
    miliSecond - hours * 3600 * 1000 - minutes * 60 * 1000 - seconds * 1000;
  return (
    mainString +
    (showMilliSeconds
      ? remainMS == 0
        ? ".000"
        : `.${remainMS.toString()}`
      : "")
  );
}

export function getTimestampsFromFileNames(fiienames: string[]) {
  return fiienames.map((filename) => {
    return parseFloat(filename.replace(/\.png$/g, ""));
  });
}
