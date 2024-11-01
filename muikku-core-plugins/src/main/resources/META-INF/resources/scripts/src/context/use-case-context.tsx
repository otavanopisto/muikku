// Create chat context to control whether browser is focused and visible
import * as React from "react";
import { createContext } from "react";

export type HopsUseCase = "STUDENT" | "GUARDIAN";

const UseCaseContext = createContext<HopsUseCase | undefined>(undefined);

/**
 * Window context provider props
 */
interface WindowContextProviderProps {
  value: HopsUseCase;
  children: React.ReactNode;
}

/**
 * Window context provider
 * @param props props
 */
const UseCaseContextProvider = (props: WindowContextProviderProps) => (
  <UseCaseContext.Provider value={props.value}>
    {props.children}
  </UseCaseContext.Provider>
);

/**
 * Method to returns context of whether window is active.
 * Check if context is defined and if not, throw an error
 */
function useUseCaseContext() {
  const context = React.useContext(UseCaseContext);
  if (context === undefined) {
    throw new Error(
      "useUseCaseContext must be used within a UseCaseContextProvider"
    );
  }
  return context;
}

export { UseCaseContextProvider, useUseCaseContext };
