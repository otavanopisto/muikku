import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import SkillLevel from "./cv/skill-level";
import { saveLanguageProfile } from "~/actions/main-function/language-profile";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * LanguageCv component
 * @returns JSX.Element
 */
const LanguageCv = () => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const { languageProfile, status } = useSelector((state: StateType) => state);
  const { languages, cv } = languageProfile.data;

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   *
   * @param e React.ChangeEvent<HTMLTextAreaElement>
   */
  const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Get the current value
    const value = e.target.value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      dispatch({
        type: "UPDATE_LANGUAGE_PROFILE_CV_GENERAL",
        payload: value,
      } as ActionType);
    }, 300); // 300ms debounce time
  };

  // Clean up the timeout when the component unmounts
  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  /**
   * handleSave
   * Handles the save action for the language profile.
   */
  const handleSave = () => {
    dispatch(saveLanguageProfile(status.userId, languageProfile.data));
  };

  return (
    <div>
      <h1>Kieli cv</h1>
      <form>
        <div>
          <h2>Yleistä</h2>
          <textarea
            id="cv"
            defaultValue={cv.general || ""}
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e)}
          />
          {languages.map((language) => (
            <SkillLevel key={language.code} language={language} />
          ))}
        </div>
        <div>
          <Button onClick={handleSave} buttonModifiers={["info"]}>
            Tallenna
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LanguageCv;
