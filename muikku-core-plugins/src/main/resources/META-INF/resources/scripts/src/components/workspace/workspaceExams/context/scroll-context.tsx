import * as React from "react";

/**
 * ScrollContextType
 */
interface ScrollContextType {
  /**
   * Scroll container reference
   */
  scrollContainerRef: HTMLElement;
}

/**
 * ScrollContextProviderProps
 */
interface ScrollContextProviderProps {
  children: React.ReactNode;
  value: ScrollContextType;
}

export const ScrollContext = React.createContext<ScrollContextType | undefined>(
  undefined
);

/**
 * ScrollContextProvider
 * @param props props
 */
function ScrollContextProvider(props: ScrollContextProviderProps) {
  const { children, value } = props;

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

/**
 * useScrollContext
 */
function useScrollContext() {
  const context = React.useContext(ScrollContext);
  if (context === undefined) {
    throw new Error(
      "useScrollContext must be used within a ScrollContextProvider"
    );
  }
  return context;
}

export { useScrollContext, ScrollContextProvider };
