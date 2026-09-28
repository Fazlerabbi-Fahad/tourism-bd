import { motion, useReducedMotion } from "motion/react";
import LandCards from "../land/LandCards";
import { LAND_SENTENCE } from "../../lib/landContent";

const EASE = [0.16, 1, 0.3, 1] as const;

const fragmentVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="min-h-svh bg-bone-deep"
      style={{
        paddingTop: "clamp(3.5rem, 8vh, 6rem)",
        paddingBottom: "var(--section-pad)",
      }}
    >
      <div className="page-shell">
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
            The <em className="italic">land</em>
          </motion.h2>
        </div>

        <motion.div
          className="grid-12 mt-6"
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {LAND_SENTENCE.map((fragment) => (
            <motion.p
              key={fragment.text}
              variants={prefersReducedMotion ? undefined : fragmentVariants}
              className="text-small uppercase tracking-[0.16em] text-ink/55"
              style={{
                gridColumnStart: fragment.colStart,
                gridColumnEnd: `span ${fragment.colSpan}`,
                textAlign: fragment.align,
              }}
            >
              {fragment.text}
            </motion.p>
          ))}
        </motion.div>

        <LandCards />
      </div>
    </section>
  );
}
