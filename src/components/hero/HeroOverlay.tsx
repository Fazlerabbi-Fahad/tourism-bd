import type { MotionValue } from "motion/react";
import { motion, useMotionTemplate, useTransform } from "motion/react";
import { useEntranceValue } from "../../hooks/useEntranceValue";
import { HERO_CARDS, HERO_PARAGRAPH } from "../../lib/heroContent";

const CARD_EXIT_WINDOWS: Array<[number, number]> = [
  [0.02, 0.1],
  [0.06, 0.14],
  [0.1, 0.18],
];

const PARAGRAPH_EXIT_WINDOW: [number, number] = [0.04, 0.16];
const WORDMARK_EXIT_WINDOW: [number, number] = [0.04, 0.2];

function NoteCard({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const card = HERO_CARDS[index];
  const entrance = useEntranceValue(0.15 + index * 0.12);
  const entranceY = useTransform(entrance, [0, 1], [12, 0]);
  const entranceOpacity = useTransform(entrance, [0, 1], [0, 1]);

  const [winStart, winEnd] = CARD_EXIT_WINDOWS[index];
  const exitX = useTransform(progress, [winStart, winEnd], ["0vw", "-45vw"]);
  const exitOpacity = useTransform(progress, [winStart, winEnd], [1, 0]);

  const opacity = useTransform(
    [entranceOpacity, exitOpacity],
    ([e, x]: number[]) => e * x
  );
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));

  return (
    <motion.div
      style={{ y: entranceY, x: exitX, opacity, visibility }}
      className="w-[15.5rem] bg-bone-deep/85 p-5"
    >
      <p className="text-h2" style={{ fontSize: "1.375rem" }}>
        {card.region}
      </p>
      <p className="text-body mt-1">{card.place}</p>
      <p className="text-small mt-1 text-ink/55">{card.note}</p>
    </motion.div>
  );
}

function NoteCards({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      className="pointer-events-none absolute flex flex-col gap-4"
      style={{ top: "clamp(2rem, 6vh, 4.5rem)", left: "var(--page-margin)" }}
    >
      {HERO_CARDS.map((_, i) => (
        <NoteCard key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

function PlanCluster({ progress }: { progress: MotionValue<number> }) {
  const entrance = useEntranceValue(0.3);
  const entranceY = useTransform(entrance, [0, 1], [12, 0]);
  const entranceOpacity = useTransform(entrance, [0, 1], [0, 1]);

  const [winStart, winEnd] = PARAGRAPH_EXIT_WINDOW;
  const exitX = useTransform(progress, [winStart, winEnd], ["0vw", "45vw"]);
  const exitOpacity = useTransform(progress, [winStart, winEnd], [1, 0]);

  const opacity = useTransform(
    [entranceOpacity, exitOpacity],
    ([e, x]: number[]) => e * x
  );
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));

  return (
    <motion.div
      style={{
        y: entranceY,
        x: exitX,
        opacity,
        visibility,
        top: "clamp(2rem, 6vh, 4.5rem)",
        right: "var(--page-margin)",
      }}
      className="pointer-events-none absolute max-w-[30ch] text-right"
    >
      <p className="text-body text-ink/65">{HERO_PARAGRAPH}</p>
      <a
        href="#plan"
        className="pointer-events-auto mt-4 inline-block bg-ink px-7 py-3.5 text-small text-bone transition-colors hover:bg-celadon"
      >
        Plan your route
      </a>
    </motion.div>
  );
}

function Wordmark({ progress }: { progress: MotionValue<number> }) {
  const entrance = useEntranceValue(0.05);
  const entranceY = useTransform(entrance, [0, 1], [12, 0]);
  const entranceOpacity = useTransform(entrance, [0, 1], [0, 1]);

  const [winStart, winEnd] = WORDMARK_EXIT_WINDOW;
  const exitYPercent = useTransform(progress, [winStart, winEnd], [0, 115]);
  const exitScale = useTransform(progress, [winStart, winEnd], [1, 0.96]);
  const exitOpacity = useTransform(progress, [winStart, winEnd], [1, 0]);

  const opacity = useTransform(
    [entranceOpacity, exitOpacity],
    ([e, x]: number[]) => e * x
  );
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));
  const transform = useMotionTemplate`translateY(calc(${entranceY}px + ${exitYPercent}%)) scale(${exitScale})`;

  return (
    <motion.h1
      style={{
        transform,
        opacity,
        visibility,
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.5rem, 13vw, 14rem)",
        lineHeight: 0.82,
        letterSpacing: "-0.02em",
        backgroundImage: "linear-gradient(to bottom, var(--ink) 0%, transparent 112%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
      className="pointer-events-none absolute bottom-0 left-0 w-full text-center"
    >
      BANGLADESH
    </motion.h1>
  );
}

export default function HeroOverlay({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <NoteCards progress={progress} />
      <PlanCluster progress={progress} />
      <Wordmark progress={progress} />
    </div>
  );
}
