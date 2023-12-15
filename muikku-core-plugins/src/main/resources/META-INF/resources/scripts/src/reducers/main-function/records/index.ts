import { UserFileType } from "~/reducers/user-index";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { ActionType } from "actions";
import { Reducer } from "redux";
import { MaterialCompositeReply, Curriculum } from "~/generated/client";
import { WorkspaceJournal } from "~/generated/client";
import { RecordWorkspaceActivitiesWithLineCategory } from "~/components/general/records-history/types";

export type RecordWorkspaceState = "GRADED" | "UNGRADED" | "UNASSESSED";

/**
 * CurrentRecordType
 */
export interface CurrentRecordType {
  workspace: WorkspaceDataType;
  materials: MaterialContentNodeWithIdAndLogic[];
  compositeReplies: MaterialCompositeReply[];
  journals: WorkspaceJournal[];
}

export type AllStudentUsersDataStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";
export type CurrentStudentUserAndWorkspaceStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";

/**
 * RecordsType
 */
export interface RecordsType {
  userData: RecordWorkspaceActivitiesWithLineCategory[];
  userDataStatus: AllStudentUsersDataStatusType;
  files: Array<UserFileType>;
  currentStatus: CurrentStudentUserAndWorkspaceStatusType;
  current?: CurrentRecordType;
  location?: TranscriptOfRecordLocationType;
  curriculums: Curriculum[];
}

export type TranscriptOfRecordLocationType =
  | "records"
  | "hops"
  | "vops"
  | "summary"
  | "yo"
  | "info"
  | "pedagogy-form";

/**
 * initialState
 */
const initialState: RecordsType = {
  userData: [],
  userDataStatus: "WAIT",
  location: null,
  files: null,
  current: null,
  currentStatus: "WAIT",
  curriculums: [],
};

/**
 * Reducer function for records
 *
 * @param state state
 * @param action action
 * @returns State of evaluation
 */
export const records: Reducer<RecordsType> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA":
      return { ...state, userData: action.payload };

    case "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS":
      return { ...state, userDataStatus: action.payload };

    case "UPDATE_RECORDS_LOCATION":
      return { ...state, location: action.payload };

    case "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS":
      return { ...state, curriculums: action.payload };

    case "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS":
      return { ...state, currentStatus: action.payload };

    case "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE":
      return { ...state, current: action.payload };

    case "UPDATE_RECORDS_SET_FILES":
      return { ...state, files: action.payload };

    default:
      return state;
  }
};
