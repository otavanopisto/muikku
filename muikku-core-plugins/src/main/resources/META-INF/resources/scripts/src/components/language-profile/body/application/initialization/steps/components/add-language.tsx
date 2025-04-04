import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/language-profile.scss";
import { availableLanguages } from "~/mock/mock-data";
import { ActionType } from "~/actions";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { filterMatch } from "~/util/modifiers";
import { Language } from "~/@types/shared";

const AddLanguage = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState<string>("");
  const [active, setActive] = React.useState<boolean>(false);

  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );
  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * handleAddLanguage
   * @param language the language to add
   */
  const handleLanguage = (language: Language) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
    setActive(false);
  };

  /**
   * filterLanguages
   * @param value the value to filter the languages
   */
  const handleFieldChange = (value: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setFilter(value);
    }, 400);
  };

  const toggleDropdown = (visible: boolean) => {
    setActive(visible);
  };

  return (
    <div className="language-profile__add-language">
      <input
        className="language-profile__filter-input form-element__input form-element__input--search"
        type="text"
        placeholder="TODO: Add a language"
        onFocus={() => toggleDropdown(true)}
        onChange={(e) => handleFieldChange(e.target.value)}
      />
      {active && filter && (
        <div className="language-profile__language-dropdown">
          {availableLanguages
            .filter((language) => filterMatch(language.name, filter))
            .filter(
              (language) =>
                !languages.some((lang) => lang.code === language.code)
            )
            .map((language) => (
              <div
                key={language.code}
                className="language-profile__dropdown-item"
                onClick={() => handleLanguage(language)}
              >
                {language.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AddLanguage;
