import * as React from "react";
import Button from "../button";
import { useWizardContext } from "../wizard/context/wizard-context";

/**
 * PedagogyFormWizardFooter
 */
interface PedagogyFormWizardFooterProps {}

/**
 * PedagogyFormWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogyFormWizardFooter = (props: PedagogyFormWizardFooterProps) => {
  const { previous, next, isFirstStep, isLastStep } = useWizardContext();

  /**
   * handleNextStep
   */
  const handleNextStep = () => {
    next();
  };

  /**
   * handlePreviousStep
   */
  const handlePreviousStep = () => {
    previous();
  };

  return (
    <>
      {!isFirstStep && (
        <Button
          buttonModifiers={["wizard"]}
          onClick={handlePreviousStep}
          disabled={isFirstStep}
        >
          Edellinen
        </Button>
      )}

      {!isLastStep && (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["wizard"]}
          disabled={isLastStep}
        >
          Seuraava
        </Button>
      )}
    </>
  );
};

export default PedagogyFormWizardFooter;
