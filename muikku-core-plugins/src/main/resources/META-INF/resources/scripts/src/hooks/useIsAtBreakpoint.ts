import { useEffect, useState, useRef } from "react";

/**
 * useIsAtBreakpoint Custom hook
 *
 * @param breakPoint - an "em" breakpoint width as a number
 * @returns boolean
 */
const useIsAtBreakpoint = (breakPoint: number): boolean => {
  const [currentWidth, setCurrentWidth] = useState(
    Math.round(window.innerWidth / 16) // Em values are calculated as 1em = 16px by default.
  );

  const countRef = useRef(currentWidth); // We need this, otherwise the useEffect won't get the correct currentWidth
  countRef.current = currentWidth;

  useEffect(() => {
    /**
     * A Handler for the resize event
     * @param e - UIEvent
     */
    const handleResize = (e: UIEvent) => {
      const width = Math.round(window.innerWidth / 16); // Width on resize
      const direction = countRef.current < width ? "out" : "in"; // Direction of the resize

      /**
       * If the resize zoom direction is outwards
       * we don't need to re-render
       * if we're already using the correct component
       * and vice versa
       */
      if (
        (direction === "out" && countRef.current <= breakPoint) ||
        (direction === "in" && countRef.current >= breakPoint)
      ) {
        setCurrentWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakPoint]);

  return currentWidth <= breakPoint;
};

export default useIsAtBreakpoint;
