export function getTickerDurationMs(totalDurationMs: number, divide: number) {
  // miliseconds // 16 divides
  if (totalDurationMs === 0) {
    return 0;
  }
  return Math.ceil(totalDurationMs / divide);
}
