import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";

/**
 * HopsWizardFooter
 */
interface HopsWizardFooterProps {
  externalContentRight?: React.ReactNode;
}

/**
 * HopsWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsWizardFooter = (props: HopsWizardFooterProps) => {
  const { externalContentRight } = props;
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

      {externalContentRight}
    </>
  );
};

export default HopsWizardFooter;
