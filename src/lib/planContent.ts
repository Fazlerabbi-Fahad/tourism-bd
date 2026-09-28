export const PLAN_HEADERS = ["Destination", "Best season", "Duration", "From Dhaka", "Highlight"] as const;

export const PLAN_ROWS = [
  {
    name: "Sundarbans",
    season: "Winter",
    durationValue: "3-4",
    durationLabel: "days",
    distance: "~330 km",
    highlight: "Mangrove + tiger reserve",
  },
  {
    name: "Cox's Bazar",
    season: "Nov-Feb",
    durationValue: "2-3",
    durationLabel: "days",
    distance: "~400 km",
    highlight: "Longest natural sea beach",
  },
  {
    name: "Sylhet",
    season: "Oct-Mar",
    durationValue: "2-3",
    durationLabel: "days",
    distance: "~245 km",
    highlight: "Tea gardens + hill mist",
  },
  {
    name: "Paharpur",
    season: "Nov-Feb",
    durationValue: "1-2",
    durationLabel: "days",
    distance: "~285 km",
    highlight: "8th-century monastery ruins",
  },
] as const;
