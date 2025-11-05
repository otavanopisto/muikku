import * as React from "react";
import { UseMatriculationType } from "../hooks/use-matriculation";

/**
 * PedagogyContextValue
 */
interface MatriculationContextValue extends UseMatriculationType {}

/**
 * WizardProviderProps
 */
interface MatriculationProviderProps {
  children: React.ReactNode;
  value: MatriculationContextValue;
}

export const MatriculationContext = React.createContext<
  MatriculationContextValue | undefined
>(undefined);

/**
 * Method to returns context of matriculation.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function MatriculationProvider(props: MatriculationProviderProps) {
  const { children, value } = props;

  return (
    <MatriculationContext.Provider value={value}>
      {children}
    </MatriculationContext.Provider>
  );
}

/**
 * Method to returns context of matriculation.
 * Check if context is defined and if not, throw an error
 */
function useMatriculationContext() {
  const context = React.useContext(MatriculationContext);
  if (context === undefined) {
    throw new Error(
      "useMatriculationContext must be used within a MatriculationProvider"
    );
  }
  return context;
}

export { useMatriculationContext, MatriculationProvider };
