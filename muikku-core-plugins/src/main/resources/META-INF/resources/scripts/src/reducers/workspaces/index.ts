import {ActionType} from '~/actions';
import { UserStaffType, ShortWorkspaceUserWithActiveStatusType } from '~/reducers/user-index';
import { repairContentNodes } from '~/util/modifiers';

export interface OrganizationCourseTeacherType {
  firstName: string,
  lastName: string
}

export type WorkspaceAssessementStateType = "unassessed" | "pending" | "pending_pass" | "pending_fail" | "pass" | "fail" | "incomplete";

export interface WorkspaceStudentActivityType {
  assessmentState: {
    date: string,
    state: WorkspaceAssessementStateType,
    grade: string,
    text: string,
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
  name: string,
  id?: number
}

export interface WorkspaceDetailsType {
  beginDate: string,
  endDate: string,
  externalViewUrl: string,
  typeId: string,
  rootFolderId: number,
  helpFolderId: number,
  indexFolderId: number,
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
  canSignup: boolean,
}

export interface WorkspaceType {
  archived: boolean,
  description: string ,
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
  activityLogs?: ActivityLogType[],
  students?: Array<ShortWorkspaceUserWithActiveStatusType>,
  details?: WorkspaceDetailsType,
  permissions?: WorkspacePermissionsType[],

  //Fancy stuff in here
  journals?: WorkspaceJournalsType

  // These are only in organizationlistings
  teachers?: Array<OrganizationCourseTeacherType>,
  studentCount? : number
}

export type WorkspaceUpdateType = Partial<WorkspaceType>;

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

export interface WorkspaceOrganizationFilterType {
  identifier: string,
  name: string
}

export type WorkspaceCurriculumFilterListType = Array<WorkspaceCurriculumFilterType>;
export type WorkspaceOrganizationFilterListType = Array<WorkspaceOrganizationFilterType>;
export type WorkspaceBaseFilterListType = Array<WorkspaceBaseFilterType>;

export interface WorkspacesavailableFiltersType {
  educationTypes: WorkspaceEducationFilterListType,
  curriculums: WorkspaceCurriculumFilterListType,
  organizations: WorkspaceOrganizationFilterListType,
  baseFilters: WorkspaceBaseFilterListType
}

export interface OrganizationWorkspacesavailableFiltersType {
  educationTypes: WorkspaceEducationFilterListType,
  curriculums: WorkspaceCurriculumFilterListType,
}

export type WorkspacesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

export interface OrganizationWorkspacesActiveFiltersType {
  educationFilters: Array<string>,
  curriculumFilters: Array<string>,
  query: string,
}

export interface WorkspacesActiveFiltersType {
  educationFilters: Array<string>,
  curriculumFilters: Array<string>,
  organizationFilters: Array<string>,
  query: string,
  baseFilter: WorkspaceBaseFilterType
}

export interface WorkspaceTypeType {
  identifier: string,
  name: string
}

export interface WorkspaceEditModeStateType {
  available: boolean,
  active: boolean,
}

//section = true && currentNodeValue = null && parentNodeValue = null   (new section)
//section = false && currentNodeValue = null && parentNodeValue = x     (new material)
//section = true && currentNodeValue = x && parentNodeValue = null      (edit section)
//section = false && currentNodeValue = x && parentNodeValue = x        (edit material)
export interface WorkspaceMaterialEditorType {
  currentNodeWorkspace: WorkspaceType,
  currentNodeValue?: MaterialContentNodeType,
  currentDraftNodeValue?: MaterialContentNodeType,
  parentNodeValue?: MaterialContentNodeType,
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
  canSetTitle: boolean,
  showRemoveAnswersDialogForPublish: boolean,
  showRemoveAnswersDialogForDelete: boolean,
  showUpdateLinkedMaterialsDialogForPublish: boolean,
  showUpdateLinkedMaterialsDialogForPublishCount: number,
}

export interface WorkspacesType {
  availableWorkspaces: WorkspaceListType,
  availableFilters: WorkspacesavailableFiltersType,
  state: WorkspacesStateType,
  activeFilters: WorkspacesActiveFiltersType,
  hasMore: boolean,
  toolbarLock: boolean,
  types?: Array<WorkspaceTypeType>
  userWorkspaces: WorkspaceListType,
  lastWorkspace?: WorkspaceMaterialReferenceType,
  currentWorkspace?: WorkspaceType,
  currentMaterials: MaterialContentNodeListType,
  currentHelp: MaterialContentNodeListType,
  currentMaterialsActiveNodeId: number,
  currentMaterialsReplies: MaterialCompositeRepliesListType,
  editMode: WorkspaceEditModeStateType,
  materialEditor: WorkspaceMaterialEditorType,

}

export interface OrganizationWorkspacesType {
  availableWorkspaces: WorkspaceListType,
  availableFilters: OrganizationWorkspacesavailableFiltersType,
  state: WorkspacesStateType,
  activeFilters: OrganizationWorkspacesActiveFiltersType,
  hasMore: boolean,
  toolbarLock: boolean,
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

export interface MaterialContentNodeProducerType {
  id: number;
  name: string;
  materialId: number;
}

export interface MaterialContentNodeType {
  title: string,
  license: string,
  viewRestrict: string,
  html: string,
  currentRevision: number,
  publishedRevision: number,
  contentType: string,

  //Standard Fields (only available when loaded through materials rest endpoint)
  id?: number,

  //Extended Fields (only available when loaded via content node rest endpoint)
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
  producers?: MaterialContentNodeProducerType[],

  //Assigned fields
  childrenAttachments?: Array<MaterialContentNodeType>, // this is usually missing and has to be manually retrieved
  evaluation?: MaterialEvaluationType,
  assignment?: MaterialAssignmentType,
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

  //Available sometimes
  evaluationInfo?: {
    type: MaterialCompositeRepliesStateType,
    text: string,
    grade: string,
    date: string,
  }

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
        ...replacement.studentActivity.assessmentState,
        date,
        state: assessmentState,
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
  currentHelp: null,
  currentMaterialsReplies: null,
  availableFilters: {
    educationTypes: [],
    curriculums: [],
    organizations: [],
    baseFilters: ["ALL_COURSES", "MY_COURSES", "AS_TEACHER"]
  },
  state: "LOADING",
  activeFilters: {
    educationFilters: [],
    curriculumFilters: [],
    organizationFilters: [],
    query: "",
    baseFilter: "ALL_COURSES"
  },
  hasMore: false,
  toolbarLock: false,
  currentMaterialsActiveNodeId: null,
  types: null,
  editMode: {
    active: false,
    available: false,
  },
  materialEditor: {
    currentNodeWorkspace: null,
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
    showUpdateLinkedMaterialsDialogForPublish: false,
    showUpdateLinkedMaterialsDialogForPublishCount: 0,
    canSetTitle: true,
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
  } else if (action.type === "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        educationTypes: action.payload
      })
    });
  } else if (action.type === "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        curriculums: action.payload
      })
    });
  } else if (action.type === "UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        organizations: action.payload
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
  } else if (action.type === "UPDATE_WORKSPACES_SET_CURRENT_HELP"){
    return {...state, currentHelp: action.payload};
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
      if (newM.childrenAttachments) {
        newM.childrenAttachments = newM.childrenAttachments.map(mapMaterial);
      }
      return newM;
    }

    let newEditor = state.materialEditor;
    if (!action.payload.isDraft && newEditor && newEditor.currentNodeValue &&
        newEditor.currentNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.currentNodeValue = {...newEditor.currentNodeValue, ...action.payload.update};
    } else if (!action.payload.isDraft && newEditor && newEditor.parentNodeValue &&
        newEditor.parentNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.parentNodeValue = {...newEditor.parentNodeValue, ...action.payload.update};
    } else if (action.payload.isDraft && newEditor && newEditor.currentDraftNodeValue &&
        newEditor.currentDraftNodeValue.workspaceMaterialId === action.payload.material.workspaceMaterialId) {
      newEditor = {...newEditor};
      newEditor.currentDraftNodeValue = {...newEditor.currentDraftNodeValue, ...action.payload.update};
    }
    newEditor.showRemoveAnswersDialogForPublish = action.payload.showRemoveAnswersDialogForPublish;
    newEditor.showUpdateLinkedMaterialsDialogForPublish = action.payload.showUpdateLinkedMaterialsDialogForPublish;
    newEditor.showUpdateLinkedMaterialsDialogForPublishCount = action.payload.showUpdateLinkedMaterialsDialogForPublishCount;

    return {
      ...state,
      currentWorkspace: newCurrentWorkspace,
      currentMaterials: state.currentMaterials ? state.currentMaterials.map(mapMaterial) : state.currentMaterials,
      currentHelp: state.currentHelp ? state.currentHelp.map(mapMaterial) : state.currentHelp,
      materialEditor: newEditor
    }
  } else if (action.type === "DELETE_MATERIAL_CONTENT_NODE") {

    let filterMaterial = (m: MaterialContentNodeType) => {
      // Sometimes I get id sometimes workspaceMaterialId, super inconsistent
      if (typeof m.id !== "undefined" && typeof action.payload.id !== "undefined" && m.id === action.payload.id) {
        return false;
      } else if (typeof m.workspaceMaterialId !== "undefined" &&
          typeof action.payload.workspaceMaterialId !== "undefined" &&
          m.workspaceMaterialId === action.payload.workspaceMaterialId) {
        return false;
      }

      return true;
    }
    let mapMaterial = (m: MaterialContentNodeType, index: number, arr: Array<MaterialContentNodeType>) => {
      const nextSiblingId = arr[index + 1] ? arr[index + 1].workspaceMaterialId : null;
      const newM:MaterialContentNodeType = {
        ...m,
        nextSiblingId,
        children: m.children ? m.children.filter(filterMaterial).map(mapMaterial) : m.children
      };
      if (newM.childrenAttachments) {
        newM.childrenAttachments = newM.childrenAttachments.filter(filterMaterial);
      }
      return newM;
    }

    let newEditor = state.materialEditor;
    if (newEditor && (
          newEditor.currentNodeValue.workspaceMaterialId === action.payload.workspaceMaterialId ||
          (newEditor.parentNodeValue && newEditor.parentNodeValue.workspaceMaterialId === action.payload.workspaceMaterialId)
        )) {
      newEditor = {
        currentNodeValue: null,
        parentNodeValue: null,
        currentNodeWorkspace: null,
        opened: false,
        ...newEditor,
      };
    }
    if (newEditor && newEditor.currentNodeValue && newEditor.currentNodeValue.childrenAttachments) {
      newEditor = {...newEditor};
      newEditor.currentNodeValue = {...newEditor.currentNodeValue};
      newEditor.currentNodeValue.childrenAttachments = newEditor.currentNodeValue.childrenAttachments.filter(filterMaterial);
    }
    return {
      ...state,
      currentMaterials: state.currentMaterials ? state.currentMaterials.filter(filterMaterial).map(mapMaterial) : state.currentMaterials,
      currentHelp: state.currentHelp ? state.currentHelp.filter(filterMaterial).map(mapMaterial) : state.currentHelp,
      materialEditor: newEditor,
    }
  } else if (action.type === "INSERT_MATERIAL_CONTENT_NODE") {
    let insertedContentNode: MaterialContentNodeType = action.payload;
    let newCurrentMaterials = state.currentMaterials ? [...state.currentMaterials] : state.currentMaterials;
    let newHelpMaterials = state.currentHelp ? [...state.currentHelp] : state.currentHelp;

    // so the target depends, if it's the parent id of the help folder then the target is help
    // however otherwise is current materials
    let targetArray = insertedContentNode.parentId === state.currentWorkspace.details.helpFolderId ? newHelpMaterials : newCurrentMaterials;
    // if it's current materials, and it's not help then we got to check if we are in the root or into a folder
    if (
      insertedContentNode.parentId !== state.currentWorkspace.details.helpFolderId &&
      insertedContentNode.parentId !== state.currentWorkspace.details.rootFolderId
    ) {
      const targetIndex = newCurrentMaterials.findIndex((cn) => cn.workspaceMaterialId === insertedContentNode.parentId);
      newCurrentMaterials[targetIndex] = {...newCurrentMaterials[targetIndex]};
      newCurrentMaterials[targetIndex].children = [...newCurrentMaterials[targetIndex].children];
      targetArray = newCurrentMaterials[targetIndex].children;
    }
    if (insertedContentNode.nextSiblingId) {
      const siblingIndex = targetArray.findIndex((cn) => cn.workspaceMaterialId === insertedContentNode.nextSiblingId);
      targetArray.splice(siblingIndex, 0, insertedContentNode);
    } else {
      targetArray.push(insertedContentNode);
    }

    return {
      ...state,
      currentMaterials: newCurrentMaterials ? repairContentNodes(newCurrentMaterials) : newCurrentMaterials,
      currentHelp: newHelpMaterials ? repairContentNodes(newHelpMaterials) : newHelpMaterials,
    }
  } else if (action.type === "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES") {
    return {
      ...state,
      currentMaterials: repairContentNodes(state.currentMaterials, action.payload.newPath, action.payload.material.workspaceMaterialId),
      currentHelp: repairContentNodes(state.currentHelp, action.payload.newPath, action.payload.material.workspaceMaterialId)
    }
  } else if (action.type === "UPDATE_WORKSPACES_EDIT_MODE_STATE") {
    return {...state, editMode: {...state.editMode, ...action.payload}}
  }
  return state;
}

export function organizationWorkspaces(state:OrganizationWorkspacesType = {
    availableWorkspaces: [],
    availableFilters: {
      educationTypes: [],
      curriculums: [],
    },
    state: "LOADING",
    activeFilters: {
      educationFilters: [],
      curriculumFilters: [],
      query: "",
    },
    hasMore: false,
    toolbarLock: false,
    types: null,

  }, action: ActionType): OrganizationWorkspacesType {
    if (action.type === "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES"){
      return Object.assign({}, state, {
        availableFilters: Object.assign({}, state.availableFilters, {
          educationTypes: action.payload
        })
      });
    }
    else if (action.type === "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS"){
      return Object.assign({}, state, {
        availableFilters: Object.assign({}, state.availableFilters, {
          curriculums: action.payload
        })
      });
    } else if (action.type === "UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS"){
      return Object.assign({}, state, action.payload);
    } else if (action.type === "UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS"){
      return Object.assign({}, state, {
        activeFilters: action.payload
      });
    } else if (action.type === "UPDATE_ORGANIZATION_WORKSPACES_STATE"){
      return Object.assign({}, state, {
        state: action.payload
      });
    }
    return state;
}

