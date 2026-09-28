import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { useIsReducedExperience } from "../../hooks/useIsReducedExperience";
import LetterCascade, {
  SEASON_CASCADE_ENTER,
  SEASON_CASCADE_EXIT,
} from "../shared/LetterCascade";
import SeasonsStatic from "../seasons/SeasonsStatic";
import { SEASONS, SEASON_IMAGE_RATIO } from "../../lib/seasonContent";
import { HERITAGE_PARAGRAPHS, HERITAGE_IMAGE, HERITAGE_IMAGE_RATIO } from "../../lib/heritageContent";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEP_END = 0.6;
const BOUNDARIES = [1, 2, 3, 4, 5].map((i) => i / 6);
const CROSSFADE_WINDOW = 0.03;
const GLOW_STOPS = [
  { t: 0.5 / 6, rgb: [230, 210, 150] as const, a: 0.42 },
  { t: 1.5 / 6, rgb: [120, 140, 130] as const, a: 0.38 },
  { t: 2.5 / 6, rgb: [200, 190, 150] as const, a: 0.38 },
  { t: 3.5 / 6, rgb: [180, 150, 110] as const, a: 0.42 },
  { t: 4.5 / 6, rgb: [210, 220, 225] as const, a: 0.4 },
  { t: 5.5 / 6, rgb: [140, 200, 120] as const, a: 0.5 },
];

const HERITAGE_ENTER = { ...SEASON_CASCADE_ENTER, stagger: 0.04, delayChildren: 0.1 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (tp: number, start: number, end: number) => clamp01((tp - start) / (end - start));

function segmentOpacity(index: number, descent: number) {
  let opacity = 1;
  if (index > 0) {
    const b = BOUNDARIES[index - 1];
    opacity = Math.min(opacity, clamp01((descent - (b - CROSSFADE_WINDOW)) / (2 * CROSSFADE_WINDOW)));
  }
  if (index < BOUNDARIES.length) {
    const b = BOUNDARIES[index];
    opacity = Math.min(
      opacity,
      1 - clamp01((descent - (b - CROSSFADE_WINDOW)) / (2 * CROSSFADE_WINDOW))
    );
  }
  return clamp01(opacity);
}

function glowColorAt(descent: number) {
  const first = GLOW_STOPS[0];
  const last = GLOW_STOPS[GLOW_STOPS.length - 1];
  if (descent <= first.t) return { rgb: first.rgb, a: first.a };
  if (descent >= last.t) return { rgb: last.rgb, a: last.a };
  for (let i = 0; i < GLOW_STOPS.length - 1; i++) {
    const a = GLOW_STOPS[i];
    const b = GLOW_STOPS[i + 1];
    if (descent >= a.t && descent <= b.t) {
      const f = (descent - a.t) / (b.t - a.t);
      return {
        rgb: [
          a.rgb[0] + (b.rgb[0] - a.rgb[0]) * f,
          a.rgb[1] + (b.rgb[1] - a.rgb[1]) * f,
          a.rgb[2] + (b.rgb[2] - a.rgb[2]) * f,
        ] as const,
        a: a.a + (b.a - a.a) * f,
      };
    }
  }
  return { rgb: last.rgb, a: last.a };
}

function PinnedSeasons() {
  const sectionRef = useRef<HTMLElement>(null);
  const boatWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const descRailRef = useRef<HTMLDivElement>(null);
  const indexRailRef = useRef<HTMLDivElement>(null);
  const heritageImageOuterRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);

  const lastProgressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const showSeasonNameRef = useRef(true);
  const showHeritageRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showSeasonName, setShowSeasonName] = useState(true);
  const [showHeritage, setShowHeritage] = useState(false);

  const applyContinuousStyles = (tp: number) => {
    const descent = clamp01(tp / STEP_END);

    imgRefs.current.forEach((img, i) => {
      if (img) img.style.opacity = String(segmentOpacity(i, descent));
    });

    const boatExitVh = 30 * remap(tp, 0.6, 0.7);
    const boatFadeT = remap(tp, 0.6, 0.68);
    const scale = 1 + 0.06 * descent;
    if (boatWrapperRef.current) {
      boatWrapperRef.current.style.transform = `translate(-50%, calc(-50% + ${boatExitVh}vh)) scale(${scale})`;
      boatWrapperRef.current.style.opacity = String(1 - boatFadeT);
      boatWrapperRef.current.style.visibility = boatFadeT < 0.98 ? "visible" : "hidden";
    }

    const { rgb, a } = glowColorAt(descent);
    if (glowRef.current) {
      glowRef.current.style.backgroundImage = `radial-gradient(46% 42% at 50% 56%, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a}), transparent 70%)`;
      glowRef.current.style.opacity = String(1 - remap(tp, 0.58, 0.66));
    }
    if (pitchRef.current) pitchRef.current.style.opacity = String(remap(tp, 0.58, 0.66));
    if (dawnRef.current) dawnRef.current.style.opacity = String(remap(tp, 0.66, 0.8));

    const railSlideT = remap(tp, 0.6, 0.68);
    const railFadeT = remap(tp, 0.6, 0.66);
    const railVisibility = railSlideT < 0.98 ? "visible" : "hidden";
    if (descRailRef.current) {
      descRailRef.current.style.transform = `translate(${-45 * railSlideT}vw, -50%)`;
      descRailRef.current.style.opacity = String(1 - railFadeT);
      descRailRef.current.style.visibility = railVisibility;
    }
    if (indexRailRef.current) {
      indexRailRef.current.style.transform = `translate(${30 * railSlideT}vw, -50%)`;
      indexRailRef.current.style.opacity = String(1 - railFadeT);
      indexRailRef.current.style.visibility = railVisibility;
    }

    if (heritageImageOuterRef.current) {
      const parallax = 40 * (1 - remap(tp, 0.8, 1.0));
      heritageImageOuterRef.current.style.transform = `translateY(${parallax}px)`;
    }
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    applyContinuousStyles(0);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const tp = self.progress;
          lastProgressRef.current = tp;
          applyContinuousStyles(tp);

          const descent = clamp01(tp / STEP_END);
          const idx = Math.min(5, Math.floor(descent * 6));
          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx;
            setActiveIndex(idx);
          }

          const wantSeasonName = tp <= 0.61;
          if (wantSeasonName !== showSeasonNameRef.current) {
            showSeasonNameRef.current = wantSeasonName;
            setShowSeasonName(wantSeasonName);
          }

          const wantHeritage = tp >= 0.8;
          if (wantHeritage !== showHeritageRef.current) {
            showHeritageRef.current = wantHeritage;
            setShowHeritage(wantHeritage);
          }
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Direct style writes can be lost if these elements are ever reconciled
  // across a render (e.g. when heritage content mounts in). Re-assert every
  // render so the stage never drops back to its initial styles.
  useLayoutEffect(() => {
    applyContinuousStyles(lastProgressRef.current);
  });

  const active = SEASONS[activeIndex];

  return (
    <section id="seasons" ref={sectionRef} className="relative" style={{ height: "650vh" }}>
      <div
        className="sticky top-0 h-svh overflow-hidden text-bone"
        style={{ backgroundImage: "linear-gradient(160deg, var(--river) 0%, var(--pitch) 85%)" }}
      >
        <div ref={glowRef} className="absolute inset-0 z-0" />
        <div ref={pitchRef} className="bg-pitch absolute inset-0 z-[1]" />
        <div ref={dawnRef} className="bg-bone-deep absolute inset-0 z-[2]" />

        <div
          className="absolute z-10 overflow-hidden text-center"
          style={{ bottom: "5vh", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 7.5vw, 8.5rem)",
            }}
          >
            <LetterCascade text={active.name} show={showSeasonName} />
          </div>
        </div>

        <div
          ref={boatWrapperRef}
          className="absolute z-10"
          style={{
            top: "50%",
            left: "50%",
            height: "62vh",
            width: `calc(62vh * ${SEASON_IMAGE_RATIO})`,
          }}
        >
          {SEASONS.map((season, i) => (
            <img
              key={season.file}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              src={encodeURI(`/${season.file}`)}
              alt={i === 0 ? season.name : ""}
              aria-hidden={i === 0 ? undefined : true}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        </div>

        <div
          ref={descRailRef}
          className="absolute z-10 h-[3rem] w-[20rem] max-w-[40vw] overflow-hidden"
          style={{ left: "var(--page-margin)", top: "50%" }}
        >
          <AnimatePresence initial={false}>
            <motion.p
              key={activeIndex}
              className="text-small text-bone/70 absolute inset-x-0 flex h-full items-center"
              initial={{ y: "1.2em", opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.45 } }}
              exit={{ y: "-1.2em", opacity: 0, transition: { duration: 0.45 } }}
            >
              {active.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        <div
          ref={indexRailRef}
          className="absolute z-10 flex flex-col items-end gap-3"
          style={{ right: "var(--page-margin)", top: "50%" }}
        >
          {SEASONS.map((season, i) => (
            <span
              key={season.n}
              className="transition-colors duration-500"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                color: i === activeIndex ? "var(--bone)" : "color-mix(in srgb, var(--bone) 30%, transparent)",
              }}
            >
              {season.n}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
          <div className="page-shell text-ink w-full">
            <div className="overflow-hidden">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.75rem, 7.5vw, 8.5rem)",
                }}
              >
                <LetterCascade
                  text="The heritage"
                  show={showHeritage}
                  enter={HERITAGE_ENTER}
                  exit={SEASON_CASCADE_EXIT}
                  className="relative h-[1em]"
                />
              </div>
            </div>

            <div className="grid-12" style={{ marginTop: "6vh" }}>
              <div className="col-start-1 col-span-5 flex flex-col gap-6">
                {HERITAGE_PARAGRAPHS.map((p, i) => (
                  <motion.p
                    key={i}
                    className="text-body text-ink/80 max-w-[38ch]"
                    initial={{ opacity: 0, y: 48 }}
                    animate={
                      showHeritage
                        ? { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: i === 0 ? 0.55 : 0.7 } }
                        : { opacity: 0, y: 48, transition: { duration: 0.3 } }
                    }
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <div className="col-start-7 col-span-6">
                <div ref={heritageImageOuterRef} className="w-full">
                  <motion.img
                    src={encodeURI(`/${HERITAGE_IMAGE}`)}
                    alt="Somapura Mahavihara, Paharpur"
                    className="h-auto w-full"
                    style={{ aspectRatio: `${HERITAGE_IMAGE_RATIO}` }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      showHeritage
                        ? { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.4 } }
                        : { opacity: 0, y: 40, transition: { duration: 0.3 } }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Seasons() {
  const isReduced = useIsReducedExperience();
  if (isReduced) return <SeasonsStatic />;
  return <PinnedSeasons />;
}
