import { SEASONS } from "../../lib/seasonContent";
import { HERITAGE_PARAGRAPHS, HERITAGE_IMAGE } from "../../lib/heritageContent";

export default function SeasonsStatic() {
  return (
    <>
      <section
        className="page-shell section-pad text-bone"
        style={{
          backgroundImage: "linear-gradient(160deg, var(--river) 0%, var(--pitch) 85%)",
        }}
      >
        <div className="flex flex-col gap-16">
          {SEASONS.map((season) => (
            <div key={season.n} className="flex flex-col items-center gap-6 text-center">
              <img
                src={encodeURI(`/${season.file}`)}
                alt={season.name}
                className="h-[32vh] w-auto object-contain"
              />
              <p style={{ fontFamily: "var(--font-display)" }} className="text-h2">
                {season.name}
              </p>
              <p className="text-body max-w-[38ch] text-bone/70">{season.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell section-pad text-ink bg-bone-deep">
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-h1">
          The heritage
        </h2>
        <img
          src={encodeURI(`/${HERITAGE_IMAGE}`)}
          alt="Somapura Mahavihara, Paharpur"
          className="mt-8 h-auto w-full"
        />
        <div className="mt-8 flex flex-col gap-6">
          {HERITAGE_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-body text-ink/80 max-w-[38ch]">
              {p}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
