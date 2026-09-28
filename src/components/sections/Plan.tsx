import { motion, useReducedMotion } from "motion/react";
import { cx } from "../../lib/cx";
import { PLAN_HEADERS, PLAN_ROWS } from "../../lib/planContent";

const EASE = [0.16, 1, 0.3, 1] as const;
const GRID_COLS = "minmax(0,2.2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.4fr)";

function Specimen({ value, label }: { value: string; label?: string }) {
  // Word-based values ("Nov-Feb", "Winter") don't fit the full numeral
  // scale in a ~1fr column without colliding with the next specimen, so
  // they step down to a smaller (but still serif/tabular) size. Short
  // numeric values ("3-4") keep the full text-numeral scale.
  const isWide = value.length > 5;

  return (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
      <span
        className={cx(
          "text-ink transition-colors duration-500 group-hover:text-celadon",
          !isWide && "text-numeral"
        )}
        style={
          isWide
            ? {
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.8vw, 2.75rem)",
                fontVariantNumeric: "tabular-nums",
              }
            : undefined
        }
      >
        {value}
      </span>
      {label && <span className="text-small text-ink/55">{label}</span>}
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <p className="text-small text-ink/55 mb-1 uppercase tracking-[0.16em]">{children}</p>;
}

export default function Plan() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="plan" className="min-h-svh bg-bone-deep">
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
            Plan your route
          </motion.h2>
        </div>

        <div style={{ marginTop: "clamp(3rem, 8vh, 6rem)" }}>
          <div
            className="desk:grid mb-4 hidden"
            style={{ gridTemplateColumns: GRID_COLS, columnGap: "var(--gutter)" }}
          >
            {PLAN_HEADERS.map((label, i) => (
              <p
                key={label}
                className={cx(
                  "text-small text-ink/55 uppercase tracking-[0.16em]",
                  i === PLAN_HEADERS.length - 1 && "text-right"
                )}
              >
                {label}
              </p>
            ))}
          </div>

          <div>
            {PLAN_ROWS.map((row, i) => (
              <motion.div
                key={row.name}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: EASE }}
                className={cx(
                  "group -mx-4 flex min-h-[8.75rem] w-full items-center px-4 transition-colors duration-500 hover:bg-celadon/12",
                  i % 2 === 1 ? "bg-bone/50" : "bg-transparent"
                )}
              >
                {/* Desktop: shared 5-column specimen grid */}
                <div
                  className="desk:grid hidden w-full items-center"
                  style={{ gridTemplateColumns: GRID_COLS, columnGap: "var(--gutter)" }}
                >
                  <p className="text-h2">{row.name}</p>
                  <Specimen value={row.season} />
                  <Specimen value={row.durationValue} label={row.durationLabel} />
                  <p className="text-body">{row.distance}</p>
                  <p className="text-body text-right">{row.highlight}</p>
                </div>

                {/* Narrow: 2-column spec stack with inline labels */}
                <div className="desk:hidden grid w-full grid-cols-2 gap-4">
                  <p className="text-h2 col-span-2">{row.name}</p>
                  <div>
                    <FieldLabel>Best season</FieldLabel>
                    <Specimen value={row.season} />
                  </div>
                  <div>
                    <FieldLabel>Duration</FieldLabel>
                    <Specimen value={row.durationValue} label={row.durationLabel} />
                  </div>
                  <div>
                    <FieldLabel>From Dhaka</FieldLabel>
                    <p className="text-body">{row.distance}</p>
                  </div>
                  <div>
                    <FieldLabel>Highlight</FieldLabel>
                    <p className="text-body">{row.highlight}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
