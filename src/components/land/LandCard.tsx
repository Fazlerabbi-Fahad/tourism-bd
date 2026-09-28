import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cx } from "../../lib/cx";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLACEMENT = [
  "desk:col-start-1 desk:row-start-1",
  "desk:col-start-2 desk:row-start-2",
  "desk:col-start-3 desk:row-start-1",
  "desk:col-start-4 desk:row-start-2",
];

export default function LandCard({
  index,
  n,
  title,
  body,
  isOpen,
  onToggle,
  onHoverChange,
}: {
  index: number;
  n: string;
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  const plusDeg = isOpen ? 45 : isHovered ? 90 : 0;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange(false);
      }}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: 0.45 + index * 0.18, ease: EASE }}
      className={cx(
        "relative flex min-h-[15rem] cursor-pointer flex-col justify-between p-6 outline-none desk:min-h-0",
        "transition-colors duration-300",
        isOpen ? "bg-bone" : "bg-bone/60 desk:bg-transparent",
        !isOpen && isHovered ? "desk:bg-bone/60" : "",
        PLACEMENT[index]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-small uppercase tracking-[0.16em]">{title}</p>
        <p
          className={cx(
            "font-display transition-colors duration-300",
            isOpen || isHovered ? "text-celadon" : "text-ink"
          )}
          style={{ fontSize: "1.75rem" }}
        >
          {n}
        </p>
      </div>

      <div className="flex flex-1 items-center py-4">
        <p
          className="text-body max-w-[38ch] transition-all duration-500 ease-out"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {body}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="text-h2 inline-block w-max"
        style={{
          transform: `rotate(${plusDeg}deg)`,
          transition: "transform 300ms ease",
        }}
      >
        +
      </span>
    </motion.div>
  );
}
