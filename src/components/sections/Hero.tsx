import { useRef } from "react";
import { useScroll } from "motion/react";
import ScrubCanvas from "../hero/ScrubCanvas";
import HeroOverlay from "../hero/HeroOverlay";
import HeroStatic from "../hero/HeroStatic";
import { useIsReducedExperience } from "../../hooks/useIsReducedExperience";

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isReduced = useIsReducedExperience();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  if (isReduced) return <HeroStatic />;

  return (
    <section
      id="hero"
      ref={trackRef}
      className="relative"
      style={{ height: "calc(350vh + 100svh)" }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-bone">
        <ScrubCanvas trackRef={trackRef} progress={scrollYProgress} />
        <HeroOverlay progress={scrollYProgress} />
      </div>
    </section>
  );
}
