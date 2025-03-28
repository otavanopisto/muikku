import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState } from "~/@types/shared";
import { Language } from "~/@types/shared";

export type LanguageProfileData = {
  languageUsage: string;
  studyMotivation: string;
  languageLearning: string;
  languages: Language[];
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

    default:
      return state;
  }
};
