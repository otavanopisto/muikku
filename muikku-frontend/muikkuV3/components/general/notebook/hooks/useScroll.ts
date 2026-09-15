import * as React from "react";

/**
 * UseScroll
 */
export interface UseScroll {
  position: number;
  isScrollAllowed: boolean;
}

const BOUND_HEIGHT = 70;

// eslint-disable-next-line jsdoc/require-param
/**
 * getScrollDirection
 */
function getScrollDirection({
  position,
  upperBounds = Infinity,
  lowerBounds = -Infinity,
}: {
  position: number | undefined;
  upperBounds: number | undefined;
  lowerBounds: number | undefined;
}): "top" | "bottom" | "stable" {
  if (position === undefined) {
    return "stable";
  }
  if (position > lowerBounds - BOUND_HEIGHT) {
    return "bottom";
  }
  if (position < upperBounds + BOUND_HEIGHT) {
    return "top";
  }
  return "stable";
}

/**
 * useScroll
 * @param ref ref
 */
export const useScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const [config, setConfig] = React.useState<Partial<UseScroll>>({
    position: 0,
    isScrollAllowed: false,
  });

  const scrollTimer = React.useRef<null | NodeJS.Timeout>(null);

  const scrollSpeed = 2;
  const { position, isScrollAllowed } = config;

  const bounds = ref.current?.getBoundingClientRect();
  const direction = getScrollDirection({
    position,
    upperBounds: bounds?.top,
    lowerBounds: bounds?.bottom,
  });

  React.useEffect(() => {
    if (direction !== "stable" && isScrollAllowed) {
      scrollTimer.current = setInterval(() => {
        ref.current?.scrollBy(0, scrollSpeed * (direction === "top" ? -1 : 1));
      }, 1);
    }
    return () => {
      if (scrollTimer.current) {
        clearInterval(scrollTimer.current);
      }
    };
  }, [isScrollAllowed, direction, ref, scrollSpeed]);

  return { updatePosition: setConfig } as const;
};
