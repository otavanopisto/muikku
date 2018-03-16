import {ActionType} from '~/actions';

export type WorkspaceAssesementState = "UNASSESSED" | "PENDING" | "PENDING_PASS" | "PENDING_FAIL" | "PASS" | "FAIL";

export interface WorkspaceStudentActivityType {
  assessmentState: WorkspaceAssesementState,
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

export interface WorkspaceStudentAccessmentType {
  assessorEntityId: number,
  evaluated: string,
  gradeIdentifier: string,
  gradeSchoolDataSource: string,
  gradingScaleIdentifier: string,
  gradingScaleSchoolDataSource: string,
  identifier: string,
  passed: boolean,
  verbalAssessment: string,
  workspaceStudentId: string
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
  studentAcessment?: WorkspaceStudentAccessmentType
}

export interface ShortWorkspaceType {
  workspaceName: string,
  materialName: string,
  url: string
}

export interface WorkspaceListType extends Array<WorkspaceType> {}

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