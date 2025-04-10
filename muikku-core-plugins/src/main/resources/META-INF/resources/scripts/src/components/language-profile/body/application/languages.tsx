import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { LanguageData } from "~/@types/shared";
/**
 * initializationProps
 */
interface LanguageSampleProps {}

const LanguageSample = (props: LanguageSampleProps) => {
  const { t } = useTranslation("languageProfile");
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );
  const dispatch = useDispatch();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof LanguageProfileData
  ) => {
    // Get the current value
    const value = e.target.value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      dispatch({
        type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLES",
        payload: { [field]: value },
      } as ActionType);
    }, 300); // 300ms debounce time
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
        {languages.map((language) => (
          <div
            key={language.code + "-" + "sample"}
            className="language-profile__language-sample-item"
          >
            <label htmlFor="languageSample">{language.name}</label>
            <textarea
              id="languageSample"
              className="form-element__textarea"
              onChange={(e) => handleFieldChange(e, language.code)}
            />
          </div>
        ))}
      </form>
      <footer className="language-profile__footer">
        <Button onClick={() => console.log("Save")} buttonModifiers={["info"]}>
          {t("actions.save", { ns: "common" })}
        </Button>
      </footer>
    </div>
  );
};

export default LanguageSample;
