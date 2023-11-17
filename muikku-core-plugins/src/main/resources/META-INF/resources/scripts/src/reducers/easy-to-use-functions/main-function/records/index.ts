import { UserFileType } from "~/reducers/user-index";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { ActionType } from "actions";
import { Reducer } from "redux";
import {
  MaterialCompositeReply,
  Curriculum,
  WorkspaceAssessmentState,
} from "~/generated/client";
import { WorkspaceJournal } from "~/generated/client";

export type RecordWorkspaceState = "GRADED" | "UNGRADED" | "UNASSESSED";

/**
 * Subject data for record workspace activity
 */
export interface RecordWorkspaceActivitySubject {
  identifier?: string | null;
  subjectCode: string;
  subjectName: string;
  courseNumber?: number;
  courseLength: number;
  courseLengthSymbol: string;
}

/**
 * Record workspace curriculum that includes
 * curriculum identifier and curriculum name
 */
export interface RecordWorkspaceActivityCurriculum {
  identifier: string;
  name: string;
}

/**
 * RecordWorkspaceByLineCategory
 */
export interface RecordWorkspaceActivitiesWithLineCategory {
  lineCategory: string;
  credits: RecordWorkspaceActivityByLine[];
  transferCredits: RecordWorkspaceActivityByLine[];
}

/**
 * Record workspace activity with line name
 */
export interface RecordWorkspaceActivityByLine {
  lineName: string;
  activity: RecordWorkspaceActivity;
}

/**
 * Record workspace with activity data
 */
export interface RecordWorkspaceActivity {
  id: number;
  identifier: string;
  subjects: RecordWorkspaceActivitySubject[] | null;
  assessmentStates: WorkspaceAssessmentState[];
  name: string;
  curriculums: RecordWorkspaceActivityCurriculum[] | null;
  exercisesTotal?: number | null;
  exercisesAnswered?: number | null;
  evaluablesTotal?: number | null;
  evaluablesAnswered?: number | null;
}

/**
 * RecordGroupType
 */
export interface RecordGroupType {
  groupCurriculumName?: string;
  groupCurriculumIdentifier?: string;
  credits: RecordWorkspaceActivity[];
  transferCredits: RecordWorkspaceActivity[];
}

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
