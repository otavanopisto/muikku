import * as React from "react";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { useTranslation } from "react-i18next";

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
const InitializationFooter = (props: PedagogyFormWizardFooterProps) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
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
          buttonModifiers={["info"]}
          onClick={handlePreviousStep}
          disabled={isFirstStep}
        >
          {t("actions.previous", { ns: "common" })}
        </Button>
      )}

      {!isLastStep && (
        <Button
          onClick={handleNextStep}
          buttonModifiers={["info"]}
          disabled={isLastStep}
        >
          {t("actions.next", { ns: "common" })}
        </Button>
      )}
    </>
  );
};

export default InitializationFooter;
