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
  const { t } = useTranslation("languageProfile");
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
    <div className="language-profile__language-sample">
      <h1>Kielinäytteet</h1>
      <div>
        Phasellus pretium elit nec elit dictum tincidunt. Vestibulum hendrerit
        nec urna id sollicitudin. Vestibulum viverra leo ut orci consectetur
        aliquam. Cras cursus risus mauris, et aliquet massa efficitur eu. Nunc
        non tempor neque, nec pulvinar purus. Sed lacinia purus porta, vulputate
        massa quis, accumsan ante. Ut sagittis odio id nisl sagittis, eget
        mollis diam placerat. Phasellus mollis neque et felis tempor imperdiet.
      </div>
      <form>
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
