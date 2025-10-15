import * as React from "react";
import Button from "~/components/general/button";
import { useWizardContext } from "~/components/general/wizard/context/wizard-context";
import { useTranslation } from "react-i18next";
import { saveLanguageProfile } from "~/actions/main-function/language-profile";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import { useLanguageProfileContext } from "~/components/language-profile/body/application";

/**
 * PedagogyFormWizardFooter
 */
interface PedagogyFormWizardFooterProps {
  canSave?: boolean;
}

/**
 * PedagogyFormWizardFooter
 *
 * @param props props
 * @returns JSX.Element
 */
const InitializationFooter = (props: PedagogyFormWizardFooterProps) => {
  const { canSave = false } = props;
  const { t } = useTranslation(["common"]);
  const { previous, next, isFirstStep, isLastStep } = useWizardContext();
  const dispatch = useDispatch();
  const { languageProfile, status } = useSelector((state: StateType) => state);
  const [saveDisabled, setSaveDisabled] = React.useState(canSave);
  const { setInitializationUnsavedChanges } = useLanguageProfileContext();

  /**
   * handleNextStep
   * Handles the action for the next step in the wizard.
   * Calls the next function from the wizard context and enables the save button by setting SaveDisabled to false.
   * Enables the save button to allow saving changes made in previous steps.
   */
  const handleNextStep = () => {
    next();
    setSaveDisabled(false);
  };

  /**
   * handlePreviousStep
   * Handles the action for the previous step in the wizard.
   * Calls the previous function from the wizard context and enables the save button by setting SaveDisabled to false.
   * Enables the save button to allow saving changes made in previous steps.
   */
  const handlePreviousStep = () => {
    previous();
    setSaveDisabled(false);
  };

  /**
   * handleSave
   * Saves the language profile data to the store.
   * Dispatches the saveLanguageProfile action with userId and languageProfile data.
   * sets SaveDisabled to true after saving to prevent multiple saves.
   */
  const handleSave = () => {
    dispatch(
      saveLanguageProfile(status.userId, languageProfile.data, () =>
        setSaveDisabled(true)
      )
    );
    setInitializationUnsavedChanges(false);
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
        <Button
          onClick={handleSave}
          buttonModifiers={["execute"]}
          disabled={saveDisabled}
        >
          {t("actions.save", { ns: "common" })}
        </Button>
      )}
    </>
  );
};

export default InitializationFooter;
