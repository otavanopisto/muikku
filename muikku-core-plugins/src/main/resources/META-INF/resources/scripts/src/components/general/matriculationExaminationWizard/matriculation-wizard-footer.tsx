import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { useMatriculationContext } from "./context/matriculation-context";

/**
 * PedagogyFormWizardFooter
 */
interface MatriculationWizardFooterProps {
  secondLastButtonText?: string;
  lastStepButton?: JSX.Element;
}

/**
 * PedagogyFormWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const MatriculationWizardFooter = (props: MatriculationWizardFooterProps) => {
  const { secondLastButtonText, lastStepButton } = props;

  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const { matriculation } = useMatriculationContext();

  const { saveState } = matriculation;

  const {
    previous,
    next,
    isFirstStep,
    isLastStep,
    step,
    currentStepIndex,
    steps,
  } = useWizardContext();

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

  const isSecondLast = currentStepIndex === steps.length - 2;

  return (
    <>
      {!isFirstStep && (
        <Button
          buttonModifiers={["info"]}
          onClick={handlePreviousStep}
          disabled={
            isFirstStep ||
            saveState === "IN_PROGRESS" ||
            saveState === "SUCCESS"
          }
        >
          {t("actions.previous", { ns: "common" })}
        </Button>
      )}

      {isSecondLast && secondLastButtonText ? (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["info"]}
          disabled={step.isInvalid || saveState === "IN_PROGRESS"}
        >
          {secondLastButtonText}
        </Button>
      ) : (
        !isLastStep && (
          <Button
            onClick={handleNextStep}
            buttonModifiers={["info"]}
            disabled={
              isLastStep || step.isInvalid || saveState === "IN_PROGRESS"
            }
          >
            {t("actions.next", { ns: "common" })}
          </Button>
        )
      )}

      {isLastStep && lastStepButton && lastStepButton}
    </>
  );
};

export default MatriculationWizardFooter;
