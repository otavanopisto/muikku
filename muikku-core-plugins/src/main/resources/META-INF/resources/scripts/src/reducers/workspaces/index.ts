import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { SelectItem } from "~/actions/workspaces/index";
import {
  AssessmentRequest,
  WorkspaceAdditionalInfo,
  WorkspaceChatStatus,
  WorkspaceDetails,
  WorkspaceEducationType,
  WorkspaceMaterialProducer,
  WorkspaceSignupGroup,
  UserStaff,
  UserStaffSearchResult,
  WorkspaceStudentSearchResult,
  WorkspaceType,
  MaterialCompositeReply,
  MaterialContentNode,
  DiscussionWorkspaceStatistic,
  WorkspaceSubject,
  Language,
} from "~/generated/client";
import { repairContentNodes } from "~/util/modifiers";
import { AudioAssessment } from "../../@types/evaluation";

/**
 * WorkspaceBasicInfo
 */
/* export interface WorkspaceBasicInfo {
  id: number;
  name: string;
  urlName: string;
  nameExtension?: string | null;
} */

/**
 * OrganizationCourseTeacherType
 */
/* export interface OrganizationCourseTeacherType {
  firstName: string;
  lastName: string;
  hasImage: boolean;
} */

/**
 * CreateWorkspaceType
 */
export interface CreateWorkspaceType {
  name: string;
  template: number;
  curriculum: string;
}

export type UserSelectLoader = "WAIT" | "LOADING" | "READY" | "ERROR";
/* export type LoadWorkspaceActionType =
  | "UPDATE_WORKSPACE"
  | "UPDATE_ORGANIZATION_SELECTED_WORKSPACE"; */
export type WorkspaceAssessementStateType =
  | "transferred"
  | "unassessed"
  | "pending"
  | "pending_pass"
  | "pending_fail"
  | "pass"
  | "fail"
  | "incomplete"
  | "interim_evaluation_request"
  | "interim_evaluation";

/**
 * Assessment
 */
export interface Assessment {
  date: string;
  state: WorkspaceAssessementStateType;
  grade: string;
  passingGrade: boolean;
  text: string;
  workspaceSubjectIdentifier: string | null;
}

/**
 * WorkspaceActivityType
 */
export interface WorkspaceActivityType {
  assessmentState: Assessment[];
  evaluablesAnswered: number;
  evaluablesAnsweredLastDate: string;
  evaluablesDonePercent: number;
  evaluablesFailed: number;
  evaluablesFailedLastDate?: string;
  evaluablesIncomplete: number;
  evaluablesIncompleteLastDate?: string;
  evaluablesPassed: number;
  evaluablesPassedLastDate?: string;
  evaluablesSubmitted: number;
  evaluablesSubmittedLastDate?: string;
  evaluablesTotal: number;
  evaluablesUnanswered: number;
  exercisesAnswered: number;
  exercisesAnsweredLastDate: string;
  exercisesDonePercent: number;
  exercisesTotal: number;
  exercisesUnanswered: number;
  journalEntryCount: number;
  lastJournalEntry?: string;
  lastVisit?: string;
  numVisits: number;
}

/**
 * WorkspaceStudentActivityType
 */
/* export interface WorkspaceStudentActivityType {
  assessmentState: Assessment;
  evaluablesAnswered: number;
  evaluablesAnsweredLastDate: string;
  evaluablesDonePercent: number;
  evaluablesFailed: number;
  evaluablesFailedLastDate?: string;
  evaluablesIncomplete: number;
  evaluablesIncompleteLastDate?: string;
  evaluablesPassed: number;
  evaluablesPassedLastDate?: string;
  evaluablesSubmitted: number;
  evaluablesSubmittedLastDate?: string;
  evaluablesTotal: number;
  evaluablesUnanswered: number;
  exercisesAnswered: number;
  exercisesAnsweredLastDate: string;
  exercisesDonePercent: number;
  exercisesTotal: number;
  exercisesUnanswered: number;
  journalEntryCount: number;
  lastJournalEntry?: string;
  lastVisit?: string;
  numVisits: number;
} */

/**
 * WorkspaceForumStatisticsType
 */
export interface WorkspaceForumStatisticsType {
  messageCount: number;
  latestMessage: string; //represents a date
}

/**
 * WorkspaceStudentAssessmentType
 */
export interface WorkspaceStudentAssessmentType {
  assessorEntityId: number;
  evaluated: string;
  gradeIdentifier: string;
  gradeSchoolDataSource: string;
  grade: string;
  gradingScale: string;
  gradingScaleIdentifier: string;
  gradingScaleSchoolDataSource: string;
  identifier: string;
  passed: boolean;
  verbalAssessment: string;
  workspaceStudentId: string;
}

/**
 * WorkspaceStudentAssessmentsType
 */
export interface WorkspaceStudentAssessmentsType {
  assessmentState: WorkspaceAssessementStateType;
  assessmentStateDate: string;
  assessments: Array<WorkspaceStudentAssessmentType>;
}

/**
 * ActivityLogType
 */
export interface ActivityLogType {
  type:
    | "EVALUATION_REQUESTED"
    | "EVALUATION_GOTINCOMPLETED"
    | "EVALUATION_GOTFAILED"
    | "EVALUATION_GOTPASSED"
    | "WORKSPACE_VISIT"
    | "MATERIAL_EXERCISEDONE"
    | "MATERIAL_ASSIGNMENTDONE"
    | "SESSION_LOGGEDIN"
    | "FORUM_NEWMESSAGE"
    | "FORUM_NEWTHREAD"
    | "NOTIFICATION_ASSESMENTREQUEST"
    | "NOTIFICATION_NOPASSEDCOURSES"
    | "NOTIFICATION_SUPPLEMENTATIONREQUEST"
    | "NOTIFICATION_STUDYTIME";
  timestamp: string;
  contextId?: number;
}

/**
 * WorkspaceActivityRecordType
 */
export interface WorkspaceActivityRecordType {
  type: string;
  date: string;
}

/**
 * WorkspaceActivityStatisticsType
 */
export interface WorkspaceActivityStatisticsType {
  records: WorkspaceActivityRecordType[];
}

/**
 * WorkspaceJournalType
 */
export interface WorkspaceJournalType {
  id: number;
  workspaceEntityId: number;
  userEntityId: number;
  firstName: string;
  lastName: string;
  content: string;
  title: string;
  created: string;
  commentCount: number;
}

export type WorkspaceJournalListType = Array<WorkspaceJournalType>;

/**
 * WorkspaceJournalsType
 */
export interface WorkspaceJournalsType {
  journals: WorkspaceJournalListType;
  currentJournal?: WorkspaceJournalType;
  hasMore: boolean;
  userEntityId?: number;
  state: WorkspacesStateType;
}

/**
 * WorkspaceAssessmentRequestType
 */
/* export interface WorkspaceAssessmentRequestType {
  id: string;
  userIdentifier: string;
  workspaceUserIdentifier: string;
  requestText: string;
  date: string;
  workspaceEntityId: number;
  userEntityId: number;
} */

/**
 * WorkspaceInterminEvaluationRequest
 */
export interface WorkspaceInterimEvaluationRequest {
  id: number;
  userEntityId: number;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  requestDate: Date;
  cancellationDate: Date;
  requestText: string;
  archived: boolean;
}

/**
 * WorkspaceSubjectType
 */
export interface WorkspaceSubjectType {
  code: string;
  identifier: string;
  name: string;
  schoolDataSource: string;
}

/**
 * WorkspaceCourseLengthSymbolType
 */
export interface WorkspaceCourseLengthSymbolType {
  id: string;
  name: string;
  schoolDataSource: string;
  symbol: string;
}

/**
 * WorkspaceSubject
 */
/* export interface WorkspaceSubject {
  identifier: string;
  subject?: WorkspaceSubjectType;
  courseNumber?: number;
  courseLength?: string;
  courseLengthSymbol?: WorkspaceCourseLengthSymbolType;
} */

/**
 * WorkspaceAdditionalInfoType
 */
/* export interface WorkspaceAdditionalInfoType {
  beginDate: string;
  endDate: string;
  viewLink: string;
  workspaceTypeId?: string;
  workspaceType?: string;
  educationType?: {
    identifier: {
      dataSource: string;
      identifier: string;
    };
    name: string;
    schoolDataSource: string;
  };
  subjects: WorkspaceSubject[];
} */

/**
 * WorkspaceProducerType
 */
export interface WorkspaceProducerType {
  name: string;
  id?: number;
}

/**
 * UserSelectType
 */
export interface UserSelectType {
  users?: Array<SelectItem>;
  state?: UserSelectLoader;
}

/**
 * WorkspaceDetailsType
 */
/* export interface WorkspaceDetailsType {
  beginDate: string;
  endDate: string;
  signupStart: string;
  signupEnd: string;
  externalViewUrl: string;
  typeId: string;
  rootFolderId: number;
  helpFolderId: number;
  indexFolderId: number;
} */

export enum WorkspaceMandatority {
  MANDATORY = "MANDATORY",
  SCHOOL_LEVEL_OPTIONAL = "SCHOOL_LEVEL_OPTIONAL",
  NATIONAL_LEVEL_OPTIONAL = "NATIONAL_LEVEL_OPTIONAL",
  UNSPECIFIED_OPTIONAL = "UNSPECIFIED_OPTIONAL",
}

export type WorkspaceAccessType = "MEMBERS_ONLY" | "LOGGED_IN" | "ANYONE";

/**
 * WorkspaceStudentAssessmentStateType
 */
export interface WorkspaceStudentAssessmentStateType {
  date: string;
  state: WorkspaceAssessementStateType;
  grade?: string;
  text?: string;
}

/* export type WorkspaceChatStatusType = "ENABLED" | "DISABLED"; */

/**
 * WorkspacePermissionsType
 */
/* export interface WorkspacePermissionsType {
  workspaceEntityId: number;
  userGroupEntityId: number;
  userGroupName: string;
  canSignup: boolean;
} */

export type TemplateWorkspaceListType = Array<TemplateWorkspaceType>;

/**
 * TemplateWorkspaceType
 */
export interface TemplateWorkspaceType {
  id: number;
  name: string;
  nameExtension?: string | null;
}

/**
 * Language options for workspace
 * used as lang attribute jsx
 */
export const languageOptions = Object.values(Language);
/* export const languageOptions = [
  "fi",
  "en",
  "sv",
  "de",
  "ru",
  "ja",
  "es",
] as const; */

/**
 * Language
 */
/* export type Language = typeof languageOptions[number]; */

/**
 * WorkspaceDataType
 */
export interface WorkspaceDataType {
  archived: boolean;
  curriculumIdentifiers: Array<string>;
  description: string;
  hasCustomImage: boolean;
  id: number;
  lastVisit: string;
  materialDefaultLicense: string;
  language: Language;
  name: string;
  nameExtension?: string | null;
  numVisits: number;
  published: boolean;
  urlName: string;
  chatStatus?: WorkspaceChatStatus;
  //These are usually part of the workspace but don't appear in certain occassions
  //Usually available if internally loaded
  access?: WorkspaceAccessType;
  //These appear in certain circumstances
  //this one is actually also available in the current workspace in workspace/
  isCourseMember?: boolean;
  educationTypeName?: string;

  /**
   * aka "modules", always contains at least one or more if it is combination workspace
   */
  subjects?: WorkspaceSubject[];

  //These are optional addons, and are usually not available
  activity?: WorkspaceActivityType;
  studentActivity?: WorkspaceActivityType;
  forumStatistics?: DiscussionWorkspaceStatistic;
  studentAssessments?: WorkspaceStudentAssessmentsType;
  activityStatistics?: WorkspaceActivityStatisticsType;
  assessmentRequests?: AssessmentRequest[];
  interimEvaluationRequests?: WorkspaceInterimEvaluationRequest[];
  additionalInfo?: WorkspaceAdditionalInfo;
  staffMembers?: UserStaffSearchResult;
  staffMemberSelect?: UserSelectType;
  producers?: WorkspaceMaterialProducer[];
  contentDescription?: MaterialContentNode;
  activityLogs?: ActivityLogType[];
  students?: WorkspaceStudentSearchResult;
  inactiveStudents?: WorkspaceStudentSearchResult;
  studentsSelect?: UserSelectType;
  details?: WorkspaceDetails;
  permissions?: WorkspaceSignupGroup[];
  mandatority?: WorkspaceMandatority | null;
  //Fancy stuff in here
  journals?: WorkspaceJournalsType;

  // These are only in organizationlistings
  teachers?: UserStaff[];
  studentCount?: number;
}

export type WorkspaceUpdateType = Partial<WorkspaceDataType>;

/**
 * WorkspaceMaterialReferenceType
 */
export interface WorkspaceMaterialReferenceType {
  workspaceName: string;
  workspaceId: number;
  materialName: string;
  url: string;
}

/* export type WorkspaceListType = Array<WorkspaceDataType>; */

/**
 * WorkspaceSignUpDetails
 */
export interface WorkspaceSignUpDetails {
  id: number;
  name: string;
  nameExtension: string | null;
  urlName: string;
}

export type WorkspaceBaseFilterType =
  | "ALL_COURSES"
  | "MY_COURSES"
  | "UNPUBLISHED";

/**
 * WorkspaceEducationFilterType
 */
/* export interface WorkspaceEducationFilterType {
  identifier: string;
  name: string;
} */

/* export type WorkspaceEducationFilterListType = Array<WorkspaceEducationType>; */

/**
 * WorkspaceCurriculumFilterType
 */
export interface WorkspaceCurriculumFilterType {
  identifier: string;
  name: string;
}

/**
 * WorkspaceOrganizationFilterType
 */
export interface WorkspaceOrganizationFilterType {
  identifier: string;
  name: string;
}

/**
 * WorkspaceStateFilterType
 */
export interface WorkspaceStateFilterType {
  identifier: string;
  name: string;
}

export type WorkspaceCurriculumFilterListType =
  Array<WorkspaceCurriculumFilterType>;
export type WorkspaceOrganizationFilterListType =
  Array<WorkspaceOrganizationFilterType>;
export type WorkspaceBaseFilterListType = Array<WorkspaceBaseFilterType>;
export type WorkspaceStateFilterListType = Array<WorkspaceStateFilterType>;

/**
 * WorkspacesavailableFiltersType
 */
export interface WorkspacesavailableFiltersType {
  educationTypes: WorkspaceEducationType[];
  curriculums: WorkspaceCurriculumFilterListType;
  organizations?: WorkspaceOrganizationFilterListType;
  baseFilters?: WorkspaceBaseFilterListType;
  stateFilters?: WorkspaceStateFilterListType;
}

/**
 * OrganizationWorkspacesAvailableFiltersType
 */
/* export interface OrganizationWorkspacesAvailableFiltersType {
  educationTypes: WorkspaceEducationType[];
  curriculums: WorkspaceCurriculumFilterListType;
  stateFilters?: WorkspaceStateFilterListType;
} */

export type WorkspacesStateType =
  | "LOADING"
  | "LOADING_MORE"
  | "ERROR"
  | "READY";

/**
 * OrganizationWorkspacesActiveFiltersType
 */
/* export interface OrganizationWorkspacesActiveFiltersType {
  educationFilters: Array<string>;
  curriculumFilters: Array<string>;
  query: string;
} */

/**
 * WorkspacesActiveFiltersType
 */
export interface WorkspacesActiveFiltersType {
  educationFilters: Array<string>;
  curriculumFilters: Array<string>;
  query: string;
  templates?: string;
  baseFilter?: WorkspaceBaseFilterType;
  organizationFilters?: Array<string>;
  stateFilters?: Array<string>;
}

/**
 * WorkspaceTypeType
 */
/* export interface WorkspaceTypeType {
  identifier: string;
  name: string;
} */

/**
 * WorkspaceEditModeStateType
 */
export interface WorkspaceEditModeStateType {
  available: boolean;
  active: boolean;
}

//section = true && currentNodeValue = null && parentNodeValue = null   (new section)
//section = false && currentNodeValue = null && parentNodeValue = x     (new material)
//section = true && currentNodeValue = x && parentNodeValue = null      (edit section)
//section = false && currentNodeValue = x && parentNodeValue = x        (edit material)
/**
 * WorkspaceMaterialEditorType
 */
export interface WorkspaceMaterialEditorType {
  currentNodeWorkspace: WorkspaceDataType;
  currentNodeValue?: MaterialContentNode;
  currentDraftNodeValue?: MaterialContentNode;
  parentNodeValue?: MaterialContentNode;
  section: boolean;
  opened: boolean;
  canDelete: boolean;
  canHide: boolean;
  disablePlugins: boolean;
  canPublish: boolean;
  canRevert: boolean;
  canRestrictView: boolean;
  canCopy: boolean;
  canChangePageType: boolean;
  canChangeExerciseType: boolean;
  canSetLicense: boolean;
  canSetProducers: boolean;
  canAddAttachments: boolean;
  canEditContent: boolean;
  canSetTitle: boolean;
  showRemoveAnswersDialogForPublish: boolean;
  showRemoveAnswersDialogForDelete: boolean;
  showUpdateLinkedMaterialsDialogForPublish: boolean;
  showRemoveLinkedAnswersDialogForPublish: boolean;
  showUpdateLinkedMaterialsDialogForPublishCount: number;
}

/**
 * WorkspaceMaterialExtraTools
 */
export interface WorkspaceMaterialExtraTools {
  opened: boolean;
}

/* export type MaterialCorrectAnswersType = "ALWAYS" | "ON_REQUEST" | "NEVER"; */

/**
 * MaterialAssignmentType
 */
/* export interface MaterialAssignmentType {
  id: number;
  materialId: number;
  parentId: number;
  nextSiblingId: number;
  hidden: boolean;
  assignmentType: AssignmentType;
  correctAnswers: string;
  path: string;
  title: string;
} */

/**
 * MaterialContentNodeProducerType
 */
/* export interface MaterialContentNodeProducerType {
  id: number;
  name: string;
  materialId: number;
} */

/**
 * MaterialViewRestriction
 */
/* export enum MaterialViewRestriction {
  NONE = "NONE",
  LOGGED_IN = "LOGGED_IN",
  WORKSPACE_MEMBERS = "WORKSPACE_MEMBERS",
} */

/* export type AssignmentType =
  | "EXERCISE"
  | "EVALUATED"
  | "JOURNAL"
  | "INTERIM_EVALUATION"; */

/**
 * MaterialContentNodeType
 */
/* export interface MaterialContentNodeType {
  title: string;
  titleLanguage?: Language | null;
  license: string;
  viewRestrict: MaterialViewRestriction;
  html: string;
  contentType: string;
  contentHiddenForUser: boolean;
  //Standard Fields (only available when loaded through materials rest endpoint)
  id?: number;

  //Extended Fields (only available when loaded via content node rest endpoint)
  type?: string;
  children?: Array<MaterialContentNode>;
  workspaceMaterialId?: number;
  materialId?: number;
  level?: number;
  assignmentType?: AssignmentType;
  correctAnswers?: MaterialCorrectAnswersType;
  hidden?: boolean;
  parentId?: number;
  nextSiblingId?: number;
  path?: string;
  producers?: MaterialContentNodeProducerType[];

  //Assigned fields
  childrenAttachments?: Array<MaterialContentNode>; // this is usually missing and has to be manually retrieved
  evaluation?: MaterialEvaluationType;
  assignment?: MaterialContentNode;
} */

/**
 * MaterialAnswerType
 */
/* export interface MaterialAnswerType {
  embedId: string;
  fieldName: string;
  materialId: number;
  value: string;
  workspaceMaterialId: number;
} */

/**
 * MaterialCompositeRepliesStateType
 */
export type MaterialCompositeRepliesStateType =
  | "UNANSWERED"
  | "ANSWERED"
  | "SUBMITTED"
  | "WITHDRAWN"
  | "PASSED"
  | "FAILED"
  | "INCOMPLETE";

/**
 * MaterialCompositeRepliesType
 */
/* export interface MaterialCompositeRepliesType {
  answers: Array<MaterialAnswerType>;
  state: MaterialCompositeRepliesStateType;
  // evaluationInfo of the material assignments
  evaluationInfo?: MaterialEvaluationInfo;

  //Available when loaded specifically (eg. via records)
  created: string;
  lastModified: string;
  submitted: string;
  withdrawn?: string;

  //Available when loaded generically (eg. via workspace material)
  workspaceMaterialId: number;
  workspaceMaterialReplyId: number;
} */

/**
 * MaterialEvaluationInfo
 */
/* export interface MaterialEvaluationInfo {
  id: number;
  type: MaterialCompositeRepliesStateType;
  evaluationType: AssignmentEvaluationType;
  text: string;
  grade: string;
  date: string;
  audioAssessments: AudioAssessment[];
} */

/* export type MaterialCompositeRepliesListType = Array<MaterialCompositeReply>; */

/**
 * MaterialEvaluationType
 */
export interface MaterialEvaluationType {
  id: number;
  evaluated: string;
  assessorEntityId: number;
  studentEntityId: number;
  workspaceMaterialId: number;
  gradingScaleIdentifier: string;
  gradingScaleSchoolDataSource: string;
  grade: string;
  gradeIdentifier: string;
  gradeSchoolDataSource: string;
  gradingScale: string;
  verbalAssessment: string;
  passed: boolean;
  audioAssessments: AudioAssessment[];
}

/* export type MaterialContentNodeListType = Array<MaterialContentNode>; */

/**
 * WorkspacesState
 */
export interface WorkspacesState {
  state: WorkspacesStateType;
  // Last workspace that was opened
  lastWorkspace?: WorkspaceMaterialReferenceType;
  lastWorkspaces?: WorkspaceMaterialReferenceType[];
  // Following is data related to current workspace
  currentWorkspace?: WorkspaceDataType;
  currentHelp?: MaterialContentNode[];
  currentMaterials?: MaterialContentNode[];
  currentMaterialsActiveNodeId?: number;
  currentMaterialsReplies?: MaterialCompositeReply[];

  // Curriculums
  availableCurriculums?: WorkspaceCurriculumFilterListType;

  // Filters related to workspaces
  availableFilters: WorkspacesavailableFiltersType;
  activeFilters: WorkspacesActiveFiltersType;

  // List of different workspaces. Used different places like workspace picker etc
  availableWorkspaces: WorkspaceDataType[];
  userWorkspaces?: WorkspaceDataType[];

  // Other workspace related data
  templateWorkspaces: TemplateWorkspaceType[];
  types?: WorkspaceType[];
  hasMore: boolean;
  toolbarLock: boolean;

  // Workspace material editor and boolean to indicate if edit mode is active
  editMode?: WorkspaceEditModeStateType;
  materialEditor?: WorkspaceMaterialEditorType;
  materialExtraTools?: WorkspaceMaterialExtraTools;
}

export type WorkspacesStatePatch = Partial<WorkspacesState>;

/**
 * initialWorkspacesState
 */
const initialWorkspacesState: WorkspacesState = {
  state: "LOADING",
  lastWorkspace: null,
  lastWorkspaces: [],
  currentWorkspace: null,
  currentHelp: null,
  currentMaterials: null,
  currentMaterialsReplies: null,
  currentMaterialsActiveNodeId: null,
  availableCurriculums: null,
  activeFilters: {
    educationFilters: [],
    curriculumFilters: [],
    organizationFilters: [],
    templates: "ONLY_WORKSPACES",
    query: "",
    baseFilter: "ALL_COURSES",
  },
  availableFilters: {
    educationTypes: [],
    curriculums: [],
    organizations: [],
    baseFilters: ["ALL_COURSES", "MY_COURSES", "UNPUBLISHED"],
  },
  availableWorkspaces: [],
  userWorkspaces: [],
  templateWorkspaces: [],
  types: null,
  hasMore: false,
  toolbarLock: false,
  editMode: {
    active: false,
    available: false,
  },
  materialEditor: {
    currentNodeWorkspace: null,
    currentNodeValue: null,
    currentDraftNodeValue: null,
    parentNodeValue: null,
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
    showRemoveLinkedAnswersDialogForPublish: false,
    showUpdateLinkedMaterialsDialogForPublishCount: 0,
    canSetTitle: true,
  },
  materialExtraTools: {
    opened: false,
  },
};

/**
 * Reducer function for workspaces
 *
 * @param state state
 * @param action action
 * @returns State of workspaces
 */
export const workspaces: Reducer<WorkspacesState> = (
  state = initialWorkspacesState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_USER_WORKSPACES":
      return { ...state, userWorkspaces: action.payload };

    case "UPDATE_AVAILABLE_CURRICULUMS":
      return { ...state, availableCurriculums: action.payload };

    case "UPDATE_LAST_WORKSPACES":
      return { ...state, lastWorkspaces: action.payload };

    case "SET_CURRENT_WORKSPACE":
      return { ...state, currentWorkspace: action.payload };

    case "UPDATE_CURRENT_WORKSPACE_ACTIVITY": {
      return {
        ...state,
        currentWorkspace: {
          ...state.currentWorkspace,
          activity: action.payload,
        },
      };
    }

    case "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS": {
      return {
        ...state,
        currentWorkspace: {
          ...state.currentWorkspace,
          assessmentRequests: action.payload,
        },
      };
    }

    case "UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS": {
      return {
        ...state,
        currentWorkspace: {
          ...state.currentWorkspace,
          interimEvaluationRequests: action.payload,
        },
      };
    }

    /* case "UPDATE_WORKSPACE_ASSESSMENT_STATE":
      return {
        ...state,
        currentWorkspace: processWorkspaceToHaveNewAssessmentStateAndDate(
          action.payload.workspace.id,
          action.payload.newState,
          action.payload.newDate,
          action.payload.newAssessmentRequest ||
            action.payload.oldAssessmentRequestToDelete,
          !!action.payload.oldAssessmentRequestToDelete,
          state.currentWorkspace
        ),
        availableWorkspaces: state.availableWorkspaces.map(
          processWorkspaceToHaveNewAssessmentStateAndDate.bind(
            this,
            action.payload.workspace.id,
            action.payload.newState,
            action.payload.newDate,
            action.payload.newAssessmentRequest
          )
        ),
        userWorkspaces: state.userWorkspaces.map(
          processWorkspaceToHaveNewAssessmentStateAndDate.bind(
            this,
            action.payload.workspace.id,
            action.payload.newState,
            action.payload.newDate,
            action.payload.newAssessmentRequest
          )
        ),
      }; */

    case "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          educationTypes: action.payload,
        }),
      };

    case "UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          stateFilters: action.payload,
        }),
      };

    case "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          curriculums: action.payload,
        }),
      };

    case "UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          organizations: action.payload,
        }),
      };

    case "UPDATE_WORKSPACES_ACTIVE_FILTERS":
      return { ...state, activeFilters: action.payload };

    case "UPDATE_WORKSPACES_ALL_PROPS":
      return Object.assign({}, state, action.payload);

    case "UPDATE_WORKSPACES_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_WORKSPACE": {
      let newCurrent = state.currentWorkspace;
      if (newCurrent && newCurrent.id === action.payload.original.id) {
        newCurrent = { ...newCurrent, ...action.payload.update };
      }
      return {
        ...state,
        currentWorkspace: newCurrent,
        availableWorkspaces: state.availableWorkspaces.map((w) => {
          if (w.id === action.payload.original.id) {
            return { ...w, ...action.payload.update };
          }
          return w;
        }),
        userWorkspaces: state.userWorkspaces.map((w) => {
          if (w.id === action.payload.original.id) {
            return { ...w, ...action.payload.update };
          }
          return w;
        }),
      };
    }

    case "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS":
      return { ...state, currentMaterials: action.payload };

    case "UPDATE_WORKSPACES_SET_CURRENT_HELP":
      return { ...state, currentHelp: action.payload };

    case "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID":
      return { ...state, currentMaterialsActiveNodeId: action.payload };

    case "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES":
      return { ...state, currentMaterialsReplies: action.payload };

    case "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER": {
      let wasUpdated = false;
      let newCurrentMaterialsReplies = state.currentMaterialsReplies.map(
        (compositeReplies: MaterialCompositeReply) => {
          if (
            compositeReplies.workspaceMaterialId ===
            action.payload.workspaceMaterialId
          ) {
            wasUpdated = true;
            return { ...compositeReplies, ...action.payload };
          }
          return compositeReplies;
        }
      );
      if (!wasUpdated) {
        newCurrentMaterialsReplies = newCurrentMaterialsReplies.concat([
          <MaterialCompositeReply>{ ...action.payload },
        ]);
      }
      return { ...state, currentMaterialsReplies: newCurrentMaterialsReplies };
    }

    case "UPDATE_MATERIAL_CONTENT_NODE": {
      let found = false;
      let newCurrentWorkspace = state.currentWorkspace;
      if (
        !action.payload.isDraft &&
        !found &&
        newCurrentWorkspace.contentDescription.workspaceMaterialId ===
          action.payload.material.workspaceMaterialId
      ) {
        found = true;
        newCurrentWorkspace = { ...newCurrentWorkspace };
        newCurrentWorkspace.contentDescription = {
          ...newCurrentWorkspace.contentDescription,
          ...action.payload.update,
        };
      }

      /**
       * mapMaterial
       * @param m m
       */
      const mapMaterial = (m: MaterialContentNode) => {
        if (action.payload.isDraft) {
          return m;
        }

        if (found) {
          return m;
        }

        if (
          m.workspaceMaterialId === action.payload.material.workspaceMaterialId
        ) {
          found = true;
          return { ...m, ...action.payload.update };
        }

        const newM: MaterialContentNode = {
          ...m,
          children: m.children ? m.children.map(mapMaterial) : m.children,
        };
        if (newM.childrenAttachments) {
          newM.childrenAttachments = newM.childrenAttachments.map(mapMaterial);
        }
        return newM;
      };

      let newEditor = state.materialEditor;
      if (
        !action.payload.isDraft &&
        newEditor &&
        newEditor.currentNodeValue &&
        newEditor.currentNodeValue.workspaceMaterialId ===
          action.payload.material.workspaceMaterialId
      ) {
        newEditor = { ...newEditor };
        newEditor.currentNodeValue = {
          ...newEditor.currentNodeValue,
          ...action.payload.update,
        };
      } else if (
        !action.payload.isDraft &&
        newEditor &&
        newEditor.parentNodeValue &&
        newEditor.parentNodeValue.workspaceMaterialId ===
          action.payload.material.workspaceMaterialId
      ) {
        newEditor = { ...newEditor };
        newEditor.parentNodeValue = {
          ...newEditor.parentNodeValue,
          ...action.payload.update,
        };
      } else if (
        action.payload.isDraft &&
        newEditor &&
        newEditor.currentDraftNodeValue &&
        newEditor.currentDraftNodeValue.workspaceMaterialId ===
          action.payload.material.workspaceMaterialId
      ) {
        newEditor = { ...newEditor };
        newEditor.currentDraftNodeValue = {
          ...newEditor.currentDraftNodeValue,
          ...action.payload.update,
        };
      }
      newEditor.showRemoveAnswersDialogForPublish =
        action.payload.showRemoveAnswersDialogForPublish;
      newEditor.showUpdateLinkedMaterialsDialogForPublish =
        action.payload.showUpdateLinkedMaterialsDialogForPublish;
      newEditor.showUpdateLinkedMaterialsDialogForPublishCount =
        action.payload.showUpdateLinkedMaterialsDialogForPublishCount;
      newEditor.showRemoveLinkedAnswersDialogForPublish =
        action.payload.showRemoveLinkedAnswersDialogForPublish;

      return {
        ...state,
        currentWorkspace: newCurrentWorkspace,
        currentMaterials: state.currentMaterials
          ? state.currentMaterials.map(mapMaterial)
          : state.currentMaterials,
        currentHelp: state.currentHelp
          ? state.currentHelp.map(mapMaterial)
          : state.currentHelp,
        materialEditor: newEditor,
      };
    }

    case "DELETE_MATERIAL_CONTENT_NODE": {
      /**
       * filterMaterial
       * @param m m
       */
      const filterMaterial = (m: MaterialContentNode) => {
        // Sometimes I get id sometimes workspaceMaterialId, super inconsistent
        if (
          typeof m.id !== "undefined" &&
          typeof action.payload.id !== "undefined" &&
          m.id === action.payload.id
        ) {
          return false;
        } else if (
          typeof m.workspaceMaterialId !== "undefined" &&
          typeof action.payload.workspaceMaterialId !== "undefined" &&
          m.workspaceMaterialId === action.payload.workspaceMaterialId
        ) {
          return false;
        }

        return true;
      };
      /**
       * mapMaterial
       * @param m m
       * @param index index
       * @param arr arr
       */
      const mapMaterial = (
        m: MaterialContentNode,
        index: number,
        arr: Array<MaterialContentNode>
      ) => {
        const nextSiblingId = arr[index + 1]
          ? arr[index + 1].workspaceMaterialId
          : null;
        const newM: MaterialContentNode = {
          ...m,
          nextSiblingId,
          children: m.children
            ? m.children.filter(filterMaterial).map(mapMaterial)
            : m.children,
        };
        if (newM.childrenAttachments) {
          newM.childrenAttachments =
            newM.childrenAttachments.filter(filterMaterial);
        }
        return newM;
      };

      let newEditor = state.materialEditor;
      if (
        newEditor &&
        (newEditor.currentNodeValue.workspaceMaterialId ===
          action.payload.workspaceMaterialId ||
          (newEditor.parentNodeValue &&
            newEditor.parentNodeValue.workspaceMaterialId ===
              action.payload.workspaceMaterialId))
      ) {
        newEditor = {
          currentNodeValue: null,
          parentNodeValue: null,
          currentNodeWorkspace: null,
          opened: false,
          ...newEditor,
        };
      }
      if (
        newEditor &&
        newEditor.currentNodeValue &&
        newEditor.currentNodeValue.childrenAttachments
      ) {
        newEditor = { ...newEditor };
        newEditor.currentNodeValue = { ...newEditor.currentNodeValue };
        newEditor.currentNodeValue.childrenAttachments =
          newEditor.currentNodeValue.childrenAttachments.filter(filterMaterial);
      }
      return {
        ...state,
        currentMaterials: state.currentMaterials
          ? state.currentMaterials.filter(filterMaterial).map(mapMaterial)
          : state.currentMaterials,
        currentHelp: state.currentHelp
          ? state.currentHelp.filter(filterMaterial).map(mapMaterial)
          : state.currentHelp,
        materialEditor: newEditor,
      };
    }

    case "INSERT_MATERIAL_CONTENT_NODE": {
      const apiPath = action.payload.apiPath;
      const insertedContentNode: MaterialContentNode =
        action.payload.nodeContent;

      const targetArray =
        apiPath === "help"
          ? [...state.currentHelp]
          : [...state.currentMaterials];

      // Checks if its new page or section
      if (
        insertedContentNode.parentId !==
          state.currentWorkspace.details.helpFolderId &&
        insertedContentNode.parentId !==
          state.currentWorkspace.details.rootFolderId
      ) {
        //Finding index of section that is getting new page
        const targetIndex = targetArray.findIndex(
          (cn) => cn.workspaceMaterialId === insertedContentNode.parentId
        );

        // Finding index of that children that will be follewd by new pages
        const targetChildrenIndex = targetArray[targetIndex].children.findIndex(
          (node) =>
            node.workspaceMaterialId === insertedContentNode.nextSiblingId
        );

        if (targetChildrenIndex !== -1) {
          // If target children index is found,
          // Asserting new page to right position in children array
          targetArray[targetIndex].children.splice(
            targetChildrenIndex,
            0,
            insertedContentNode
          );
        } else {
          // Otherwise
          targetArray[targetIndex].children.push(insertedContentNode);
        }
      } else if (insertedContentNode.nextSiblingId) {
        const siblingIndex = targetArray.findIndex(
          (cn) => cn.workspaceMaterialId === insertedContentNode.nextSiblingId
        );
        targetArray.splice(siblingIndex, 0, insertedContentNode);
      } else {
        targetArray.push(insertedContentNode);
      }

      if (apiPath === "help") {
        return {
          ...state,
          currentHelp: repairContentNodes(targetArray),
        };
      } else {
        return {
          ...state,
          currentMaterials: repairContentNodes(targetArray),
        };
      }
    }

    case "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES":
      return {
        ...state,
        currentMaterials: repairContentNodes(
          state.currentMaterials,
          action.payload.newPath,
          action.payload.material.workspaceMaterialId
        ),
        currentHelp: repairContentNodes(
          state.currentHelp,
          action.payload.newPath,
          action.payload.material.workspaceMaterialId
        ),
      };

    case "UPDATE_WORKSPACES_EDIT_MODE_STATE":
      return { ...state, editMode: { ...state.editMode, ...action.payload } };

    case "MATERIAL_UPDATE_SHOW_EXTRA_TOOLS":
      return {
        ...state,
        materialExtraTools: {
          ...state.materialExtraTools,
          opened: !state.materialExtraTools.opened,
        },
      };

    default:
      return state;
  }
};

/* function processWorkspaceToHaveNewAssessmentStateAndDate(
  id: number,
  assessmentState: WorkspaceAssessementStateType,
  date: string,
  assessmentRequestObject: AssessmentRequest,
  deleteAssessmentRequestObject: boolean,
  workspace: WorkspaceDataType
) {

  let replacement =
    workspace && workspace.id === id ? { ...workspace } : workspace;
  if (replacement && replacement.id === id) {
    if (replacement.studentActivity) {
      replacement.studentActivity = {
        ...replacement.studentActivity,
        assessmentState: {
          ...replacement.studentActivity.assessmentState,
          date,
          state: assessmentState,
        },
      };
    }
    if (replacement.studentAssessments) {
      replacement.studentAssessments = {
        ...replacement.studentAssessments,
        assessmentState,
        assessmentStateDate: date,
        assessments: replacement.studentAssessments.assessments,
      };
    }
    if (replacement.assessmentRequests) {
      const index = replacement.assessmentRequests.findIndex(
        (r) => r.id === assessmentRequestObject.id
      );
      replacement.assessmentRequests = [...replacement.assessmentRequests];
      if (index !== -1) {
        if (deleteAssessmentRequestObject) {
          replacement.assessmentRequests.splice(index, 1);
        } else {
          replacement.assessmentRequests[index] = assessmentRequestObject;
        }
      } else if (!deleteAssessmentRequestObject) {
        replacement.assessmentRequests.push(assessmentRequestObject);
      }
    }
  }
  return replacement;
} */
