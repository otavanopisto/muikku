import * as React from "react";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { Stepper, StepperItem } from "~/components/general/wizard/stepper";
import { useMatriculationContext } from "./context/matriculation-context";

/**
 * StepWizardHeaderProps
 */
interface MatriculationWizardHeaderProps {}

/**
 * StepWizardHeader
 * @param props props
 * @returns JSX.Element
 */
const MatriculationWizardHeader = (props: MatriculationWizardHeaderProps) => {
  const { goTo, currentStepIndex, steps, disabledSteps } = useWizardContext();
  const { matriculation } = useMatriculationContext();
  const { saveState } = matriculation;

  const saving = saveState === "IN_PROGRESS";

  /**
   * handleStepClick
   * @param index index
   */
  const handleStepClick = (index: number) => () => goTo(index);

  return (
    <Stepper activeStepIndex={currentStepIndex}>
      {steps.map((step, index) => (
        <StepperItem
          key={index}
          index={index}
          label={step.name}
          onClick={handleStepClick(index)}
          // If the previous step is invalid, disable all the following steps
          disabled={disabledSteps.includes(index) || saving}
          active={currentStepIndex === index}
          completed={index < currentStepIndex}
          validationError={step.isInvalid}
        />
      ))}
    </Stepper>
  );
};

export default MatriculationWizardHeader;
