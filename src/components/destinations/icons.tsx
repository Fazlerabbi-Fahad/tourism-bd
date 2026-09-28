import { motion } from "motion/react";
import type { IconKey } from "../../lib/destinationContent";

const EASE = [0.16, 1, 0.3, 1] as const;
const DRAW_TRANSITION = { duration: 1.2, ease: EASE };

const strokeProps = {
  fill: "none",
  stroke: "var(--celadon)",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function DrawPath(props: React.ComponentProps<typeof motion.path>) {
  return (
    <motion.path
      {...strokeProps}
      {...props}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={DRAW_TRANSITION}
    />
  );
}

function MountainsIcon() {
  return (
    <svg viewBox="0 0 56 56" width={56} height={56} aria-hidden="true">
      <DrawPath d="M4 40 L20 16 L30 30 L38 20 L52 40 Z" />
    </svg>
  );
}

function WavesIcon() {
  return (
    <svg viewBox="0 0 56 56" width={56} height={56} aria-hidden="true">
      <DrawPath d="M4 22c6-8 12-8 18 0s12 8 18 0 12-8 18 0" transition={{ ...DRAW_TRANSITION }} />
      <DrawPath d="M4 34c6-8 12-8 18 0s12 8 18 0 12-8 18 0" transition={{ ...DRAW_TRANSITION, delay: 0.12 }} />
    </svg>
  );
}

function CanopyIcon() {
  return (
    <svg viewBox="0 0 56 56" width={56} height={56} aria-hidden="true">
      <DrawPath d="M28 50V30" />
      <DrawPath
        d="M28 30c-11 0-19-7-19-16 0-2 3-2 4-1 1-6 8-9 15-9s14 3 15 9c1-1 4-1 4 1 0 9-8 16-19 16z"
        transition={{ ...DRAW_TRANSITION, delay: 0.12 }}
      />
    </svg>
  );
}

function BrickIcon() {
  return (
    <svg viewBox="0 0 56 56" width={56} height={56} aria-hidden="true">
      <DrawPath d="M4 16h20M28 16h24" />
      <DrawPath d="M4 28h12M20 28h20M44 28h8" transition={{ ...DRAW_TRANSITION, delay: 0.1 }} />
      <DrawPath d="M4 40h20M28 40h24" transition={{ ...DRAW_TRANSITION, delay: 0.2 }} />
    </svg>
  );
}

function TeaIcon() {
  return (
    <svg viewBox="0 0 56 56" width={56} height={56} aria-hidden="true">
      <DrawPath d="M2 16c8 6 16 6 24 0s16-6 24 0" />
      <DrawPath d="M2 28c8 6 16 6 24 0s16-6 24 0" transition={{ ...DRAW_TRANSITION, delay: 0.1 }} />
      <DrawPath d="M2 40c8 6 16 6 24 0s16-6 24 0" transition={{ ...DRAW_TRANSITION, delay: 0.2 }} />
    </svg>
  );
}

const ICONS: Record<IconKey, () => JSX.Element> = {
  mountains: MountainsIcon,
  waves: WavesIcon,
  canopy: CanopyIcon,
  brick: BrickIcon,
  tea: TeaIcon,
};

export default function DestinationIcon({ icon }: { icon: IconKey }) {
  const Comp = ICONS[icon];
  return <Comp />;
}
