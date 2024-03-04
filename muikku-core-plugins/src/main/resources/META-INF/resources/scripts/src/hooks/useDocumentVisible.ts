import * as React from "react";

/**
 * useDocumentVisible
 * @param documentElement documentElement
 */
export const useDocumentVisible = (documentElement = document) => {
  const [documentVisible, setDocumentVisible] = React.useState(
    documentElement.visibilityState
  );

  React.useEffect(() => {
    /**
     * handleVisibilityChange
     */
    const handleVisibilityChange = () => {
      setDocumentVisible(documentElement.visibilityState);
    };

    documentElement.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () =>
      documentElement.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
  }, [documentElement]);

  return documentVisible === "visible";
};
