import {ActionType} from '~/actions';

export type WorkspaceAssessementStateType = "unassessed" | "pending" | "pending_pass" | "pending_fail" | "pass" | "fail" | "incomplete";

export interface WorkspaceStudentActivityType {
  assessmentState: {
    date: string,
    state: WorkspaceAssessementStateType
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

export interface WorkspaceStudentAssessmentType {
  assessorEntityId: number,
  evaluated: string,
  gradeIdentifier: string,
  gradeSchoolDataSource: string,
  grade: string,
  gradingScale: string,
  gradingScaleIdentifier: string,
  gradingScaleSchoolDataSource: string,
  identifier: string,
  passed: boolean,
  verbalAssessment: string,
  workspaceStudentId: string
}

export interface WorkspaceStudentAssessmentsType {
  assessmentState: WorkspaceAssessementStateType,
  assessmentStateDate: string,
  assessments: Array<WorkspaceStudentAssessmentType>
}

export interface WorkspaceActivityRecordType {
  type: string,
  date: string
}

export interface WorkspaceActivityStatisticsType {
  records: WorkspaceActivityRecordType[];
}

export interface WorkspaceFeeInfoType {
  evaluationHasFee: boolean
}

export interface WorkspaceAssessmentRequestType {
  id: string,
  userIdentifier: string,
  workspaceUserIdentifier: string,
  requestText: string,
  date: string,
  workspaceEntityId: number,
  userEntityId: number
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
  studentAssessments?: WorkspaceStudentAssessmentsType,
  activityStatistics?: WorkspaceActivityStatisticsType,
  feeInfo?: WorkspaceFeeInfoType,
  assessmentRequests?: Array<WorkspaceAssessmentRequestType>
}

export interface ShortWorkspaceType {
  workspaceName: string,
  materialName: string,
  url: string
}

export type WorkspaceListType = Array<WorkspaceType>;

export interface WorkspacesType {
  workspaces: WorkspaceListType,
  lastWorkspace?: ShortWorkspaceType,
  currentWorkspace?: WorkspaceType
}

function processWorkspaceToHaveNewAssessmentStateAndDate(id: number, assessmentState: WorkspaceAssessementStateType, date: string,
    assessmentRequestObject: WorkspaceAssessmentRequestType, deleteAssessmentRequestObject:boolean, workspace: WorkspaceType){
  let replacement = workspace && workspace.id === id ?
      {...workspace} : workspace;
  if (replacement && replacement.id === id){
    if (replacement.studentActivity) {
      replacement.studentActivity = {...replacement.studentActivity, assessmentState: {
        date,
        state: assessmentState
      }};
    }
    if (replacement.studentAssessments){
      replacement.studentAssessments = {...replacement.studentAssessments,
        assessmentState,
        assessmentStateDate: date,
        assessments: replacement.studentAssessments.assessments
      }
    }
    if (replacement.assessmentRequests){
      let index = replacement.assessmentRequests.findIndex(r=>r.id === assessmentRequestObject.id);
      replacement.assessmentRequests = [...replacement.assessmentRequests];
      if (index !== -1){
        if (deleteAssessmentRequestObject){
          replacement.assessmentRequests.splice(index, 1);
        } else {
          replacement.assessmentRequests[index] = assessmentRequestObject
        }
      } else if (!deleteAssessmentRequestObject) {
        replacement.assessmentRequests.push(assessmentRequestObject);
      }
    }
  }
  
  return replacement;
}

export default function workspaces(state: WorkspacesType={
  workspaces: [],
  lastWorkspace: null,
  currentWorkspace: null
}, action: ActionType): WorkspacesType {
  if (action.type === 'UPDATE_WORKSPACES'){
    return <WorkspacesType>Object.assign({}, state, {
      workspaces: action.payload
    });
  } else if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return Object.assign({}, state, {
      lastWorkspace: <ShortWorkspaceType>action.payload
    });
  } else if (action.type === 'SET_CURRENT_WORKSPACE'){
    return Object.assign({}, state, {
      currentWorkspace: <WorkspaceType>action.payload
    });
  } else if (action.type === 'UPDATE_WORKSPACE_ASSESSMENT_STATE'){
    return Object.assign({}, state, {
      currentWorkspace: processWorkspaceToHaveNewAssessmentStateAndDate(
          action.payload.workspace.id, action.payload.newState, action.payload.newDate,
          action.payload.newAssessmentRequest || action.payload.oldAssessmentRequestToDelete, !!action.payload.oldAssessmentRequestToDelete, state.currentWorkspace),
      workspaces: state.workspaces.map(processWorkspaceToHaveNewAssessmentStateAndDate.bind(this, action.payload.workspace.id, action.payload.newState,
          action.payload.newDate, action.payload.newAssessmentRequest))
    })
  }
  return state;
}