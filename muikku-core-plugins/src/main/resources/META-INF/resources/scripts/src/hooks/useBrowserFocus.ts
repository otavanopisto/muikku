import * as React from "react";

/**
 * useDocumentVisible
 */
export const useBrowserFocus = () => {
  const [browserFocus, setBrowserFocus] = React.useState(false);

  React.useEffect(() => {
    /**
     * handleVisibilityChange
     * @param e event
     */
    const handleFocusChange = (e: FocusEvent) => {
      setBrowserFocus(true);
    };

    /**
     * handleBlur
     * @param e event
     */
    const handleBlur = (e: FocusEvent) => {
      setBrowserFocus(false);
    };

    window.addEventListener("focus", handleFocusChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocusChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return browserFocus;
};
