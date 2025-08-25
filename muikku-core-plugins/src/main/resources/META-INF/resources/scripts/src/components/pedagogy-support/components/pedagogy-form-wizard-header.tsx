import * as React from "react";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { Stepper, StepperItem } from "~/components/general/wizard/stepper";

/**
 * StepWizardHeaderProps
 */
interface StepWizardHeaderProps {}

/**
 * StepWizardHeader
 * @param props props
 * @returns JSX.Element
 */
const PedagogyFormWizardHeader = (props: StepWizardHeaderProps) => {
  const { goTo, currentStepIndex, steps } = useWizardContext();

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
          disabled={false}
          active={currentStepIndex === index}
          completed={index < currentStepIndex}
          validationError={step.isInvalid}
        />
      ))}
    </Stepper>
  );
};

export default PedagogyFormWizardHeader;
