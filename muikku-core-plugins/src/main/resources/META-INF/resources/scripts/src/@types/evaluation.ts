import {
  WorkspaceType,
  WorkspaceJournalListType,
  MaterialContentNodeListType,
  MaterialCompositeRepliesType,
} from "../reducers/workspaces/index";
/**
 * EvaluationEnum
 */
export enum EvaluationEnum {
  EVALUATION_PASS = "EVALUATION_PASS",
  EVALUATION_FAIL = "EVALUATION_FAIL",
  EVALUATION_IMPROVED = "EVALUATION_IMPROVED",
  EVALUATION_REQUEST = "EVALUATION_REQUEST",
  SUPPLEMENTATION_REQUEST = "SUPPLEMENTATION_REQUEST",
}

/**
 * EvaluationAssignmentContentViewRestrict
 */
export enum EvaluationAssignmentContentViewRestrict {
  NONE = "NONE",
  LOGGED_IN = "LOGGED_IN",
}

/**
 * Interface for specific event
 */
export interface EvaluationEvent {
  author: string;
  date: string;
  grade: string | null;
  gradeIdentifier: string | null;
  identifier: string;
  student: string;
  text: string;
  type: EvaluationEnum;
}

export interface EvaluationAssignmentContent {
  answers: any[];
  created: string | null;
  lastModified: string | null;
  state: string | null;
  submitted: string | null;
  withdrawn: null;
}

/**
 * Interface for evaluation assignment
 */
export interface EvaluationAssignment {
  evaluable: boolean;
  evaluated: boolean | null;
  grade: number | null;
  literalEvaluation: string;
  materialId: number;
  path: string;
  submitted: boolean | null;
  title: string;
  workspaceMaterialEvaluationId: number | null;
  workspaceMaterialId: number;
}

/**
 * Interface for evaluation assignment content
 */
export interface EvaluationAssignmentContent {
  contentType: string;
  html: string;
  id: number;
  license: string;
  title: string;
  viewRestrict: EvaluationAssignmentContentViewRestrict;
}

/**
 * Interface for evaluation study diary event
 */
export interface EvaluationStudyDiaryEvent {
  commentCount: number;
  content: string;
  created: string;
  firstName: string;
  id: number;
  lastName: string;
  title: string;
  userEntityId: number;
  workspaceEntityId: number;
}

/**
 * AssessmentRequest
 */
export interface AssessmentRequest {
  assessmentRequestDate: string | null;
  assignmentsDone: number;
  assignmentsTotal: number;
  enrollmentDate: string;
  evaluationDate: string;
  firstName: string;
  graded: boolean;
  lastName: string;
  passing: boolean;
  studyProgramme: string;
  userEntityId: number;
  workspaceEntityId: number;
  workspaceName: string;
  workspaceNameExtension: string | null;
  workspaceUrlName: string;
  workspaceUserEntityId: number;
  workspaceUserIdentifier: string;
}

/**
 * Interface for grading system
 */
export interface EvaluationGradeSystem {
  dataSource: string;
  id: string;
  name: string;
  grades: EvaluationGrade[];
}

/**
 * Interface for grade
 */
export interface EvaluationGrade {
  dataSource: string;
  id: string;
  name: string;
}

/**
 * Interface for workspace used in evaluation
 */
export interface EvaluationWorkspace extends WorkspaceType {}

/**
 * EvaluationStatus
 */
export interface EvaluationStatus {
  key: string;
  value: string;
}

/**
 * SortBy type
 */
export type SortBy =
  | "sort-amount-asc"
  | "sort-amount-desc"
  | "sort-alpha-asc"
  | "sort-alpha-desc"
  | "sort-workspace-alpha-asc"
  | "sort-workspace-alpha-desc"
  | "no-sort";

/**
 * EvaluationSort
 */
export interface EvaluationSort {
  key: string;
  value: SortBy;
}

export interface UpdateImportanceObject {
  importantAssessments: EvaluationImportance;
  unimportantAssessments: EvaluationImportance;
}

/**
 * EvaluationImportance
 */
export interface EvaluationImportance {
  key: "important-evaluation-requests" | "unimportant-evaluation-requests";
  value: string;
}

/**
 * EvaluationFilters
 */
export interface EvaluationFilters {
  evaluated: boolean;
  notEvaluated: boolean;
  assessmentRequest: boolean;
  supplementationRequest: boolean;
}

/**
 * EvaluationImportantStatus
 */
export type EvaluationImportantStatus =
  | "important"
  | "unimportant"
  | "nostatus";

/**
 * EvaluationStateType
 */
export type EvaluationStateType = "LOADING" | "READY" | "ERROR";

/**
 * WorkspaceEvaluationSaveRequest
 */
export interface WorkspaceEvaluationSaveRequest {
  identifier?: string;
  assessorIdentifier: string;
  gradingScaleIdentifier: string;
  gradeIdentifier: string;
  verbalAssessment: string;
  assessmentDate: string;
}

/**
 * WorkspaceEvaluationSaveReturn
 */
export interface WorkspaceEvaluationSaveReturn {
  identifier: string;
  assessorIdentifier: string;
  gradingScaleIdentifier: string;
  gradeIdentifier: string;
  verbalAssessment: string;
  assessmentDate: string;
  passing: boolean;
}

/**
 * WorkspaceSupplementationSaveRequest
 */
export interface WorkspaceSupplementationSaveRequest {
  id?: string;
  requestDate: string;
  requestText: string;
}

/**
 * BilledPrice
 */
export interface BilledPrice {
  assessmentIdentifier: string;
  editable: boolean;
  price: number;
}

/**
 * AssignmentEvaluationAudioAssessment
 */
export interface AudioAssessment {
  id: string;
  name: string;
  contentType: string;
}

/**
 * AssignmentEvaluationGradeRequest
 */
export interface AssignmentEvaluationGradeRequest {
  assessorIdentifier: string;
  gradingScaleIdentifier: string;
  gradeIdentifier: string;
  verbalAssessment: string;
  assessmentDate: number;
  audioAssessments: AudioAssessment[];
}

/**
 * AssignmentEvaluationSupplementationRequest
 */
export interface AssignmentEvaluationSupplementationRequest {
  userEntityId: number;
  studentEntityId: number;
  workspaceMaterialId: string;
  requestDate: number;
  requestText: string;
  audioAssessments: AudioAssessment[];
}

/**
 * EvaluationData
 */
export interface EvaluationData {
  materials: MaterialContentNodeListType;
}

/**
 * BilledPriceRequest
 */
export interface BilledPriceRequest {
  assessmentIdentifier: string;
  price: string;
}

export interface WorkspaceUserEntity {
  active: boolean;
  firstName: string;
  hasImage: boolean;
  lastName: string;
  nickname: string;
  studyProgrammeName: string;
  userEntityId: number;
  userIdentifier: string;
  workspaceUserEntityId: number;
}
