import { useState } from "react";

const REDUCED_QUERY = "(max-width: 860px), (prefers-reduced-motion: reduce)";

/** True for narrow viewports or prefers-reduced-motion — decided once at mount. */
export function useIsReducedExperience() {
  const [isReduced] = useState(() => window.matchMedia(REDUCED_QUERY).matches);
  return isReduced;
}
