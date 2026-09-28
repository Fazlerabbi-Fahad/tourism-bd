import { useEffect } from "react";
import { animate, useMotionValue } from "motion/react";

const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;

/** A 0→1 motion value that animates in once on mount, after `delay` seconds. */
export function useEntranceValue(delay: number) {
  const value = useMotionValue(0);

  useEffect(() => {
    const controls = animate(value, 1, {
      duration: 0.6,
      delay,
      ease: ENTRANCE_EASE,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  return value;
}
