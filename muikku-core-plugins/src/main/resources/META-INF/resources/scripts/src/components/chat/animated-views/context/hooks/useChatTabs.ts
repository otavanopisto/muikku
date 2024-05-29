import * as React from "react";
import { ChatView } from "../..";

/**
 * UseWizardProps
 */
export interface UseViewsProps {
  views: ChatView[];
}

export type UseChatViewsType = ReturnType<typeof useViews>;

/**
 * Use wizard custom hook. Handles wizard component functionalities and state
 *
 * @param props props
 * @returns wizard method and state values
 */
function useViews(props: UseViewsProps) {
  const [currentViewIndex, setCurrentViewIndex] = React.useState<number>(0);
  const [views] = React.useState<ChatView[]>(props.views);

  /**
   * Go to a specific step
   */
  const goTo = React.useCallback(
    (identifier: string) => {
      if (!views.map((tab) => tab.identifier).includes(identifier)) {
        throw new Error(`Tab with identifier ${identifier} not found`);
      }

      const viewIndex = views.findIndex((tab) => tab.identifier === identifier);

      setCurrentViewIndex(viewIndex);
    },
    [views]
  );

  return {
    view: views.find((tab, i) => i === currentViewIndex),
    views: views,
    currentViewIndex,
    goTo,
  };
}

export default useViews;
