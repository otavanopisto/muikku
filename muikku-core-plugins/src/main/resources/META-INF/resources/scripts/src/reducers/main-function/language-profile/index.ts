import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { LoadingState, SaveState } from "~/@types/shared";
import { LanguageData } from "~/@types/shared";
import { LanguageProfileSample } from "~/generated/client";
import { ALL_LANGUAGE_SUBJECTS } from "~/helper-functions/study-matrix";

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

export type Subjects = (typeof ALL_LANGUAGE_SUBJECTS)[number];

export type LanguageItem<T> = {
  [key: string]: T;
};

/**
 * LanguageProfileLanguageData
 */
export interface LanguageProfileLanguageData {
  levels: LanguageItem<LanguageLevels>[];
  skills: LanguageItem<SkillLevels>[];
  workspaces: LanguageData[];
}

export type SampleLink = {
  name: string;
  url: string;
};

/**
 * LanguageProfileLanguage
 */
export interface LanguageProfileLanguage
  extends LanguageProfileLanguageData,
    LanguageData {}

/**
 * Experience
 */
export interface Experience {
  interaction: number;
  vocal: number;
  writing: number;
  reading: number;
  listening: number;
  general: LanguageLevels;
}

/**
 * CVLanguage
 */
export interface CVLanguage {
  code: string;
  description: string;
  interaction: string;
  vocal: string;
  writing: string;
  reading: string;
  listening: string;
  general: LanguageLevels;
  samples: SampleLink[];
}

/**
 * LanguageProfileCV
 */
export interface LanguageProfileCV {
  general: string;
  languages: CVLanguage[];
}

export type LanguageProfileData = {
  languageUsage: string;
  studyMotivation: string;
  languageLearning: string;
  learningFactors: string;
  futureUsage: string;
  skillGoals: string;
  languages: LanguageProfileLanguage[];
  samples: LanguageProfileSample[];
  cv: LanguageProfileCV;
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
export const initializeLanguageProfileState: LanguageProfileState = {
  data: {
    languageUsage: "",
    studyMotivation: "",
    languageLearning: "",
    learningFactors: "",
    futureUsage: "",
    skillGoals: "",
    languages: [],
    samples: [],
    cv: {
      general: "",
      languages: [],
    },
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
  state = initializeLanguageProfileState,
  action: ActionType
) => {
  switch (action.type) {
    case "LANGUAGE_PROFILE_SET_LOADING_STATE": {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case "LANGUAGE_PROFILE_SET_SAVING_STATE": {
      return {
        ...state,
        saving: action.payload,
      };
    }

    // Probably not needed
    case "LANGUAGE_PROFILE_SET_PROFILE":
      return {
        ...state,
        data: action.payload,
      };

    case "LANGUAGE_PROFILE_UPDATE_VALUES":
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };

    case "LANGUAGE_PROFILE_UPDATE_LANGUAGES": {
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
    case "LANGUAGE_PROFILE_UPDATE_LANGUAGE_LEVELS": {
      const { payload } = action;

      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );

      if (languageIndex === -1) {
        return state;
      }

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

    case "LANGUAGE_PROFILE_UPDATE_SKILL_LEVELS": {
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

    case "LANGUAGE_PROFILE_ADD_LANGUAGE_WORKSPACE": {
      const { payload } = action;

      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      const workspacesUpdate = currentLanguage.workspaces
        ? currentLanguage.workspaces
        : [];

      // Check if the workspace already exists
      const workspaceIndex = workspacesUpdate.findIndex(
        (workspace) => workspace.identifier === payload.identifier
      );

      // If the workspace already exists, do not add it again
      if (workspaceIndex === -1) {
        workspacesUpdate.push(payload);
      }

      const updatedSubjects = {
        ...currentLanguage,
        workspaces: workspacesUpdate,
      };

      languagesUpdate[languageIndex] = updatedSubjects;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    case "LANGUAGE_PROFILE_UPDATE_LANGUAGE_WORKSPACE_VALUE": {
      const { payload } = action;

      const languagesUpdate = [...state.data.languages];
      // find the language to update
      const languageIndex = languagesUpdate.findIndex(
        (language) => language.code === payload.code
      );
      const currentLanguage = languagesUpdate[languageIndex];

      // Check if there are
      const workspaceUpdate = currentLanguage.workspaces
        ? currentLanguage.workspaces
        : [];

      const workspaceIndex = workspaceUpdate.findIndex(
        (workspace) => workspace.identifier === payload.identifier
      );

      if (workspaceIndex === -1) {
        return state;
      }

      workspaceUpdate[workspaceIndex] = {
        ...workspaceUpdate[workspaceIndex],
        value: payload.value,
      };

      const updatedWorkspaces = {
        ...currentLanguage,
        workspaces: workspaceUpdate,
      };

      languagesUpdate[languageIndex] = updatedWorkspaces;

      return {
        ...state,
        data: { ...state.data, languages: languagesUpdate },
      };
    }

    case "LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE": {
      const { payload } = action;

      return {
        ...state,
        data: {
          ...state.data,
          samples: [...state.data.samples, payload],
        },
      };
    }

    case "LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLE": {
      const { payload } = action;

      const samplesUpdate = [...state.data.samples];
      const sampleIndex = samplesUpdate.findIndex(
        (sample) => sample.id === payload.id
      );

      if (sampleIndex === -1) {
        return state;
      }

      samplesUpdate.splice(sampleIndex, 1, payload);

      return {
        ...state,
        data: {
          ...state.data,
          samples: samplesUpdate,
        },
      };
    }

    case "LANGUAGE_PROFILE_DELETE_LANGUAGE_SAMPLE": {
      const { payload } = action;
      const newSamples = [...state.data.samples];

      return {
        ...state,
        data: {
          ...state.data,
          samples: newSamples.filter(
            (sample) => sample.id !== payload.sampleId
          ),
        },
      };
    }

    case "LANGUAGE_PROFILE_UPDATE_CV_GENERAL": {
      const { payload } = action;
      const updatedCv = { ...state.data.cv, general: payload };

      return {
        ...state,
        data: { ...state.data, cv: updatedCv },
      };
    }

    case "LANGUAGE_PROFILE_UPDATE_CV_LANGUAGE": {
      const { payload } = action;
      const updatedCV = { ...state.data.cv };
      const updatedLanguages = [...updatedCV.languages];

      const languageIndex = updatedLanguages.findIndex(
        (language) => language.code === payload.code
      );

      if (languageIndex === -1) {
        // If the language doesn't exist, add it
        updatedLanguages.push(payload);
      } else {
        updatedLanguages[languageIndex] = payload;
      }

      updatedCV.languages = updatedLanguages;

      return {
        ...state,
        data: { ...state.data, cv: updatedCV },
      };
    }

    default:
      return state;
  }
};
