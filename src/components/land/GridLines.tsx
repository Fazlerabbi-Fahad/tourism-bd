import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const HORIZONTALS = [
  { y: 0, delay: 0 },
  { y: 50, delay: 0.15 },
  { y: 100, delay: 0.3 },
];

const VERTICALS = [
  { x: 0, delay: 0.35 },
  { x: 25, delay: 0.55 },
  { x: 50, delay: 0.75 },
  { x: 75, delay: 0.95 },
  { x: 100, delay: 1.15 },
];

const CELLS = [0, 1, 2, 3].map((i) => ({ col: i, row: i % 2 }));

export default function GridLines({ hoveredIndex }: { hoveredIndex: number | null }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full desk:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--ink)"
        strokeOpacity={0.4}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        fill="none"
      >
        {HORIZONTALS.map(({ y, delay }) =>
          prefersReducedMotion ? (
            <line key={`h-${y}`} x1={0} y1={y} x2={100} y2={y} />
          ) : (
            <motion.line
              key={`h-${y}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.8, delay, ease: EASE }}
            />
          )
        )}
        {VERTICALS.map(({ x, delay }) =>
          prefersReducedMotion ? (
            <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={100} />
          ) : (
            <motion.line
              key={`v-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, delay, ease: EASE }}
            />
          )
        )}
      </g>

      {CELLS.map(({ col, row }, i) => {
        const x = col * 25;
        const y = row * 50;
        const active = hoveredIndex === i;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <rect
              x={x}
              y={y}
              width={25}
              height={50}
              fill="none"
              stroke="var(--bone-deep)"
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={x}
              y={y}
              width={25}
              height={50}
              fill="none"
              stroke="var(--celadon)"
              strokeOpacity={0.8}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              pathLength={100}
              strokeDasharray="20 30"
              style={{ animation: "trace-circulate 3.2s linear infinite" }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}
