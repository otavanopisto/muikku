import * as React from "react";
import { UseWizardType } from "../hooks/useWizard";

/**
 * WizardProviderProps
 */
interface WizardProviderProps {
  children: React.ReactNode;
  value: UseWizardType;
}

const WizardContext = React.createContext<UseWizardType | undefined>(undefined);

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function WizardProvider(props: WizardProviderProps) {
  const { children, value } = props;

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useWizardContext() {
  const context = React.useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider");
  }
  return context;
}

export { useWizardContext, WizardProvider };
