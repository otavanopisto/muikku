import * as React from "react";

export type UseWindowBreakpoints = ReturnType<typeof useWindowBreakpoints>;

/**
 * useWindowBreakpoints
 */
interface UseWindowBreakpointsProps {
  windowRef: React.RefObject<HTMLDivElement>;
}

const breakpoints = {
  mobileBreakpoint: 650,
};

/**
 * useWindowBreakpoints
 * @param props props
 */
function useWindowBreakpoints(props: UseWindowBreakpointsProps) {
  const { windowRef } = props;

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (windowRef.current) {
      const resizeWindowObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update mainWrapperRef margin left to roomWrapperRef width
          // if peopleWrapperRef width is changed and window current width is not mobile
          if (entry.target === windowRef.current) {
            if (entry.target.clientWidth <= breakpoints.mobileBreakpoint) {
              setIsMobile(true);
            } else {
              setIsMobile(false);
            }
          }
        }
      });

      resizeWindowObserver.observe(windowRef.current);

      return () => {
        resizeWindowObserver.disconnect();
      };
    }
  }, [windowRef]);

  return {
    isMobile,
  };
}

export default useWindowBreakpoints;
