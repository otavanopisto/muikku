import { ActionType } from "actions";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { Reducer } from "redux";
import {
  ActivityLogEntry,
  CourseMatrix,
  OptionalCourseSuggestion,
  StudentCourseChoice,
  UserWithSchoolData,
} from "~/generated/client";
import { StudentActivityByStatus } from "~/@types/shared";

export type SummaryStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * SummaryStudyTime
 */
export interface SummaryStudyTime {
  studyStartDate: string;
  studyTimeEnd: string;
  studyEndDate: string;
}

/**
 * SummaryStudyProgress
 */
export interface SummaryStudyProgress extends StudentActivityByStatus {
  studentChoices: StudentCourseChoice[];
  supervisorOptionalSuggestions: OptionalCourseSuggestion[];
  options: string[];
  courseMatrix: CourseMatrix;
}

/**
 * SummaryDataType
 */
export interface SummaryDataType {
  eligibilityStatus: number;
  activity: number;
  returnedExercises: number;
  graphData: GraphDataType;
  coursesDone: number;
  studentsDetails: UserWithSchoolData;
  studyProgress: SummaryStudyProgress;
}

/**
 * SummaryType
 */
export interface SummaryType {
  data: SummaryDataType;
  status: SummaryStatusType;
}

/**
 * GraphDataType
 */
export interface GraphDataType {
  activity: ActivityLogEntry[];
  workspaces: WorkspaceDataType[];
}

/**
 * initialState
 */
export const initialState: SummaryType = {
  status: "WAIT",
  data: null,
};

/**
 * summaryReducer
 * @param state state
 * @param action action
 * @returns State of sumary
 */
export const summary: Reducer<SummaryType> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDIES_SUMMARY_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "UPDATE_STUDIES_SUMMARY":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};
