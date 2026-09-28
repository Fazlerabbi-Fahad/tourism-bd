import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const RISE_PX = 60;
const FIT_TOLERANCE = 0.005;
const MAX_ITERATIONS = 6;

export default function FooterWordmark() {
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const fit = () => {
      let size = parseFloat(getComputedStyle(el).fontSize) || 100;
      if (!size) size = 100;
      el.style.fontSize = `${size}px`;

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        const width = el.getBoundingClientRect().width;
        if (!width) break;
        const diff = Math.abs(width - window.innerWidth) / window.innerWidth;
        if (diff <= FIT_TOLERANCE) break;
        size = size * (window.innerWidth / width);
        el.style.fontSize = `${size}px`;
      }

      el.style.opacity = "1";
    };

    fit();
    document.fonts?.ready?.then(fit).catch(() => {});

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(fit);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRaf);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = textRef.current;
    if (!el) return;

    // Lenis manages scroll here (see SmoothScrollProvider), so a native
    // `window` "scroll" listener doesn't fire reliably. ScrollTrigger is
    // driven directly off Lenis's own scroll event, matching every other
    // scroll-reactive component in this app.
    const st = ScrollTrigger.create({
      start: () => document.documentElement.scrollHeight - window.innerHeight * 2,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        el.style.transform = `translateY(${(1 - self.progress) * RISE_PX}px)`;
      },
    });

    return () => st.kill();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={textRef}
      className="whitespace-nowrap"
      style={{
        display: "inline-block",
        fontFamily: "var(--font-display)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        marginBottom: "-0.21em",
        opacity: 0,
      }}
    >
      BANGLADESH
    </div>
  );
}
