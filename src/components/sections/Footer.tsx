import FooterWordmark from "../footer/FooterWordmark";
import { FOOTER_LINKS, FOOTER_TAGLINE } from "../../lib/footerContent";
import { SEASONS } from "../../lib/seasonContent";

const NUMERAL_MIN = 25;
const NUMERAL_MAX = 85;

function numeralOpacity(index: number) {
  return NUMERAL_MIN + (index * (NUMERAL_MAX - NUMERAL_MIN)) / (SEASONS.length - 1);
}

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 h-screen overflow-hidden bg-celadon text-bone">
      <div className="relative h-full">
        <div className="absolute" style={{ left: "var(--page-margin)", top: "14vh" }}>
          <nav className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body text-bone/70 transition-colors duration-300 hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p
            className="text-h2 text-bone/80 max-w-[26ch]"
            style={{ fontFamily: "var(--font-display)", marginTop: "2.5rem" }}
          >
            {FOOTER_TAGLINE}
          </p>
        </div>

        <div
          className="desk:block absolute hidden text-right"
          style={{ right: "var(--page-margin)", top: "14vh" }}
        >
          <p className="text-small text-bone/40 uppercase tracking-[0.16em]">Six seasons</p>

          <div className="mt-4 flex flex-col gap-2">
            {SEASONS.map((season, i) => (
              <div key={season.n} className="flex items-baseline justify-end gap-4">
                <span className="text-small text-bone/40 uppercase tracking-[0.16em]">
                  {season.name}
                </span>
                <span
                  className="text-numeral"
                  style={{
                    color: `color-mix(in srgb, var(--bone) ${numeralOpacity(i)}%, transparent)`,
                  }}
                >
                  {season.n}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <FooterWordmark />
        </div>
      </div>
    </footer>
  );
}
