import {ActionType} from '~/actions';

export type WorkspaceAssessementState = "unassessed" | "pending" | "pending_pass" | "pending_fail" | "pass" | "fail" | "incomplete";

export interface WorkspaceStudentActivityType {
  assessmentState: {
    date: string,
    state: WorkspaceAssessementState,
    grade?: string
  },
  evaluablesAnswered: number,
  evaluablesAnsweredLastDate: string,
  evaluablesDonePercent: number,
  evaluablesFailed: number,
  evaluablesFailedLastDate?: string,
  evaluablesIncomplete: number,
  evaluablesIncompleteLastDate?: string,
  evaluablesPassed: number,
  evaluablesPassedLastDate?: string,
  evaluablesSubmitted: number,
  evaluablesSubmittedLastDate?: string,
  evaluablesTotal: number,
  evaluablesUnanswered: number,
  exercisesAnswered: number,
  exercisesAnsweredLastDate: string,
  exercisesDonePercent: number,
  exercisesTotal: number,
  exercisesUnanswered: number,
  journalEntryCount: number,
  lastJournalEntry?: string,
  lastVisit?: string,
  numVisits: number
}

export interface WorkspaceForumStatisticsType {
  messageCount: number,
  latestMessage: string //represents a date
}

//export interface WorkspaceStudentAssessmentType {
//  assessorEntityId: number,
//  evaluated: string,
//  gradeIdentifier: string,
//  gradeSchoolDataSource: string,
//  gradingScaleIdentifier: string,
//  gradingScaleSchoolDataSource: string,
//  identifier: string,
//  passed: boolean,
//  verbalAssessment: string,
//  workspaceStudentId: string
//}
//
//export interface WorkspaceStudentAssessmentsType {
//  assessmentState: WorkspaceAssessementState,
//  assessmentStateDate: string,
//  assessments: Array<WorkspaceStudentAssessmentType>
//}

export interface WorkspaceStudentAssessmentStateType {
  date: string,
  state: WorkspaceAssessementState,
  grade?: string,
  text?: string
}

export interface ActivityLogType {
  type: String,
  timestamp: String,
  contextId?: number
}

export interface WorkspaceType {
  access: string,
  archived: boolean,
  curriculumIdentifiers: Array<string>,
  description: string,
  hasCustomImage: boolean,
  id: number,
  lastVisit: string,
  materialDefaultLicense: string,
  name: string,
  nameExtension?: string | null,
  numVisits: number,
  published: boolean,
  subjectIdentifier: string | number,
  urlName: string,
  
  //These are optional addons, and are usually not available
  studentActivity?: WorkspaceStudentActivityType,
  forumStatistics?: WorkspaceForumStatisticsType,
  studentAssessmentState?: WorkspaceStudentAssessmentStateType,
      activityLogs?: ActivityLogType[]
}

export interface ShortWorkspaceType {
  workspaceName: string,
  materialName: string,
  url: string
}

export type WorkspaceListType = Array<WorkspaceType>;

export interface WorkspacesType {
  workspaces: WorkspaceListType,
  lastWorkspace?: ShortWorkspaceType
}

export default function workspaces(state: WorkspacesType={
  workspaces: [],
  lastWorkspace: null
}, action: ActionType): WorkspacesType {
  if (action.type === 'UPDATE_WORKSPACES'){
    return <WorkspacesType>Object.assign({}, state, {
      workspaces: action.payload
    });
  } else if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return Object.assign({}, state, {
      lastWorkspace: <ShortWorkspaceType>action.payload
    });
  }
  return state;
}