import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { ActionType } from "~/actions";
import { Language } from "~/@types/shared";
import AddLanguage from "./components/add-language";
import DisplayLanguages from "./components/display-languages";

// Conponent that uses useReducer to handle internal state where you set the languages you can speak
// and the languages you can understand the languages are in rows and you can add a new row
// then there are the areas of skills, which you must describe in your own wors as a radio button field
// the areas are, spelling, vocablary, grammar and variants
// the radio button values are "native", "excellent", "good", "satisfactory", "beginner" - by the addde language

const LanguageUsage = () => {
  // const { t } = useTranslation("languageProfile");
  // const context = React.useContext(InitializationContext);

  const dispatch = useDispatch();
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
        type: "UPDATE_LANGUAGE_PROFILE_VALUES",
        payload: { [field]: value },
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

  const removeLanguage = (language: Language) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
  };

  return (
    <div>
      <h1>Kielten käyttäminen ja opiskeleminen</h1>
      <p>
        Etiam quis nulla venenatis, pellentesque augue a, sodales urna. Fusce
        velit risus, pretium a consequat ut, interdum in orci. Nam at odio sed
        ante auctor condimentum. Nunc consectetur arcu ac dui porttitor pretium.
        Nullam libero felis, suscipit ac erat vitae, imperdiet interdum dui. In
        tincidunt et quam eu ultricies. Vivamus condimentum eget magna vel
        vulputate. Duis luctus eros at felis tincidunt lobortis. Pellentesque
        posuere enim eu mauris faucibus, nec pretium tortor tincidunt. Nullam
        sed egestas nibh, quis ultricies lorem. Sed non sodales justo. Praesent
        interdum, neque vitae luctus ultricies, massa nibh congue est, quis
        accumsan velit odio sed elit.
      </p>
      <form>
        <div>
          <h2>Kielet</h2>
          <DisplayLanguages onItemClick={removeLanguage} />
          <AddLanguage />
        </div>
        <div>
          <h2>Kielten käyttäminen</h2>
          <textarea
            id="languageUsage"
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "languageUsage")}
          />
        </div>
        <div>
          <h2>Motivaatio opiskelussa</h2>
          <textarea
            id="studyMotivation"
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "studyMotivation")}
          />
        </div>
        <div>
          <h2>Kielten oppimien</h2>
          <textarea
            id="messageForTeacher"
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "languageLearning")}
          />
        </div>
      </form>
    </div>
  );
};

export default LanguageUsage;
