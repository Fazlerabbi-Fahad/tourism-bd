import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cx } from "../../lib/cx";
import type { Destination } from "../../lib/destinationContent";

const EASE = [0.16, 1, 0.3, 1] as const;

const LABEL_POSITION: Record<
  Destination["labelSide"],
  { className: string; initial: { x?: number; y?: number } }
> = {
  left: { className: "right-full top-1/2 -translate-y-1/2 mr-3 text-right", initial: { x: 6 } },
  right: { className: "left-full top-1/2 -translate-y-1/2 ml-3", initial: { x: -6 } },
  top: { className: "bottom-full left-1/2 -translate-x-1/2 mb-3 text-center", initial: { y: 6 } },
  bottom: { className: "top-full left-1/2 -translate-x-1/2 mt-3 text-center", initial: { y: -6 } },
};

export default function Pin({
  destination,
  index,
  isOpen,
  onSelect,
}: {
  destination: Destination;
  index: number;
  isOpen: boolean;
  onSelect: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const active = isHovered || isOpen;
  const label = LABEL_POSITION[destination.labelSide];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(destination.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={destination.name}
      className="pointer-events-auto absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ left: `${destination.x}%`, top: `${destination.y}%` }}
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.5 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, delay: 2 + index * 0.08, ease: EASE }}
    >
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          className="border-celadon absolute h-2 w-2 rounded-full border"
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
        />
      )}

      <motion.span
        aria-hidden="true"
        className={cx(
          "bg-celadon rounded-full transition-[width,height] duration-200",
          active ? "h-3.5 w-3.5" : "h-2 w-2"
        )}
        animate={
          prefersReducedMotion || active
            ? { scale: 1 }
            : { scale: [1, 1.15, 1] }
        }
        transition={
          prefersReducedMotion || active
            ? undefined
            : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }
        }
      />

      <motion.span
        className={cx("text-small pointer-events-none absolute w-max whitespace-nowrap", label.className)}
        style={{ fontFamily: "var(--font-display)" }}
        initial={{ opacity: 0, ...label.initial }}
        animate={active ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...label.initial }}
        transition={{ duration: 0.25 }}
      >
        {destination.name}
      </motion.span>
    </motion.button>
  );
}
