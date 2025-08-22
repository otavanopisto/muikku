import * as React from "react";
import { DataProvider } from "../types";

/**
 * Hook for using UIManager in React components
 * @param dataProvider DataProvider
 * @returns UIManager
 */
export function useUIManager(dataProvider: DataProvider) {
  const { onToggleAnswersVisible } = dataProvider;
  const [answersVisible, setAnswersVisible] = React.useState(false);

  /**
   * Toggle answers visible
   */
  const toggleAnswersVisible = React.useCallback(() => {
    setAnswersVisible((prev) => !prev);
    onToggleAnswersVisible?.();
  }, [onToggleAnswersVisible]);

  return React.useMemo(
    () => ({
      answersVisible,
      toggleAnswersVisible,
    }),
    [answersVisible, toggleAnswersVisible]
  );
}
