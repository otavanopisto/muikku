import * as React from "react";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { useTranslation } from "react-i18next";
import { saveLanguageProfile } from "~/actions/main-function/language-profile";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";

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
  const dispatch = useDispatch();
  const { languageProfile, status } = useSelector((state: StateType) => state);

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

  const handleSave = () => {
    dispatch(saveLanguageProfile(status.userId, languageProfile.data));
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
      {isLastStep && (
        <Button onClick={handleSave} buttonModifiers={["execute"]}>
          {t("actions.save", { ns: "common" })}
        </Button>
      )}
    </>
  );
};

export default InitializationFooter;
