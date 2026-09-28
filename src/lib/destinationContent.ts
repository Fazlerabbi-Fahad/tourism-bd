export type IconKey = "mountains" | "waves" | "canopy" | "brick" | "tea";
export type LabelSide = "left" | "right" | "top" | "bottom";

export type Destination = {
  id: string;
  name: string;
  x: number;
  y: number;
  labelSide: LabelSide;
  descriptor: string;
  body: string;
  icon: IconKey;
};

export const DHAKA_ANCHOR = { name: "Dhaka", x: 51, y: 44 };

export const DESTINATIONS: Destination[] = [
  {
    id: "sajek-valley",
    name: "Sajek Valley",
    x: 91,
    y: 51,
    labelSide: "left",
    descriptor: "Hill tracts · best Nov–Feb",
    body: "The highest point reachable by road in Bangladesh, cloud lines drifting below the ridge instead of above it. Best at sunrise, before the mist burns off.",
    icon: "mountains",
  },
  {
    id: "bandarban",
    name: "Bandarban",
    x: 90,
    y: 70,
    labelSide: "left",
    descriptor: "Hill tracts · best Nov–Feb",
    body: "Layered hills, tribal villages, and Nilgiri's viewpoint over folded green ridges. The gateway to the deeper hill tracts.",
    icon: "mountains",
  },
  {
    id: "thanchi",
    name: "Thanchi",
    x: 93,
    y: 79,
    labelSide: "left",
    descriptor: "Hill tracts · river access only",
    body: "The road ends here; the Sangu river begins the rest of the journey by boat, deeper into Remakri and the waterfalls beyond.",
    icon: "mountains",
  },
  {
    id: "sylhet",
    name: "Sylhet",
    x: 82,
    y: 27,
    labelSide: "right",
    descriptor: "Tea hills · best Oct–Mar",
    body: "Tea gardens climbing low hills in tight rows, the Ratargul swamp forest nearby, and the source rivers entering from Meghalaya.",
    icon: "tea",
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    x: 28,
    y: 73,
    labelSide: "top",
    descriptor: "Mangrove forest · best Winter",
    body: "The largest mangrove forest on Earth, tidal channels narrow enough to touch both banks, home to the Royal Bengal tiger.",
    icon: "canopy",
  },
  {
    id: "coxs-bazar",
    name: "Cox's Bazar",
    x: 84,
    y: 82,
    labelSide: "left",
    descriptor: "Coast · best Nov–Feb",
    body: "An unbroken hundred-plus kilometres of sand, the longest natural sea beach in the world.",
    icon: "waves",
  },
  {
    id: "paharpur",
    name: "Paharpur",
    x: 21,
    y: 25,
    labelSide: "right",
    descriptor: "Ruins · best Nov–Feb",
    body: "An eighth-century Buddhist monastery, once among the largest in the world, its brick terraces still tracing the original plan.",
    icon: "brick",
  },
];
