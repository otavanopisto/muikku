import * as React from "react";
import "~/sass/elements/pedagogy.scss";
import { UserRole } from "~/@types/pedagogy-form";
import UpperSecondaryPedagogicalSupportWizardForm from "./uppersecondary-form";
import CompulsoryPedagogicalSupportWizardForm from "./compulsory-form";

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface PedagogicalSupportFormProps {
  userRole: UserRole;
  studentUserEntityId: number;
  isUppersecondary: boolean;
}

/**
 * Creates a new UpperSecondaryPedagogicalSupportForm component.
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogicalSupportForm = (props: PedagogicalSupportFormProps) => {
  if (props.isUppersecondary) {
    return <UpperSecondaryPedagogicalSupportWizardForm {...props} />;
  }

  return <CompulsoryPedagogicalSupportWizardForm {...props} />;
};

export default PedagogicalSupportForm;
