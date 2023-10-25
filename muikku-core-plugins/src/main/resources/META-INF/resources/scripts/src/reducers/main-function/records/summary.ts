import { ActionType } from "actions";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { Reducer } from "redux";
import { ActivityLogEntry, UserWithSchoolData } from "~/generated/client";

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
 * SummarStudentDetails
 */
export interface SummarStudentDetails extends SummaryStudyTime {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  studyProgrammeName: string;
  studyProgrammeIdentifier: string;
  hasImage: boolean;
  nationality: string | null;
  language: string | null;
  municipality: string | null;
  school: string | null;
  email: string | null;
  lastLogin: string;
  curriculumIdentifier: string | null;
  updatedByStudent: boolean;
  userEntityId: number;
  flags: any;
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
