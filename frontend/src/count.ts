export function easeOutCubic(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return 1 - Math.pow(1 - clamped, 3);
}

export function countValue(from: number, to: number, progress: number): number {
  return Math.round(from + (to - from) * easeOutCubic(progress));
}
