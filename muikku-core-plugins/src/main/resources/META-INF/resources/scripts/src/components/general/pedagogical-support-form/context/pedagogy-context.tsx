import * as React from "react";
import { UsePedagogyType } from "../hooks/usePedagogy";

/**
 * PedagogyContextValue
 */
interface PedagogyContextValue extends UsePedagogyType {
  userRole?:
    | "STUDENT"
    | "COURSE_TEACHER"
    | "GUIDANCE_COUNSELOR"
    | "SPECIAL_ED_TEACHER";
}

/**
 * WizardProviderProps
 */
interface PedagogyProviderProps {
  children: React.ReactNode;
  value: PedagogyContextValue;
}

export const PedagogyContext = React.createContext<
  PedagogyContextValue | undefined
>(undefined);

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function PedagogyProvider(props: PedagogyProviderProps) {
  const { children, value } = props;

  return (
    <PedagogyContext.Provider value={value}>
      {children}
    </PedagogyContext.Provider>
  );
}

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function usePedagogyContext() {
  const context = React.useContext(PedagogyContext);
  if (context === undefined) {
    throw new Error(
      "usePedagogyContext must be used within a PedagogyProvider"
    );
  }
  return context;
}

export { usePedagogyContext, PedagogyProvider };
