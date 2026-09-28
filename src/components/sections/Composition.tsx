import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { cx } from "../../lib/cx";
import { RIVER_ROWS } from "../../lib/riverContent";

const ROW_INDENT_PERCENT = [0, 6, 12];
const ROW_GAP_VH = 16;
const CORNER_DROP_PX = 32;

export default function Composition() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const row0Ref = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);

  const rowRefs = [row0Ref, row1Ref, row2Ref];

  const lengthRef = useRef(0);
  const thresholdsRef = useRef<[number, number]>([0, 0]);
  const reachedIndexRef = useRef(0);

  const [reachedIndex, setReachedIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const numeral = numeralRef.current;
    const section = sectionRef.current;
    if (!container || !path || !numeral || !section) return;

    const build = () => {
      const containerRect = container.getBoundingClientRect();
      const rects = rowRefs.map((r) => r.current!.getBoundingClientRect());

      const xAt = (i: number) => {
        const row = rowRefs[i].current!;
        const rowLeft = rects[i].left - containerRect.left;
        const paddingLeft = parseFloat(getComputedStyle(row).paddingLeft || "0");
        return rowLeft + paddingLeft / 2;
      };

      const x0 = xAt(0);
      const x1 = xAt(1);
      const x2 = xAt(2);
      const corner1 = rects[1].top - containerRect.top + CORNER_DROP_PX;
      const corner2 = rects[2].top - containerRect.top + CORNER_DROP_PX;
      const height = containerRect.height;

      const d = `M ${x0} 0 V ${corner1} H ${x1} V ${corner2} H ${x2} V ${height}`;
      path.setAttribute("d", d);
      numeral.style.offsetPath = `path('${d}')`;
      numeral.style.offsetRotate = "0deg";
      numeral.style.offsetDistance = prefersReducedMotion ? "100%" : "0%";

      const total = path.getTotalLength();
      lengthRef.current = total;

      const seg0 = corner1;
      const seg1 = Math.abs(x1 - x0);
      const seg2 = corner2 - corner1;
      const seg3 = Math.abs(x2 - x1);

      const t1 = (seg0 + seg1) / total;
      const t2 = (seg0 + seg1 + seg2 + seg3) / total;
      thresholdsRef.current = [t1, t2];

      if (prefersReducedMotion) {
        path.style.strokeDasharray = `${total}`;
        path.style.strokeDashoffset = "0";
      } else {
        path.style.strokeDasharray = `${total}`;
        path.style.strokeDashoffset = `${total}`;
      }
    };

    build();

    if (prefersReducedMotion) {
      reachedIndexRef.current = 2;
      setReachedIndex(2);
      window.addEventListener("resize", build);
      return () => window.removeEventListener("resize", build);
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 70%",
        onUpdate: (self) => {
          const total = lengthRef.current;
          const progress = self.progress;
          path.style.strokeDashoffset = `${total * (1 - progress)}`;
          numeral.style.offsetDistance = `${progress * 100}%`;

          const [t1, t2] = thresholdsRef.current;
          const next = progress >= t2 ? 2 : progress >= t1 ? 1 : 0;
          if (next !== reachedIndexRef.current) {
            reachedIndexRef.current = next;
            setReachedIndex(next);
          }
        },
      });

      const onResize = () => {
        build();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <section
      id="composition"
      ref={sectionRef}
      className="relative overflow-hidden bg-bone-deep"
    >
      <img
        src="/boatman.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-right"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--bone-deep) 0%, var(--bone-deep) 46%, transparent 80%)",
        }}
      />

      <div className="page-shell section-pad relative z-10">
        <div ref={containerRef} className="relative">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <path ref={pathRef} fill="none" stroke="var(--celadon)" strokeWidth={1.5} />
          </svg>

          <div
            ref={numeralRef}
            className="text-numeral text-ink pointer-events-none absolute top-0 left-0 select-none"
          >
            {`0${reachedIndex + 1}`}
          </div>

          {RIVER_ROWS.map((row, i) => (
            <div
              key={row.name}
              ref={rowRefs[i]}
              className={cx(
                "transition-colors duration-700",
                reachedIndex >= i ? "text-ink" : "text-ink/35"
              )}
              style={{
                marginTop: i === 0 ? 0 : `${ROW_GAP_VH}vh`,
                marginLeft: `${ROW_INDENT_PERCENT[i]}%`,
                paddingLeft: "clamp(3.5rem, 7vw, 6rem)",
              }}
            >
              <p className="text-h1">{row.name}</p>
              <p className="text-h2">{row.desc}</p>
              <p className="text-small">{row.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
