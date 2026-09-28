import { useState } from "react";
import GridLines from "./GridLines";
import LandCard from "./LandCard";
import { LAND_CARDS } from "../../lib/landContent";

export default function LandCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="relative mt-12 grid grid-cols-1 gap-0 desk:grid-cols-4 desk:grid-rows-2 desk:[grid-template-rows:repeat(2,clamp(19rem,44vh,24rem))]"
    >
      <GridLines hoveredIndex={hoveredIndex} />
      {LAND_CARDS.map((card, i) => (
        <LandCard
          key={card.n}
          index={i}
          n={card.n}
          title={card.title}
          body={card.body}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
          onHoverChange={(hovered) => setHoveredIndex(hovered ? i : null)}
        />
      ))}
    </div>
  );
}
