import * as React from "react";

/**
 * useIsOverflow
 * @param ref ref
 * @returns isOverflow
 */
export const useIsOverflow = <T extends HTMLElement>(
  ref: React.MutableRefObject<T>
) => {
  const [isOverflow, setIsOverflow] = React.useState(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;

    /**
     * trigger
     */
    const trigger = () => {
      console.log(
        "ref.current.scrollHeight, ref.current.clientHeight",
        ref.current.scrollHeight,
        ref.current.clientHeight
      );

      console.log("parent element", ref.current.parentElement.scrollHeight);

      const hasOverflow =
        current.scrollHeight >= ref.current.parentElement.scrollHeight;

      setIsOverflow(hasOverflow);
    };

    if (current) {
      if ("ResizeObserver" in window) {
        new ResizeObserver(trigger).observe(current);
      }

      trigger();
    }
  }, [ref]);

  return isOverflow;
};
