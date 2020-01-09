import { UserWithSchoolDataType, UserFileType } from "~/reducers/main-function/user-index";
import { WorkspaceType } from "~/reducers/main-function/workspaces";
import { ActionType } from "actions";
import { CourseCurriculumFilterListType } from "~/reducers/main-function/courses";

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

export interface JournalType {
  id: number,
  workspaceEntityId: number,
  userEntityId: number,
  firstName: string,
  lastName: string,
  content: string,
  title: string,
  created: string
}

export type JournalListType = Array<JournalType>;

export interface MaterialAssignmentType {
  id: number,
  materialId: number,
  parentId: number,
  nextSiblingId: number,
  hidden: boolean,
  assignmentType: string,
  correctAnswers: string,
  path: string,
  title: string
}

export interface MaterialType {
  id: number,
  title: string,
  licence: string,
  viewRestrict: string,
  html: string,
  contentType: string,
  currentRevision: number,
  publishedRevision: number,
  
  evaluation?: MaterialEvaluationType,
  assignment?: MaterialAssignmentType
}

export interface MaterialEvaluationType {
  id: number,
  evaluated: string,
  assessorEntityId: number,
  studentEntityId: number,
  workspaceMaterialId: number,
  gradingScaleIdentifier: string,
  gradingScaleSchoolDataSource: string,
  grade: string,
  gradeIdentifier: string,
  gradeSchoolDataSource: string,
  verbalAssessment: string,
  passed: boolean
}


export type MaterialListType = Array<MaterialType>;

export interface CurrentRecordType {
  workspace: WorkspaceType,
  journals: JournalListType,
  materials: MaterialListType
}

export type AllStudentUsersDataStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type CurrentStudentUserAndWorkspaceStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface RecordsType {
  userData: AllStudentUsersDataType,
  userDataStatus: AllStudentUsersDataStatusType,
  studyStartDate: string,
  studyTimeEnd: string,
  studyEndDate: string,
  grades: RecordsGradesType,
  files: Array<UserFileType>,
  currentStatus: CurrentStudentUserAndWorkspaceStatusType,
  current?: CurrentRecordType,
  location?: TranscriptOfRecordLocationType,
  curriculums: CourseCurriculumFilterListType
}

export type TranscriptOfRecordLocationType = "records" | "hops" | "vops" | "summary" | "yo" | "statistics"; 

export default function records(state: RecordsType={
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
  if (action.type === "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA"){
    return Object.assign({}, state, {
      userData: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS"){
    return Object.assign({}, state, {
      userDataStatus: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_LOCATION"){
    return Object.assign({}, state, {
      location: action.payload
    });
  } else if (action.type === "UPDATE_COURSES_AVALIABLE_FILTERS_CURRICULUMS"){
    return Object.assign({}, state, {
      curriculums: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS"){
    return Object.assign({}, state, {
      currentStatus: action.payload
    });
  } else if (action.type === "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE"){
    return Object.assign({}, state, {
      current: action.payload
    });
  }
  return state;
}