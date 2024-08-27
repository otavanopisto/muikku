import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { useMatriculationContext } from "./context/matriculation-context";

/**
 * PedagogyFormWizardFooter
 */
interface MatriculationWizardFooterProps {}

/**
 * PedagogyFormWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const MatriculationWizardFooter = (props: MatriculationWizardFooterProps) => {
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

  const saving = saveState === "IN_PROGRESS";

  const isSecondLast = currentStepIndex === steps.length - 2;

  return (
    <>
      {!isFirstStep && (
        <Button
          buttonModifiers={["info"]}
          onClick={handlePreviousStep}
          disabled={isFirstStep || saving}
        >
          {t("actions.previous", { ns: "common" })}
        </Button>
      )}

      {isSecondLast ? (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["info"]}
          disabled={step.isInvalid || saving}
        >
          Lähetä
        </Button>
      ) : (
        !isLastStep && (
          <Button
            onClick={handleNextStep}
            buttonModifiers={["info"]}
            disabled={isLastStep || step.isInvalid || saving}
          >
            {t("actions.next", { ns: "common" })}
          </Button>
        )
      )}
    </>
  );
};

export default MatriculationWizardFooter;