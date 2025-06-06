import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  saveLanguageSamples,
  deleteLanguageSamples,
} from "~/actions/main-function/language-profile";
import Language from "./languages/language";

/**
 * initializationProps
 */
interface LanguageSampleProps {}

/**
 * LanguageSample component
 * This component displays language samples for the user's language profile.
 * It allows users to add, edit, and delete language samples.
 * @param props LanguageSampleProps
 * @returns JSX.Element
 */
const LanguageSample = (props: LanguageSampleProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const { status, languageProfile } = useSelector((state: StateType) => state);
  const [changed, setChanged] = React.useState<number[]>([]);
  const [samplesToRemove, setSamplesToRemove] = React.useState<number[]>([]);
  const { languages, samples } = languageProfile.data;
  const dispatch = useDispatch();

  /**
   * Save handler
   */
  const handleSave = () => {
    const samplesToSave = samples.filter((sample) =>
      changed.some((changed) => changed === sample.id)
    );
    if (samplesToSave.length > 0) {
      dispatch(saveLanguageSamples(status.userId, samplesToSave));
    }
    if (samplesToRemove.length > 0) {
      dispatch(deleteLanguageSamples(status.userId, samplesToRemove));
    }
    setSamplesToRemove([]);
    setChanged([]);
  };

  return (
    <div className="hops-form">
      <div className="hops-form__container">
        <div className="language-profile-container">
          <fieldset className="language-profile-container__fieldset">
            <legend className="language-profile-container__subheader">
              {t("labels.languageSamplesStepTitle", {
                ns: "languageProfile",
              })}
            </legend>
            <div className="language-profile-container__fieldset-description">
              {t("content.languageSamplesStepDescription", {
                ns: "languageProfile",
              })}
            </div>
          </fieldset>
          {languages.map((language) => (
            <Language
              key={language.code}
              samples={samples}
              language={language}
              samplesToRemove={samplesToRemove}
              setSamplesToRemove={setSamplesToRemove}
              changed={changed}
              setChanged={setChanged}
            />
          ))}
          <footer className="language-profile__footer">
            <Button onClick={() => handleSave()}>
              {t("actions.save", { ns: "common" })}
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LanguageSample;
