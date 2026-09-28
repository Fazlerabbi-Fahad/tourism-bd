import { motion, useReducedMotion } from "motion/react";
import { BANGLADESH_PATH_D, BANGLADESH_VIEWBOX } from "../../lib/bangladeshOutline";
import { DESTINATIONS, DHAKA_ANCHOR } from "../../lib/destinationContent";
import Pin from "./Pin";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MapOutline({
  openId,
  onSelect,
}: {
  openId: string | null;
  onSelect: (id: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto"
      style={{ height: "60vh", aspectRatio: "1222.165 / 1683.897" }}
    >
      <svg
        viewBox={BANGLADESH_VIEWBOX}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <motion.path
          d={BANGLADESH_PATH_D}
          fill="none"
          stroke="var(--celadon)"
          strokeWidth={1.5}
          initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
          whileInView={prefersReducedMotion ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 2, ease: EASE }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 z-20">
        {DESTINATIONS.map((destination, i) => (
          <Pin
            key={destination.id}
            destination={destination}
            index={i}
            isOpen={openId === destination.id}
            onSelect={onSelect}
          />
        ))}

        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${DHAKA_ANCHOR.x}%`, top: `${DHAKA_ANCHOR.y}%` }}
        >
          <span className="bg-ink absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <span
            className="text-small text-ink/70 absolute top-1/2 left-full ml-3 -translate-y-1/2 whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dhaka
          </span>
        </div>
      </div>
    </div>
  );
}
