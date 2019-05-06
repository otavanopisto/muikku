import {ActionType} from '~/actions';
import { UserStaffType, ShortWorkspaceUserWithActiveStatusType } from '~/reducers/user-index';

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

export interface ActivityLogType {
  type: "EVALUATION_REQUESTED" | "EVALUATION_GOTINCOMPLETED" | "EVALUATION_GOTFAILED" | "EVALUATION_GOTPASSED"
    | "WORKSPACE_VISIT" | "MATERIAL_EXERCISEDONE" | "MATERIAL_ASSIGNMENTDONE" | "SESSION_LOGGEDIN" | "FORUM_NEWMESSAGE"
    | "FORUM_NEWTHREAD" | "NOTIFICATION_ASSESMENTREQUEST" | "NOTIFICATION_NOPASSEDCOURSES" | "NOTIFICATION_SUPPLEMENTATIONREQUEST"
    | "NOTIFICATION_STUDYTIME",
  timestamp: string,
  contextId?: number
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

export interface WorkspaceJournalType {
  id: number,
  workspaceEntityId: number,
  userEntityId: number,
  firstName: string,
  lastName: string,
  content: string,
  title: string,
  created: string
}

export type WorkspaceJournalListType = Array<WorkspaceJournalType>;

export interface WorkspaceJournalsType {
  journals: WorkspaceJournalListType,
  hasMore: boolean,
  userEntityId?: number,
  state: WorkspacesStateType
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

export interface WorkspaceProducerType {
  id: number,
  workspaceEntityId: number,
  name: string
}

export interface WorkspaceDetailsType {
  beginDate: string,
  endDate: string,
  externalViewUrl: string,
  typeId: string
}

export type WorkspaceAccessType = "MEMBERS_ONLY" | "LOGGED_IN" | "ANYONE";

export interface WorkspaceStudentAssessmentStateType {
  date: string,
  state: WorkspaceAssessementStateType,
  grade?: string,
  text?: string
}

export interface WorkspacePermissionsType {
  workspaceEntityId: number,
  userGroupEntityId: number,
  userGroupName: string,
  permissions: string[],
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
  access?: WorkspaceAccessType,
  curriculumIdentifiers?: Array<string>,
  subjectIdentifier?: string | number,

  //These appear in certain circumstances
  //Usually available if externally loaded (eg. coursepicker)
  canSignup?: boolean,
  //this one is actually also available in the current workspace in workspace/
  isCourseMember?: boolean,
  educationTypeName?: string,

  //These are optional addons, and are usually not available
  studentActivity?: WorkspaceStudentActivityType,
  forumStatistics?: WorkspaceForumStatisticsType,
  studentAssessments?: WorkspaceStudentAssessmentsType,
  studentAssessmentState?: WorkspaceStudentAssessmentStateType,
  activityStatistics?: WorkspaceActivityStatisticsType,
  feeInfo?: WorkspaceFeeInfoType,
  assessmentRequests?: Array<WorkspaceAssessmentRequestType>,
  additionalInfo?: WorkspaceAdditionalInfoType,
  staffMembers?: Array<UserStaffType>,
  producers?: Array<WorkspaceProducerType>,
  contentDescription?: MaterialContentNodeType,
  help?: MaterialContentNodeType,
  activityLogs?: ActivityLogType[],
  students?: Array<ShortWorkspaceUserWithActiveStatusType>,
  details?: WorkspaceDetailsType,
  permissions?: WorkspacePermissionsType[],
      
  //Fancy stuff in here
  journals?: WorkspaceJournalsType
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
  access?: WorkspaceAccessType,
  curriculumIdentifiers?: Array<string>,
  subjectIdentifier?: string | number,

  canSignup?: boolean,
  isCourseMember?: boolean,
  educationTypeName?: string,
  studentActivity?: WorkspaceStudentActivityType,
  forumStatistics?: WorkspaceForumStatisticsType,
  studentAssessments?: WorkspaceStudentAssessmentsType,
  studentAssessmentState?: WorkspaceStudentAssessmentStateType,
  activityStatistics?: WorkspaceActivityStatisticsType,
  feeInfo?: WorkspaceFeeInfoType,
  assessmentRequests?: Array<WorkspaceAssessmentRequestType>,
  additionalInfo?: WorkspaceAdditionalInfoType,
  staffMembers?: Array<UserStaffType>,
  producers?: Array<WorkspaceProducerType>,
  contentDescription?: MaterialContentNodeType,
  help?: MaterialContentNodeType,
  activityLogs?: ActivityLogType[],
  students?: Array<ShortWorkspaceUserWithActiveStatusType>,
  details?: WorkspaceDetailsType,
  permissions?: WorkspacePermissionsType[],
      
  journals?: WorkspaceJournalsType
}

export interface WorkspaceMaterialReferenceType {
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

export interface WorkspaceTypeType {
  identifier: string,
  name: string
}

//section = true && currentNodeValue = null && parentNodeValue = null   (new section)
//section = false && currentNodeValue = null && parentNodeValue = x     (new material)
//section = true && currentNodeValue = x && parentNodeValue = null      (edit section)
//section = false && currentNodeValue = x && parentNodeValue = x        (edit material)
export interface WorkspaceMaterialEditorType {
  currentNodeWorkspace?: WorkspaceType,
  currentNodeValue?: MaterialContentNodeType,
  currentDraftNodeValue?: MaterialContentNodeType,
  parentNodeValue?: MaterialContentNodeType,
  workspace: WorkspaceType,
  section: boolean,
  opened: boolean,
  canDelete: boolean,
  canHide: boolean,
  disablePlugins: boolean,
  canPublish: boolean,
  canRevert: boolean,
  canRestrictView: boolean,
  canCopy: boolean,
  canChangePageType: boolean,
  canChangeExerciseType: boolean,
  canSetLicense: boolean,
  canSetProducers: boolean,
  canAddAttachments: boolean,
  canEditContent: boolean,
  showRemoveAnswersDialogForPublish: boolean,
  showRemoveAnswersDialogForDelete: boolean,
}

export interface WorkspacesType {
  availableWorkspaces: WorkspaceListType,
  userWorkspaces: WorkspaceListType,
  lastWorkspace?: WorkspaceMaterialReferenceType,
  currentWorkspace?: WorkspaceType,
  avaliableFilters: WorkspacesAvaliableFiltersType,
  state: WorkspacesStateType,
  activeFilters: WorkspacesActiveFiltersType,
  hasMore: boolean,
  toolbarLock: boolean,
  currentMaterials: MaterialContentNodeListType,
  currentMaterialsActiveNodeId: number,
  currentMaterialsReplies: MaterialCompositeRepliesListType,
  materialEditor: WorkspaceMaterialEditorType,
  types?: Array<WorkspaceTypeType>
}

export type WorkspacesPatchType = Partial<WorkspacesType>;

export type MaterialCorrectAnswersType = "ALWAYS" | "ON_REQUEST" | "NEVER";

export interface MaterialAssignmentType {
  id: number,
  materialId: number,
  parentId: number,
  nextSiblingId: number,
  hidden: boolean,
  assignmentType: "EXERCISE" | "EVALUATED",
  correctAnswers: string,
  path: string,
  title: string
}

export interface MaterialContentNodeType {
  title: string,
  license: string,
  viewRestrict: string,
  html: string,
  currentRevision: number,
  publishedRevision: number,
  
  //Standard Fields (only available when loaded through materials rest endpoint)
  id?: number,
  contentType?: string,
  
  //Extended Fields (only available when loaded via workspace rest endpoint)
  type?: string,
  children?: Array<MaterialContentNodeType>,
  workspaceMaterialId?: number,
  materialId?: number,
  level?: number,
  assignmentType?: "EXERCISE" | "EVALUATED",
  correctAnswers?: MaterialCorrectAnswersType,
  hidden?: boolean,
  parentId?: number,
  nextSiblingId?: number,
  path?: string,
  viewRestricted?: boolean,
  producers?: any,
  
  //Assigned fields
  evaluation?: MaterialEvaluationType,
  assignment?: MaterialAssignmentType
}

export interface MaterialAnswerType {
  embedId: string,
  fieldName: string,
  materialId: number,
  value: string,
  workspaceMaterialId: number
}
export type MaterialCompositeRepliesStateType = "UNANSWERED" | "ANSWERED" | "SUBMITTED" | "WITHDRAWN" | "PASSED" | "FAILED" | "INCOMPLETE"

export interface MaterialCompositeRepliesType {
  answers: Array<MaterialAnswerType>,
  state: MaterialCompositeRepliesStateType,
  
  //Available when loaded specifically (eg. via records)
  created: string,
  lastModified: string,
  submitted: string,
  withdrawn?: string,
      
  //Available when loaded generically (eg. via workspace material)
  workspaceMaterialId: number,
  workspaceMaterialReplyId: number
}

export type MaterialCompositeRepliesListType = Array<MaterialCompositeRepliesType>;

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
  gradingScale: string,
  verbalAssessment: string,
  passed: boolean
}

export type MaterialContentNodeListType = Array<MaterialContentNodeType>;

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
  currentMaterials: null,
  currentMaterialsReplies: null,
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
  toolbarLock: false,
  currentMaterialsActiveNodeId: null,
  types: null,
  materialEditor: {
    workspace: null,
    section: false,
    opened: false,
    canDelete: true,
    canHide: true,
    disablePlugins: false,
    canPublish: true,
    canRevert: true,
    canRestrictView: true,
    canCopy: true,
    canChangePageType: true,
    canChangeExerciseType: true,
    canSetLicense: true,
    canSetProducers: true,
    canAddAttachments: true,
    canEditContent: true,
    showRemoveAnswersDialogForPublish: false,
    showRemoveAnswersDialogForDelete: false,
  }
}, action: ActionType): WorkspacesType {
  if (action.type === 'UPDATE_USER_WORKSPACES'){
    return <WorkspacesType>Object.assign({}, state, {
      userWorkspaces: action.payload
    });
  } else if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return Object.assign({}, state, {
      lastWorkspace: <WorkspaceMaterialReferenceType>action.payload
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
  } else if (action.type === "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS"){
    return {...state, currentMaterials: action.payload};
  } else if (action.type === "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID"){
    return {...state, currentMaterialsActiveNodeId: action.payload};
  } else if (action.type === "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES"){
    return {...state, currentMaterialsReplies: action.payload}
  } else if (action.type === "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER"){
    let wasUpdated = false;
    let newCurrentMaterialsReplies = state.currentMaterialsReplies.map((compositeReplies: MaterialCompositeRepliesType)=>{
      if (compositeReplies.workspaceMaterialId === action.payload.workspaceMaterialId){
        wasUpdated = true;
        return {...compositeReplies, ...action.payload};
      }
      return compositeReplies
    });
    if (!wasUpdated){
      newCurrentMaterialsReplies = newCurrentMaterialsReplies.concat([<MaterialCompositeRepliesType>action.payload]);
    }
    return {...state, currentMaterialsReplies: newCurrentMaterialsReplies}
  } else if (action.type === "UPDATE_MATERIAL_CONTENT_NODE") {
    let found = false;
    let newCurrentWorkspace = state.currentWorkspace;
    if (!action.payload.isDraft && newCurrentWorkspace.help.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      found = true;
      newCurrentWorkspace = {...newCurrentWorkspace};
      newCurrentWorkspace.help = {...newCurrentWorkspace.help, ...action.payload.update};
    }
    if (!action.payload.isDraft && !found && newCurrentWorkspace.contentDescription.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      found = true;
      newCurrentWorkspace = {...newCurrentWorkspace};
      newCurrentWorkspace.contentDescription = {...newCurrentWorkspace.contentDescription, ...action.payload.update};
    }
    let mapMaterial = (m: MaterialContentNodeType) => {
      if (action.payload.isDraft) {
        return m;
      }
      
      if (found) {
        return m;
      }
      
      if (m.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
        found = true;
        return {...m, ...action.payload.update};
      }
      
      const newM:MaterialContentNodeType = {...m, children: m.children ? m.children.map(mapMaterial) : m.children};
      return newM;
    }
    
    let newEditor = state.materialEditor;
    if (!action.payload.isDraft && newEditor && newEditor.currentNodeValue && newEditor.currentNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.currentNodeValue = {...newEditor.currentNodeValue, ...action.payload.update};
    } else if (!action.payload.isDraft && newEditor && newEditor.parentNodeValue && newEditor.parentNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.parentNodeValue = {...newEditor.parentNodeValue, ...action.payload.update};
    } else if (action.payload.isDraft && newEditor && newEditor.currentDraftNodeValue && newEditor.currentDraftNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.currentDraftNodeValue = {...newEditor.currentDraftNodeValue, ...action.payload.update};
    }
    newEditor.showRemoveAnswersDialogForPublish = action.payload.showRemoveAnswersDialogForPublish;
    
    return {
      ...state,
      currentWorkspace: newCurrentWorkspace,
      currentMaterials: state.currentMaterials ? state.currentMaterials.map(mapMaterial) : state.currentMaterials,
      materialEditor: newEditor
    }
  } else if (action.type === "DELETE_MATERIAL_CONTENT_NODE") {

    let filterMaterial = (m: MaterialContentNodeType) => {
      if (m.workspaceMaterialId === action.payload.workspaceMaterialId) {
        return false;
      }
      
      return true;
    }
    let mapMaterial = (m: MaterialContentNodeType, index: number, arr: Array<MaterialContentNodeType>) => {
      const nextSiblingId = arr[index + 1] ? arr[index + 1].workspaceMaterialId : null;
      const newM:MaterialContentNodeType = {...m, nextSiblingId, children: m.children ? m.children.filter(filterMaterial).map(mapMaterial) : m.children};
      return newM;
    }
    
    let newEditor = state.materialEditor;
    if (newEditor && (
        newEditor.currentNodeValue.workspaceMaterialId === action.payload.workspaceMaterialId ||
        newEditor.parentNodeValue.workspaceMaterialId === action.payload.workspaceMaterialId)) {
      newEditor = {
        currentNodeValue: null,
        parentNodeValue: null,
        workspace: null,
        opened: false,
        ...newEditor,
      };
    }
    return {...state, currentMaterials: state.currentMaterials.filter(filterMaterial).map(mapMaterial), materialEditor: newEditor}
  }
  return state;
}