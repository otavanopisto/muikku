import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { LanguageCode } from "~/@types/shared";
import {
  saveLanguageSamples,
  deleteLanguageSamples,
} from "~/actions/main-function/language-profile";
import { LanguageProfileSample } from "~/generated/client";
import NewLanguageSample from "./languages/new_sample";
import Sample from "./languages/sample";
/**
 * initializationProps
 */
interface LanguageSampleProps {}

const LanguageSample = (props: LanguageSampleProps) => {
  const { t } = useTranslation("languageProfile");

  const { status, languageProfile } = useSelector((state: StateType) => state);
  const [samplesToRmove, setSamplesToRemove] = React.useState<number[]>([]);
  const [changed, setChanged] = React.useState<number[]>([]);
  const { languages, samples } = languageProfile.data;
  const dispatch = useDispatch();
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
        setChanged((prev) => [...prev, sample.id]);
      }
      dispatch({
        type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
        payload: newSample,
      } as ActionType);
    }, 300); // 300ms debounce time
  };

  const handleSave = () => {
    const samplesToSave = samples.filter((sample) =>
      changed.some((changed) => changed === sample.id)
    );
    if (samplesToSave.length > 0) {
      dispatch(saveLanguageSamples(status.userId, samplesToSave));
    }
    if (samplesToRmove.length > 0) {
      dispatch(deleteLanguageSamples(status.userId, samplesToRmove));
    }
    setSamplesToRemove([]);
    setChanged([]);
  };

  const handleToggleDelete = (id: number) => {
    if (samplesToRmove.some((sample) => sample === id)) {
      setSamplesToRemove((prev) => prev.filter((sample) => sample !== id));
    } else {
      setSamplesToRemove((prev) => [...prev, id]);
    }
  };

  return (
    <div className="language-profile__language-sample">
      <h2>Kielinäytteet</h2>
      <div>
        Phasellus pretium elit nec elit dictum tincidunt. Vestibulum hendrerit
        nec urna id sollicitudin. Vestibulum viverra leo ut orci consectetur
        aliquam. Cras cursus risus mauris, et aliquet massa efficitur eu. Nunc
        non tempor neque, nec pulvinar purus. Sed lacinia purus porta, vulputate
        massa quis, accumsan ante. Ut sagittis odio id nisl sagittis, eget
        mollis diam placerat. Phasellus mollis neque et felis tempor imperdiet.
      </div>
      <form>
        {languages.map((language) => {
          const languageSamples =
            samples &&
            samples.filter((sample) => sample.language === language.code);
          return (
            <div
              key={language.code + "-" + "sample"}
              className="language-profile__language-sample-item"
            >
              <label htmlFor="languageSample">{language.name}</label>
              <NewLanguageSample
                visible={true}
                language={language.code as LanguageCode}
              />
              {languageSamples &&
                languageSamples.map((sample) => (
                  <Sample
                    key={sample.id}
                    sample={sample}
                    taggedForRemoval={samplesToRmove.some(
                      (sampleId) => sampleId === sample.id
                    )}
                    onChange={handleFieldChange}
                    onDelete={handleToggleDelete}
                  />
                ))}
            </div>
          );
        })}
      </form>
      <footer className="language-profile__footer">
        <Button onClick={() => handleSave()}>
          {t("actions.save", { ns: "common" })}
        </Button>
      </footer>
    </div>
  );
};

export default LanguageSample;
