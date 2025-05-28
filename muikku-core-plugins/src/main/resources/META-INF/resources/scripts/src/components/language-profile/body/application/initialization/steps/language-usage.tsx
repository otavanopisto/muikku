import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { ActionType } from "~/actions";
import { LanguageCode, LanguageData } from "~/@types/shared";
import AddLanguage from "./components/language-profile-add-item";
import LanguageProfileDataDisplayer from "./components/language-profile-data-displayer";
import { availableLanguages } from "~/mock/mock-data";

/**
 * LanguageUsage
 * This component allows users to manage their language usage, learning,
 * and motivation for studying languages.
 */
const LanguageUsage = () => {
  const dispatch = useDispatch();
  const {
    languages,
    languageUsage,
    languageLearning,
    studyMotivation,
    samples,
    cv,
  } = useSelector((state: StateType) => state.languageProfile.data);

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
    }, 500); // 500ms debounce time
  };

  /**
   * getLockedLanguages
   * Retrieves the languages that are locked and cannot be modified.
   * If there are submitted samples or existing languages in the CV,
   * the language removal is locked
   */
  const getLockedLanguages = () => {
    const lockedLanguageCodes: LanguageCode[] = [];
    if (samples && samples.length > 0) {
      samples.forEach((sample) =>
        lockedLanguageCodes.push(sample.language as LanguageCode)
      );
    }

    if (cv.languages) {
      cv.languages.forEach((language) =>
        lockedLanguageCodes.push(language.code as LanguageCode)
      );
    }
    return lockedLanguageCodes;
  };

  /**
   * handleAddLanguage
   * @param language the language to add
   */
  const handleLanguage = (language: LanguageData) => {
    if (getLockedLanguages().includes(language.code)) {
      return;
    }
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
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
          <LanguageProfileDataDisplayer
            rows={languages}
            disabledItems={getLockedLanguages()}
            onItemClick={handleLanguage}
          />
          <AddLanguage
            action={handleLanguage}
            filterBy="code"
            allItems={availableLanguages}
            selectedItems={languages}
          />
        </div>
        <div>
          <h2>Kielten käyttäminen</h2>
          <textarea
            id="languageUsage"
            defaultValue={languageUsage || ""}
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "languageUsage")}
          />
        </div>
        <div>
          <h2>Motivaatio opiskelussa</h2>
          <textarea
            id="studyMotivation"
            defaultValue={studyMotivation || ""}
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "studyMotivation")}
          />
        </div>
        <div>
          <h2>Kielten oppimien</h2>
          <textarea
            id="messageForTeacher"
            defaultValue={languageLearning || ""}
            className="form-element__textarea"
            onChange={(e) => handleFieldChange(e, "languageLearning")}
          />
        </div>
      </form>
    </div>
  );
};

export default LanguageUsage;
