import { HERO_FIRST_FRAME_SRC } from "../../lib/heroFrames";
import { HERO_CARDS, HERO_PARAGRAPH } from "../../lib/heroContent";

export default function HeroStatic() {
  return (
    <>
      <section className="relative min-h-svh overflow-hidden bg-bone">
        <img
          src={HERO_FIRST_FRAME_SRC}
          alt="A wooden boat on still water at dawn, Bangladesh"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 flex min-h-svh flex-col justify-between gap-10 page-shell section-pad">
          <div className="flex flex-col gap-4">
            {HERO_CARDS.map((card) => (
              <div key={card.region} className="w-full max-w-[15.5rem] bg-bone-deep/85 p-5">
                <p className="text-h2" style={{ fontSize: "1.375rem" }}>
                  {card.region}
                </p>
                <p className="text-body mt-1">{card.place}</p>
                <p className="text-small mt-1 text-ink/55">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="max-w-[30ch]">
            <p className="text-body text-ink/65">{HERO_PARAGRAPH}</p>
            <a
              href="#plan"
              className="mt-4 inline-block bg-ink px-7 py-3.5 text-small text-bone transition-colors hover:bg-celadon"
            >
              Plan your route
            </a>
          </div>

          <h1
            style={{
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
            className="w-full text-center"
          >
            BANGLADESH
          </h1>
        </div>
      </section>

      <div aria-hidden="true" className="h-svh bg-bone" />
    </>
  );
}
