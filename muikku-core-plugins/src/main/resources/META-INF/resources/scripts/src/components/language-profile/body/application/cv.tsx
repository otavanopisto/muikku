import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { ActionType } from "~/actions";
import SkillLevel from "./cv/skill-level";

const LanguageCv = () => {
  const dispatch = useDispatch();
  const { languages, languageUsage, languageLearning, studyMotivation } =
    useSelector((state: StateType) => state.languageProfile.data);
  const { languageProfile } = useSelector((state: StateType) => state);

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced field change handler
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

  return (
    <div>
      <h1>Kieli cv</h1>
      <form>
        <div>
          <h2>Yleistä</h2>
          <textarea
            id="cv"
            defaultValue={languageUsage || ""}
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "languageUsage")}
          />
          {languages.map((language) => (
            <SkillLevel key={language.code} language={language} />
          ))}
        </div>
      </form>
    </div>
  );
};

export default LanguageCv;
