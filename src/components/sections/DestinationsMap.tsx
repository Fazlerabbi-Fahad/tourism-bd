import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import MapOutline from "../destinations/MapOutline";
import DetailPanel from "../destinations/DetailPanel";
import { DESTINATIONS } from "../../lib/destinationContent";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DestinationsMap() {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const selected = DESTINATIONS.find((d) => d.id === openId) ?? null;

  return (
    <section id="destinations" className="relative min-h-svh overflow-hidden bg-bone-deep">
      <div className="page-shell section-pad">
        <div className="overflow-hidden">
          <motion.h2
            initial={prefersReducedMotion ? undefined : { y: "60%" }}
            whileInView={prefersReducedMotion ? undefined : { y: "0%" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Explore the map
          </motion.h2>
        </div>

        <div className="mt-12">
          <MapOutline openId={openId} onSelect={setOpenId} />
        </div>
      </div>

      <DetailPanel destination={selected} onClose={() => setOpenId(null)} />
    </section>
  );
}
