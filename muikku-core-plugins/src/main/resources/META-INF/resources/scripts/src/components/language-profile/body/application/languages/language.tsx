import * as React from "react";
import Button from "~/components/general/button";
import NewLanguageSample from "./new-sample";
import { LanguageCode } from "~/@types/shared";
import { LanguageProfileLanguage } from "~/reducers/main-function/language-profile";
import { LanguageProfileSample } from "~/generated/client";
import Sample from "./sample";
import { useTranslation } from "react-i18next";

export type SampleTypes = "TEXT" | "FILE" | "AUDIO" | "";

/**
 * Props for the LanguageComponent.
 */
interface LanguageComponentProps {
  samples: LanguageProfileSample[];
  language: LanguageProfileLanguage;
  changed: number[];
  setChanged: (samples: number[]) => void;
}

/**
 * LanguageComponent
 * @param props props
 * @returns JSX.Element
 */
const LanguageComponent = (props: LanguageComponentProps) => {
  const { t } = useTranslation(["languageProfile"]);
  const { samples, language } = props;
  const [sampleType, setSampleType] = React.useState<SampleTypes>("");
  const filteredSamples = React.useMemo(
    () => samples?.filter((sample) => sample.language === language.code),
    [samples, language.code]
  );
  return (
    <fieldset className="language-profile-container__fieldset">
      <legend className="language-profile-container__subheader">
        {language.name}
      </legend>
      <div className="language-profile-container__row language-profile-container__row--buttons">
        <Button
          buttonModifiers={["button-has-icon", "add-extra-row"]}
          onClick={() => setSampleType("TEXT")}
          icon="plus"
        >
          {t("actions.addSample", {
            ns: "languageProfile",
            context: "text",
          })}
        </Button>
        <Button
          buttonModifiers={["button-has-icon", "add-extra-row"]}
          onClick={() => setSampleType("FILE")}
          icon="plus"
        >
          {t("actions.addSample", {
            ns: "languageProfile",
            context: "file",
          })}
        </Button>
        <Button
          buttonModifiers={["button-has-icon", "add-extra-row"]}
          onClick={() => setSampleType("AUDIO")}
          icon="plus"
        >
          {t("actions.addSample", {
            ns: "languageProfile",
            context: "audio",
          })}
        </Button>
      </div>

      <NewLanguageSample
        visible={sampleType !== ""}
        sampleType={sampleType}
        onClose={() => setSampleType("")}
        language={language.code as LanguageCode}
      />
      {filteredSamples &&
        filteredSamples.map((sample) => (
          <Sample key={sample.id} sample={sample} candDelete={true} />
        ))}
    </fieldset>
  );
};

export default LanguageComponent;
