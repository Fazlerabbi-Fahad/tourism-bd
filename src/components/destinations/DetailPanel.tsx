import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import DestinationIcon from "./icons";
import type { Destination } from "../../lib/destinationContent";

const EASE = [0.16, 1, 0.3, 1] as const;
const NARROW_QUERY = "(max-width: 860px)";

export default function DetailPanel({
  destination,
  onClose,
}: {
  destination: Destination | null;
  onClose: () => void;
}) {
  const [isNarrow] = useState(() => window.matchMedia(NARROW_QUERY).matches);
  const prefersReducedMotion = useReducedMotion();

  const offscreen = isNarrow ? { y: "100%" } : { x: "100%" };
  const onscreen = isNarrow ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          key="backdrop"
          className="absolute inset-0 z-10 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }}
          onClick={onClose}
        />
      )}

      {destination && (
        <motion.div
          key="panel"
          role="dialog"
          aria-label={destination.name}
          className="bg-bone text-ink absolute inset-x-0 bottom-0 z-30 max-h-[85vh] w-full overflow-y-auto desk:inset-y-0 desk:right-0 desk:left-auto desk:bottom-auto desk:h-full desk:max-h-none desk:w-[45%]"
          initial={prefersReducedMotion ? { opacity: 0 } : { ...offscreen, opacity: 1 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { ...onscreen, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { ...offscreen, opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.5, ease: EASE }}
        >
          <div className="desk:hidden flex justify-center pt-3">
            <span className="bg-ink/20 h-1 w-10 rounded-full" />
          </div>

          <div className="page-shell relative py-10">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-ink/60 hover:text-ink absolute top-8 right-[max(1.5rem,var(--page-margin))] text-2xl leading-none transition-colors"
            >
              ×
            </button>

            <div className="relative min-h-[18rem]">
              <AnimatePresence>
                <motion.div
                  key={destination.id}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DestinationIcon icon={destination.icon} />

                  <h3 className="text-h1 mt-6" style={{ fontFamily: "var(--font-display)" }}>
                    {destination.name}
                  </h3>
                  <p className="text-small text-ink/55 mt-2 uppercase tracking-[0.16em]">
                    {destination.descriptor}
                  </p>
                  <p className="text-body mt-6 max-w-[42ch]">{destination.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
