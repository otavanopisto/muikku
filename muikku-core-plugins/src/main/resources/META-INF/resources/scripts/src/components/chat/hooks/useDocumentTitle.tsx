import { useCallback, useRef } from "react";

/**
 * Hook for setting and resetting document title
 * @returns setTitle and resetTitle functions
 */
export function useDocumentTitle() {
  const defaultTitle = useRef(document.title);

  /**
   * Set document title
   * @param newTitle - New title
   */
  const setTitle = useCallback(
    (newTitle: string | ((prev: string) => string)) => {
      if (typeof newTitle === "function") {
        document.title = newTitle(document.title);
      } else {
        document.title = newTitle;
      }
    },
    []
  );

  /**
   * Reset document title to default
   */
  const resetTitle = useCallback(() => {
    document.title = defaultTitle.current;
  }, []);

  return { setTitle, resetTitle };
}
