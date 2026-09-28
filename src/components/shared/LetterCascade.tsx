import { AnimatePresence, motion } from "motion/react";

const DEFAULT_ENTER_EASE = [0.16, 1, 0.3, 1] as const;

export type CascadeTiming = {
  duration: number;
  ease: number[] | string;
  stagger: number;
  delayChildren?: number;
};

export const SEASON_CASCADE_ENTER: CascadeTiming = {
  duration: 0.7,
  ease: DEFAULT_ENTER_EASE as unknown as number[],
  stagger: 0.03,
  delayChildren: 0.06,
};

export const SEASON_CASCADE_EXIT: CascadeTiming = {
  duration: 0.4,
  ease: "easeIn",
  stagger: 0.016,
};

export default function LetterCascade({
  text,
  show = true,
  enter = SEASON_CASCADE_ENTER,
  exit = SEASON_CASCADE_EXIT,
  className = "relative h-[1em]",
}: {
  text: string;
  show?: boolean;
  enter?: CascadeTiming;
  exit?: CascadeTiming;
  className?: string;
}) {
  const letters = text.split("");

  return (
    <div className={className} style={{ whiteSpace: "nowrap" }}>
      {/* Invisible in-flow spacer: establishes real width for ancestors that
          shrink-to-fit (e.g. absolutely positioned with only `left` set).
          The animated letters below are purely absolute and contribute no
          intrinsic size, so without this the whole chain can collapse to 0. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <AnimatePresence initial={false}>
        {show && (
          <motion.div key={text} className="absolute inset-0 flex justify-center">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "0.85em", opacity: 0, filter: "blur(10px)" }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: enter.duration,
                    ease: enter.ease,
                    delay: (enter.delayChildren ?? 0) + i * enter.stagger,
                  },
                }}
                exit={{
                  y: "-0.55em",
                  opacity: 0,
                  filter: "blur(8px)",
                  transition: { duration: exit.duration, ease: exit.ease, delay: i * exit.stagger },
                }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
