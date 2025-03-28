import * as React from "react";
import { availableLanguages } from "~/mock/mock-data";
import { ActionType } from "~/actions";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const handleAddLanguage = (language: Language) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
  };

  /**
   * filterLanguages
   * @param value the value to filter the languages
   * @returns a filtered list of languages based on the input
   */
  const filterLanguages = (value: string) =>
    availableLanguages.filter((language) =>
      language.name.toLowerCase().includes(value.toLowerCase())
    );

  return (
    <input
      type="text"
      placeholder="Add a language"
      onChange={(e) => filterLanguages(e.target.value)}
    />
  );
};
