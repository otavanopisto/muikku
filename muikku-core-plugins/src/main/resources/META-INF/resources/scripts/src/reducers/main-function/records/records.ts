import { UserWithSchoolDataType } from "~/reducers/main-function/user-index";
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

export type RecordType = {
    groupCurriculumIdentifier?: string,
    records: Array<{
      type: "workspace" | "transferCredit",
      value: WorkspaceType | TransferCreditType
    }>
}

export type RecordsOrderedType = Array<RecordType>

export type AllStudentUsersData = Array<{
  user: UserWithSchoolDataType,
  workspaces: RecordsOrderedType
}>

export interface Records {
  userData: AllStudentUsersData
}

export default function records(state: Records={
    userData: []
}, action: ActionType): Records {
  if (action.type === "UPDATE_ALL_STUDENT_USERS_DATA"){
    return Object.assign({}, state, {
      userData: action.payload
    });
  }
  return state;
}