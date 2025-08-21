import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
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
  const { languageProfile } = useSelector((state: StateType) => state);
  const [changed, setChanged] = React.useState<number[]>([]);
  const { languages, samples } = languageProfile.data;

  return (
    <div className="language-profile-form">
      <div className="language-profile-form__container">
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
              changed={changed}
              setChanged={setChanged}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSample;
