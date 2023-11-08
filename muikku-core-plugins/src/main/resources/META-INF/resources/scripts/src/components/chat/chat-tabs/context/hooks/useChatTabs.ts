import * as React from "react";
import { ChatTab } from "../..";

/**
 * UseWizardProps
 */
export interface UseWizardProps {
  tabs: ChatTab[];
}

export type UseChatTabsType = ReturnType<typeof useChatTabs>;

/**
 * Use wizard custom hook. Handles wizard component functionalities and state
 *
 * @param props props
 * @returns wizard method and state values
 */
export const useChatTabs = (props: UseWizardProps) => {
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);
  const [tabs, setTabs] = React.useState<ChatTab[]>(props.tabs);

  /**
   * Go to the next step
   */
  const next = React.useCallback(() => {
    setCurrentTabIndex((i) => {
      if (i >= tabs.length - 1) {
        return i;
      }
      return i + 1;
    });
  }, [tabs.length]);

  /**
   * Go to the previous step
   */
  const previous = React.useCallback(() => {
    setCurrentTabIndex((i) => {
      if (i <= 0) {
        return i;
      }
      return i - 1;
    });
  }, []);

  /**
   * Go to a specific step
   */
  const goTo = React.useCallback(
    (step: number) => {
      if (step < 0 || step >= tabs.length) {
        throw new Error(`Invalid step index: ${step}`);
      }

      setCurrentTabIndex(step);
    },
    [tabs.length]
  );

  return {
    tab: tabs[currentTabIndex],
    tabs: tabs,
    currentTabIndex,
    isFirstStep: currentTabIndex === 0,
    isLastStep: currentTabIndex === tabs.length - 1,
    next,
    previous,
    goTo,
  };
};
