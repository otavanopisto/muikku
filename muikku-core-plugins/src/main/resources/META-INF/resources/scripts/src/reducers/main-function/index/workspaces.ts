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
  forumStatistics?: WorkspaceForumStatisticsType
}

export interface WorkspaceListType extends Array<WorkspaceType> {}

export default function workspaces(state: WorkspaceListType=[], action: ActionType): WorkspaceListType{
  if (action.type === 'UPDATE_WORKSPACES'){
    return <WorkspaceListType>action.payload;
  }
  return state;
}