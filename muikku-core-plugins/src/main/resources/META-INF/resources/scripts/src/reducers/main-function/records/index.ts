import { UserWithSchoolDataType, UserFileType } from "~/reducers/user-index";
import { WorkspaceType } from "~/reducers/workspaces";
import { ActionType } from "actions";
import { WorkspaceCurriculumFilterListType, WorkspaceJournalListType, MaterialContentNodeListType } from "~/reducers/workspaces";

export interface TransferCreditType {
  assessorIdentifier: string,
  courseName: string,
  courseNumber: number,
  curriculumIdentifier: string,
  date: string,
  gradeIdentifier: string,
  gradingScaleIdentifier: string,
  grade: string,
  gradingScale: string,
  passed: boolean,
  identifier: string,
  length: number,
  lengthUnitIdentifier: string,
  schoolIdentifier: string,
  studentIdentifier: string,
  subjectIdentifier: string,
  verbalAssessment: string
}

export type RecordGroupType = {
  groupCurriculumIdentifier?: string,
  workspaces: Array<WorkspaceType>,
  transferCredits: Array<TransferCreditType>
}

export type RecordsOrderedType = Array<RecordGroupType>

export type AllStudentUsersDataType = Array<{
  user: UserWithSchoolDataType,
  records: RecordsOrderedType
}>

export interface GradingScaleInfoType {
  scale: string,
  grade: string,
  passing: boolean
}

export interface RecordsGradesType {
  [key: string]: GradingScaleInfoType
}

export interface CurrentRecordType {
  workspace: WorkspaceType,
  journals: WorkspaceJournalListType,
  materials: MaterialContentNodeListType
}

export type AllStudentUsersDataStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type CurrentStudentUserAndWorkspaceStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface RecordsType {
  userData: AllStudentUsersDataType,
  userDataStatus: AllStudentUsersDataStatusType,
  studyStartDate: string, // Date of when studies have started
  studyTimeEnd: string, // Date of when right to study ends
  studyEndDate: string, // Date of when studies have ended
  grades: RecordsGradesType,
  files: Array<UserFileType>,
  currentStatus: CurrentStudentUserAndWorkspaceStatusType,
  current?: CurrentRecordType,
  location?: TranscriptOfRecordLocationType,
  curriculums: WorkspaceCurriculumFilterListType
}

export type TranscriptOfRecordLocationType = "records" | "hops" | "vops" | "summary" | "yo" | "info";

export default function records(state: RecordsType = {
  userData: [],
  userDataStatus: "WAIT",
  location: null,
  files: (window as any).FILES,
  grades: (window as any).GRADES,
  studyStartDate: (window as any).STUDY_START_DATE || null,
  studyTimeEnd: (window as any).STUDY_TIME_END || null,
  studyEndDate: (window as any).STUDY_END_DATE || null,
  current: null,
  currentStatus: "WAIT",
  curriculums: []
}, action: ActionType): RecordsType {
  if (action.type === "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA") {
    return Object.assign({}, state, {
      userData: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS") {
    return Object.assign({}, state, {
      userDataStatus: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_LOCATION") {
    return Object.assign({}, state, {
      location: action.payload
    });
  } else if (action.type === "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS") {
    return Object.assign({}, state, {
      curriculums: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS") {
    return Object.assign({}, state, {
      currentStatus: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE") {
    return Object.assign({}, state, {
      current: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_SET_FILES") {
    return Object.assign({}, state, {
      files: action.payload
    });
  }
  return state;
}
