import * as React from "react";
import Button from "../button";
import { useWizardContext } from "../wizard/context/wizard-context";
import { useTranslation } from "react-i18next";

/**
 * PedagogyFormWizardFooter
 */
interface PedagogyFormWizardFooterProps {}

/**
 * PedagogyFormWizardFooter
 *
 * @param props props
 * @returns React.JSX.Element
 */
const PedagogyFormWizardFooter = (props: PedagogyFormWizardFooterProps) => {
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

export default PedagogyFormWizardFooter;
