import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState } from "~/@types/shared";
import { Language } from "~/@types/shared";

export type LanguageLevels =
  | "A11"
  | "A12"
  | "A13"
  | "A21"
  | "A22"
  | "B11"
  | "B12"
  | "B21"
  | "C11";

export type SkillLevels = "N" | "E" | "H" | "K" | "V";

export type LanguagesItem<T> = {
  [key: string]: T;
};

export interface LanguageProfileLanguage extends Language {
  levels: LanguagesItem<LanguageLevels>[];
  skills: LanguagesItem<SkillLevels>[];
}

export type LanguageProfileData = {
  languageUsage: string;
  studyMotivation: string;
  languageLearning: string;
  languages: LanguageProfileLanguage[];
};
/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface LanguageProfileState {
  data: LanguageProfileData;
  loading: LoadingState;
}

/**
 * initialUserGroupsState
 */
const initializeDependantState: LanguageProfileState = {
  data: {
    languageUsage: "",
    studyMotivation: "",
    languageLearning: "",
    languages: [],
  },
  loading: "WAITING",
};

/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const languageProfile: Reducer<LanguageProfileState> = (
  state = initializeDependantState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_LANGUAGE_PROFILE_VALUES":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };

    case "UPDATE_LANGUAGE_PROFILE_LANGUAGES": {
      const { payload } = action;
      const updatedLanguages = [...state.data.languages];
      // Check if the language already exists in the array
      const existingLanguageIndex = updatedLanguages.findIndex(
        (language) => language.code === payload.code
      );

      if (existingLanguageIndex !== -1) {
        // If it exists, remove from the array
        updatedLanguages.splice(existingLanguageIndex, 1);
      } else {
        updatedLanguages.push(payload);
      }

      return {
        ...state,
        data: { ...state.data, languages: updatedLanguages },
      };
    }
    case "UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS": {
      const { payload } = action;

      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      // Check if there are levels
      const currentLevels = currentLanguage.levels
        ? currentLanguage.levels
        : [];

      const levelIndex = currentLevels.findIndex((level) =>
        Object.keys(level).includes(payload.cellId)
      );

      if (levelIndex !== -1) {
        // If it exists, remove from the array
        currentLevels.splice(levelIndex, 1);
      }

      const updatedLanguage = {
        ...currentLanguage,
        levels: [...currentLevels, { [payload.cellId]: payload.value }],
      };

      languagesUpdate[languageIndex] = updatedLanguage;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    case "UPDATE_LANGUAGE_PROFILE_SKILLS": {
      const { payload } = action;

      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      // Check if there are levels
      const currentLevels = currentLanguage.levels
        ? currentLanguage.levels
        : [];

      const levelIndex = currentLevels.findIndex((level) =>
        Object.keys(level).includes(payload.cellId)
      );

      if (levelIndex !== -1) {
        // If it exists, remove from the array
        currentLevels.splice(levelIndex, 1);
      }

      const updatedLanguage = {
        ...currentLanguage,
        skills: [...currentLevels, { [payload.cellId]: payload.value }],
      };

      languagesUpdate[languageIndex] = updatedLanguage;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    default:
      return state;
  }
};
