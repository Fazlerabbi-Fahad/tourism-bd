export const HERO_FRAME_COUNT = 298;

export function heroFrameSrc(oneIndexed: number): string {
  return `/hero/frames/scrub/frame_${String(oneIndexed).padStart(3, "0")}.jpg`;
}

export const HERO_FIRST_FRAME_SRC = heroFrameSrc(1);
