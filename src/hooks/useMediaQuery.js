import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  // Initialize with the actual current value, not false
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    // Create the listener
    const listener = (e) => setMatches(e.matches);

    // Modern browsers use addEventListener, older ones use addListener
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
