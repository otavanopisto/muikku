// Create chat context to control whether browser is focused and visible
import * as React from "react";
import { createContext } from "react";

const WindowContext = createContext<boolean | undefined>(undefined);

/**
 * Window context provider props
 */
interface WindowContextProviderProps {
  children: React.ReactNode;
}

/**
 * Window context provider
 * @param props props
 */
const WindowContextProvider = (props: WindowContextProviderProps) => {
  const [windowIsActive, setWindowIsActive] = React.useState(true);

  /**
   * handleActivity
   * @param forcedFlag forcedFlag
   */
  function handleActivity(forcedFlag: unknown) {
    if (typeof forcedFlag === "boolean") {
      return forcedFlag ? setWindowIsActive(true) : setWindowIsActive(false);
    }

    return document.hidden ? setWindowIsActive(false) : setWindowIsActive(true);
  }

  React.useEffect(() => {
    /**
     * handleActivityFalse
     */
    const handleActivityFalse = () => handleActivity(false);
    /**
     * handleActivityTrue
     */
    const handleActivityTrue = () => handleActivity(true);

    document.addEventListener("visibilitychange", handleActivity);
    document.addEventListener("blur", handleActivityFalse);
    window.addEventListener("blur", handleActivityFalse);
    window.addEventListener("focus", handleActivityTrue);
    document.addEventListener("focus", handleActivityTrue);

    return () => {
      window.removeEventListener("blur", handleActivity);
      document.removeEventListener("blur", handleActivityFalse);
      window.removeEventListener("focus", handleActivityFalse);
      document.removeEventListener("focus", handleActivityTrue);
      document.removeEventListener("visibilitychange", handleActivityTrue);
    };
  }, []);

  return (
    <WindowContext.Provider value={windowIsActive}>
      {props.children}
    </WindowContext.Provider>
  );
};

/**
 * Method to returns context of whether window is active.
 * Check if context is defined and if not, throw an error
 */
function useWindowContext() {
  const context = React.useContext(WindowContext);
  if (context === undefined) {
    throw new Error(
      "useWindowContext must be used within a WindowContextProvider"
    );
  }
  return context;
}

export { WindowContextProvider, useWindowContext };
