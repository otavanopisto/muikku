import * as React from "react";
import Button from "~/components/general/button";
import NewLanguageSample from "./new-sample";
import { useDispatch } from "react-redux";
import { ActionType } from "~/actions";
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
  samplesToRemove: number[];
  setSamplesToRemove: (samples: number[]) => void;
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
  const {
    samples,
    language,
    samplesToRemove,
    setSamplesToRemove,
    changed,
    setChanged,
  } = props;
  const [filteredSamples, setFilteredSamples] =
    React.useState<LanguageProfileSample[]>(samples);
  const [sampleType, setSampleType] = React.useState<SampleTypes>("");
  const dispatch = useDispatch();

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (samples) {
      setFilteredSamples(
        samples.filter((sample) => sample.language === language.code)
      );
    }
  }, [samples, language.code]);

  /**
   * handleFieldChange
   * Handles changes in the text area for text samples.
   * Updates the sample state with the new value.
   */
  const handleFieldChange = React.useCallback(
    (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      sample: LanguageProfileSample
    ) => {
      // Get the current value
      const newSample = { ...sample };
      newSample.value = e.target.value;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        if (sample.id && !changed.some((changed) => changed === sample.id)) {
          setChanged([...changed, sample.id]);
        }

        dispatch({
          type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
          payload: newSample,
        } as ActionType);
      }, 1000); // 1000ms debounce time
    },
    [dispatch, changed, setChanged]
  );

  // Clean up the timeout when the component unmounts
  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return (
    <fieldset
      className="language-profile-container__fieldset"
      key={language.code + "-" + "sample"}
    >
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
          <Sample
            key={sample.id}
            sample={sample}
            taggedForRemoval={samplesToRemove.some(
              (sampleId) => sampleId === sample.id
            )}
            onChange={handleFieldChange}
          />
        ))}
    </fieldset>
  );
};

export default LanguageComponent;
