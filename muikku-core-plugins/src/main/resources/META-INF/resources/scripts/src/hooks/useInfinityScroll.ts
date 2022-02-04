import { useCallback, useRef } from "react";
import { LoadingState } from "~/@types/shared";

/**
 * Inifinity scroll custom hook
 *
 * @param hasMore boolean value if there are more to be loaded
 * @param state state of loading
 * @param loadMore a function to load more
 * @returns useCallback() function to be used as a ref
 */
const useInfinityScroll = (
  hasMore: boolean,
  state: LoadingState,
  loadMore: () => void
) => {
  const observer = useRef<IntersectionObserver>();
  return useCallback(
    (node) => {
      if (!node) {
        return;
      }
      if (state === "LOADING_MORE") {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore === true) {
          loadMore();
        }
      });
      observer.current.observe(node);
    },
    [hasMore, state]
  );
};
export default useInfinityScroll;
