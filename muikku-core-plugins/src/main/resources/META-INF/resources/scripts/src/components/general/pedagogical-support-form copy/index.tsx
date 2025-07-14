import * as React from "react";
import "~/sass/elements/pedagogy.scss";
import { UserRole } from "~/@types/pedagogy-form";
import UpperSecondaryPedagogicalSupportWizardForm from "./forms/uppersecondary-form";
import CompulsoryPedagogicalSupportWizardForm from "./forms/compulsory-form";

// Visibility settings which study programmes have access to the form
export const UPPERSECONDARY_PEDAGOGYFORM = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
];

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface PedagogicalSupportFormProps {
  userRole: UserRole;
  studentUserEntityId: number;
  isSecondary: boolean;
}

/**
 * Creates a new UpperSecondaryPedagogicalSupportForm component.
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogicalSupportForm = (props: PedagogicalSupportFormProps) => {
  if (props.isSecondary) {
    return <UpperSecondaryPedagogicalSupportWizardForm {...props} />;
  }

  return <CompulsoryPedagogicalSupportWizardForm {...props} />;
};

export default PedagogicalSupportForm;
