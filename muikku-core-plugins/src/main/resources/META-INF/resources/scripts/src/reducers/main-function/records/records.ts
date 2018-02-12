import { UserWithSchoolDataType, UserFileType } from "~/reducers/main-function/user-index";
import { WorkspaceType } from "~/reducers/main-function/index/workspaces";
import { ActionType } from "actions";

export interface TransferCreditType {
  assessorIdentifier: string,
  courseName: string,
  courseNumber: number,
  curriculumIdentifier: string,
  date: string,
  gradeIdentifier: string,
  gradingScaleIdentifier: string,
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
    records: Array<{
      type: "workspace" | "transferCredit",
      value: WorkspaceType | TransferCreditType
    }>
}

export type RecordsOrderedType = Array<RecordGroupType>

export type AllStudentUsersDataType = Array<{
  user: UserWithSchoolDataType,
  workspaces: RecordsOrderedType
}>

export interface GradingScaleInfoType {
  scale: string,
  grade: string,
  passing: boolean
}

export interface RecordsGradesType {
  [key: string]: GradingScaleInfoType
}

export type AllStudentUsersDataStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface RecordsType {
  userData: AllStudentUsersDataType,
  userDataStatus: AllStudentUsersDataStatusType,
  studyStartDate: string,
  grades: RecordsGradesType,
  files: Array<UserFileType>,
  current: any,
  location?: TranscriptOfRecordLocationType
}

export type TranscriptOfRecordLocationType = "RECORDS" | "HOPS" | "VOPS";

export default function records(state: RecordsType={
    userData: [],
    userDataStatus: "WAIT",
    location: null,
    files: (window as any).FILES,
    grades: (window as any).GRADES,
    studyStartDate: (window as any).STUDY_START_DATE || null,
    current: null
}, action: ActionType): RecordsType {
  if (action.type === "UPDATE_ALL_STUDENT_USERS_DATA"){
    return Object.assign({}, state, {
      userData: action.payload
    });
  } else if (action.type === "UPDATE_ALL_STUDENT_USERS_DATA_STATUS"){
    return Object.assign({}, state, {
      userDataStatus: action.payload
    });
  } else if (action.type === "UPDATE_TRANSCRIPT_OF_RECORDS_LOCATION"){
    return Object.assign({}, state, {
      location: action.payload
    });
  }
  return state;
}