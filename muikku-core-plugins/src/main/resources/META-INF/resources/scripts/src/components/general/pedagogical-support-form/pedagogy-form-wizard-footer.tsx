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
    <div
      className="wizard-footer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 0",
      }}
    >
      {!isFirstStep && (
        <Button
          buttonModifiers={["cancel"]}
          onClick={handlePreviousStep}
          disabled={isFirstStep}
        >
          Edellinen
        </Button>
      )}

      {!isLastStep && (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["cancel"]}
          disabled={isLastStep}
        >
          Seuraava
        </Button>
      )}
    </div>
  );
};

export default PedagogyFormWizardFooter;
