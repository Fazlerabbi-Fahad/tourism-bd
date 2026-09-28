export const LAND_CARDS = [
  {
    n: "01",
    title: "The delta",
    body: "The Ganges, Brahmaputra and Meghna converge here into the largest river delta on Earth. Everything about how people live, farm and travel follows the water's shape.",
  },
  {
    n: "02",
    title: "The hills",
    body: "In the northeast, tea gardens climb the low hills of Sylhet in tight green rows, harvested by hand since the 1850s, the mist rarely lifting before mid-morning.",
  },
  {
    n: "03",
    title: "The mangroves",
    body: "The Sundarbans, the world's largest mangrove forest, straddles the delta's edge — home to the Royal Bengal tiger and a coastline that rewrites itself with every tide.",
  },
  {
    n: "04",
    title: "The coast",
    body: "Cox's Bazar runs unbroken for over a hundred kilometres, the longest natural sea beach in the world, where the delta finally gives way to open water.",
  },
] as const;

export const LAND_SENTENCE = [
  { text: "It is", colStart: 1, colSpan: 2, align: "left" as const },
  {
    text: "delta and hill, tide and monsoon,",
    colStart: 3,
    colSpan: 3,
    align: "left" as const,
  },
  {
    text: "and every road eventually meets a river.",
    colStart: 9,
    colSpan: 4,
    align: "right" as const,
  },
];
