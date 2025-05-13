import * as React from "react";
import Button from "~/components/general/button";
import NewLanguageSample from "./new_sample";
import { useDispatch } from "react-redux";
import { ActionType } from "~/actions";
import { LanguageCode } from "~/@types/shared";
import { LanguageProfileLanguage } from "~/reducers/main-function/language-profile";
import { LanguageProfileSample } from "~/generated/client";
import Sample from "./sample";

export type SampleTypes = "TEXT" | "FILE" | "AUDIO" | "";

interface LanguageComponentProps {
  samples: LanguageProfileSample[];
  language: LanguageProfileLanguage;
  samplesToRemove: number[];
  setSamplesToRemove: (samples: number[]) => void;
  changed: number[];
  setChanged: (samples: number[]) => void;
}

const LanguageComponent = (props: LanguageComponentProps) => {
  const {
    samples,
    language,
    samplesToRemove,
    setSamplesToRemove,
    changed,
    setChanged,
  } = props;

  const [sampleType, setSampleType] = React.useState<SampleTypes>("");
  const dispatch = useDispatch();

  // const languageSamples =
  //   samples && samples.filter((sample) => sample.language === language.code);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFieldChange = (
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
    }, 300); // 300ms debounce time
  };

  const handleToggleDelete = (id: number) => {
    if (samplesToRemove.some((sample) => sample === id)) {
      setSamplesToRemove(samplesToRemove.filter((sample) => sample !== id));
    } else {
      setSamplesToRemove([...samplesToRemove, id]);
    }
  };

  return (
    <div
      key={language.code + "-" + "sample"}
      className="language-profile__language-sample-item"
    >
      <div>
        <h2>{language.name}</h2>
        <div>
          <Button onClick={() => setSampleType("TEXT")}>
            Tekstimuotoinen näyte
          </Button>
          <Button onClick={() => setSampleType("FILE")}>
            Tiedostomuotoinen näyte
          </Button>
          <Button onClick={() => setSampleType("AUDIO")}>Ääninäyte</Button>
        </div>
      </div>

      <NewLanguageSample
        visible={sampleType !== ""}
        sampleType={sampleType}
        onClose={() => setSampleType("")}
        language={language.code as LanguageCode}
      />
      {samples &&
        samples
          .filter((sample) => sample.language === language.code)
          .map((sample) => (
            <Sample
              key={sample.id}
              sample={sample}
              taggedForRemoval={samplesToRemove.some(
                (sampleId) => sampleId === sample.id
              )}
              onChange={handleFieldChange}
              onDelete={handleToggleDelete}
            />
          ))}
    </div>
  );
};

export default LanguageComponent;
