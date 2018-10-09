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

export interface WorkspaceAdditionalInfoType {
  beginDate: string,
  endDate: string,
  viewLink: string,
  workspaceTypeId?: string,
  workspaceType?: string,
  courseLengthSymbol?: {
    id: string,
    name: string,
    schoolDataSource: string,
    symbol: string
  },
  courseLength?: string,
  subject?: {
    code: string,
    identifier: string,
    name: string,
    schoolDataSource: string
  },
  educationType?: {
    identifier: {
      dataSource: string,
      identifier: string
    },
    name: string,
    schoolDataSource: string
  }
}

export interface WorkspaceType {
  archived: boolean,
  description: string,
  hasCustomImage: boolean,
  id: number,
  lastVisit: string,
  materialDefaultLicense: string,
  name: string,
  nameExtension?: string | null,
  numVisits: number,
  published: boolean,
  urlName: string,
  
  //These are usually part of the workspace but don't appear in certain occassions
  //Usually available if internally loaded
  access?: string,
  curriculumIdentifiers?: Array<string>,
  subjectIdentifier?: string | number,
      
  //These appear in certain circumstances
  //Usually available if externally loaded (eg. coursepicker)
  canSignup?: boolean,
  isCourseMember?: boolean,
  educationTypeName?: string,
  
  //These are optional addons, and are usually not available
  studentActivity?: WorkspaceStudentActivityType,
  forumStatistics?: WorkspaceForumStatisticsType,
  studentAssessments?: WorkspaceStudentAssessmentsType,
  activityStatistics?: WorkspaceActivityStatisticsType,
  feeInfo?: WorkspaceFeeInfoType,
  assessmentRequests?: Array<WorkspaceAssessmentRequestType>,
  additionalInfo?: WorkspaceAdditionalInfoType
}

export interface WorkspaceUpdateType {
  archived?: boolean,
  description?: string,
  hasCustomImage?: boolean,
  id?: number,
  lastVisit?: string,
  materialDefaultLicense?: string,
  name?: string,
  nameExtension?: string | null,
  numVisits?: number,
  published?: boolean,
  urlName?: string,
  access?: string,
  curriculumIdentifiers?: Array<string>,
  subjectIdentifier?: string | number,
}

export interface ShortWorkspaceType {
  workspaceName: string,
  materialName: string,
  url: string
}

export type WorkspaceListType = Array<WorkspaceType>;

export type WorkspaceBaseFilterType = "ALL_COURSES" | "MY_COURSES" | "AS_TEACHER";

export interface WorkspaceEducationFilterType {
  identifier: string,
  name: string
}

export type WorkspaceEducationFilterListType = Array<WorkspaceEducationFilterType>;

export interface WorkspaceCurriculumFilterType {
  identifier: string,
  name: string
}

export type WorkspaceCurriculumFilterListType = Array<WorkspaceCurriculumFilterType>;

export type WorkspaceBaseFilterListType = Array<WorkspaceBaseFilterType>;

export interface WorkspacesAvaliableFiltersType {
  educationTypes: WorkspaceEducationFilterListType,
  curriculums: WorkspaceCurriculumFilterListType,
  baseFilters: WorkspaceBaseFilterListType
}

export type WorkspacesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export interface WorkspacesActiveFiltersType {
  educationFilters: Array<string>,
  curriculumFilters: Array<string>,
  query: string,
  baseFilter: WorkspaceBaseFilterType
}

export interface WorkspacesType {
  availableWorkspaces: WorkspaceListType,
  userWorkspaces: WorkspaceListType,
  lastWorkspace?: ShortWorkspaceType,
  currentWorkspace?: WorkspaceType,
  avaliableFilters: WorkspacesAvaliableFiltersType,
  state: WorkspacesStateType,
  activeFilters: WorkspacesActiveFiltersType,
  hasMore: boolean,
  toolbarLock: boolean
}

export interface WorkspacesPatchType {
  availableWorkspaces?: WorkspaceListType,
  userWorkspaces?: WorkspaceListType,
  lastWorkspace?: ShortWorkspaceType,
  currentWorkspace?: WorkspaceType,
  avaliableFilters?: WorkspacesAvaliableFiltersType,
  state?: WorkspacesStateType,
  activeFilters?: WorkspacesActiveFiltersType,
  hasMore?: boolean,
  toolbarLock?: boolean
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
  availableWorkspaces: [],
  userWorkspaces: [],
  lastWorkspace: null,
  currentWorkspace: null,
  avaliableFilters: {
    educationTypes: [],
    curriculums: [],
    baseFilters: ["ALL_COURSES", "MY_COURSES", "AS_TEACHER"]
  },
  state: "LOADING",
  activeFilters: {
    educationFilters: [],
    curriculumFilters: [],
    query: "",
    baseFilter: "ALL_COURSES"
  },
  hasMore: false,
  toolbarLock: false
}, action: ActionType): WorkspacesType {
  if (action.type === 'UPDATE_USER_WORKSPACES'){
    return <WorkspacesType>Object.assign({}, state, {
      userWorkspaces: action.payload
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
       availableWorkspaces: state.availableWorkspaces.map(processWorkspaceToHaveNewAssessmentStateAndDate.bind(this, action.payload.workspace.id, action.payload.newState,
          action.payload.newDate, action.payload.newAssessmentRequest)),
       userWorkspaces: state.userWorkspaces.map(processWorkspaceToHaveNewAssessmentStateAndDate.bind(this, action.payload.workspace.id, action.payload.newState,
          action.payload.newDate, action.payload.newAssessmentRequest)) 
    })
  } else if (action.type === "UPDATE_WORKSPACES_AVALIABLE_FILTERS_EDUCATION_TYPES"){
    return Object.assign({}, state, {
      avaliableFilters: Object.assign({}, state.avaliableFilters, {
        educationTypes: action.payload
      })
    });
  } else if (action.type === "UPDATE_WORKSPACES_AVALIABLE_FILTERS_CURRICULUMS"){
    return Object.assign({}, state, {
      avaliableFilters: Object.assign({}, state.avaliableFilters, {
        curriculums: action.payload
      })
    });
  } else if (action.type === "UPDATE_WORKSPACES_ACTIVE_FILTERS"){
    return Object.assign({}, state, {
      activeFilters: action.payload
    });
  } else if (action.type === "UPDATE_WORKSPACES_ALL_PROPS"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_WORKSPACES_STATE"){
    return Object.assign({}, state, {
      state: action.payload
    });
  } else if (action.type === "UPDATE_WORKSPACE"){
    let newCurrent = state.currentWorkspace;
    if (newCurrent && newCurrent.id === action.payload.original.id){
      newCurrent = {...newCurrent, ...action.payload.update};
    }
    return Object.assign({}, state, {
      currentWorkspace: newCurrent,
      availableWorkspaces: state.availableWorkspaces.map(w=>{
        if (w.id === action.payload.original.id){
          return {...w, ...action.payload.update};
        }
        return w;
      }),
      userWorkspaces: state.userWorkspaces.map(w=>{
        if (w.id === action.payload.original.id){
          return {...w, ...action.payload.update};
        }
        return w;
      })
    })
  }
  return state;
}