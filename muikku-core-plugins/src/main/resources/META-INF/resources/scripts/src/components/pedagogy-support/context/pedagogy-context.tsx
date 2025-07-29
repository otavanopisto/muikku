import * as React from "react";
import {
  CompulsoryFormData,
  isCompulsoryForm,
  isUpperSecondaryForm,
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import { UsePedagogyType } from "../hooks/usePedagogy";

/**
 * PedagogyContextValue
 */
interface PedagogyContextValue extends UsePedagogyType {
  userRole?:
    | "STUDENT"
    | "COURSE_TEACHER"
    | "GUIDANCE_COUNSELOR"
    | "STUDENT_PARENT"
    | "SPECIAL_ED_TEACHER";
  contextType: "upperSecondary" | "compulsory";
  getUpperSecondaryData: () => UpperSecondaryFormData | null;
  getCompulsoryStudiesData: () => CompulsoryFormData | null;
}

/**
 * WizardProviderProps
 */
interface PedagogyProviderProps {
  children: React.ReactNode;
  value: Omit<
    PedagogyContextValue,
    "getUpperSecondaryData" | "getCompulsoryStudiesData"
  >;
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

  const enhancedValue = {
    ...value,
    // eslint-disable-next-line jsdoc/require-jsdoc
    getUpperSecondaryData: () => {
      if (
        value.pedagogyFormData &&
        isUpperSecondaryForm(value.pedagogyFormData)
      ) {
        return value.pedagogyFormData;
      }
      return null;
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    getCompulsoryStudiesData: () => {
      if (value.pedagogyFormData && isCompulsoryForm(value.pedagogyFormData)) {
        return value.pedagogyFormData;
      }
      return null;
    },
  };

  return (
    <PedagogyContext.Provider value={enhancedValue}>
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
