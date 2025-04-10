import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState, SaveState } from "~/@types/shared";
import { LanguageData } from "~/@types/shared";
import c from "~/components/base/input-contacts-autofill";

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

export type Subjects = "ÄI1" | "ÄI2" | "ÄI3";

export type LanguageItem<T> = {
  [key: string]: T;
};

export interface LanguageProfileLanguageData {
  levels: LanguageItem<LanguageLevels>[];
  skills: LanguageItem<SkillLevels>[];
  subjects: LanguageItem<Subjects>[];
}

export interface LanguageProfileLanguage
  extends LanguageProfileLanguageData,
    LanguageData {}

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
  saving: SaveState;
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
  saving: "PENDING",
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
    case "SET_LANGUAGE_PROFILE_LOADING_STATE": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case "SET_LANGUAGE_PROFILE_SAVING_STATE": {
      return {
        ...state,
        saving: action.payload,
      };
    }
    case "SET_LANGUAGE_PROFILE":
      return {
        ...state,
        data: action.payload,
      };

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

    case "UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS": {
      const { payload } = action;
      const skillPayload = { [payload.cellId]: payload.value };
      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      // Check if there are skills
      const skillsUpdate = currentLanguage.skills ? currentLanguage.skills : [];

      const skillIndex = skillsUpdate.findIndex((skill) =>
        Object.keys(skill).includes(payload.cellId)
      );

      if (skillIndex !== -1) {
        // If it exists, replace the existing skill
        skillsUpdate.splice(skillIndex, 1, skillPayload);
      } else {
        skillsUpdate.push(skillPayload);
      }

      const updatedSkills = {
        ...currentLanguage,
        skills: skillsUpdate,
      };

      languagesUpdate[languageIndex] = updatedSkills;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    case "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS": {
      const { payload } = action;
      const subjectPayload = { [payload.cellId]: payload.value };
      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      // Check if there are skills
      const subjectUpdate = currentLanguage.subjects
        ? currentLanguage.subjects
        : [];

      const subjectIndex = subjectUpdate.findIndex((skill) =>
        Object.keys(skill).includes(payload.cellId)
      );

      if (subjectIndex !== -1) {
        // If it exists, replace the existing skill
        subjectUpdate.splice(subjectIndex, 1, subjectPayload);
      } else {
        subjectUpdate.push(subjectPayload);
      }

      const updatedSubjects = {
        ...currentLanguage,
        subjects: subjectUpdate,
      };

      languagesUpdate[languageIndex] = updatedSubjects;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    default:
      return state;
  }
};
