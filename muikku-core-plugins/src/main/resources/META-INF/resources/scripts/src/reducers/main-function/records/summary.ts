import { ActionType } from "actions";
import { WorkspaceListType, ActivityLogType } from "~/reducers/workspaces";
import { Reducer } from "redux";

export type SummaryStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type SummaryWorkspaceListType = WorkspaceListType;

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
 * SummaryStudentsGuidanceCouncelorsType
 */
export interface SummaryStudentsGuidanceCouncelorsType {
  firstName: string;
  lastName: string;
  email: string;
  userEntityId: number;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  hasImage: boolean;
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
  studentsDetails: SummarStudentDetails;
  studentsGuidanceCouncelors: SummaryStudentsGuidanceCouncelorsType[];
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
  activity: ActivityLogType[];
  workspaces: WorkspaceListType;
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

/**
 * summary
 * @param state state
 * @param action action
 */
/* export default function summary(
  state: SummaryType = {
    status: "WAIT",
    data: null,
  },
  action: ActionType
): SummaryType {
  if (action.type === "UPDATE_STUDIES_SUMMARY_STATUS") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "UPDATE_STUDIES_SUMMARY") {
    return Object.assign({}, state, {
      data: action.payload,
    });
  }
  return state;
} */
