import { MaterialCompositeRepliesStateType } from "./../reducers/workspaces/index";
import { JournalComment } from "~/@types/journal";
import {
  WorkspaceType,
  MaterialContentNodeListType,
  MaterialAssignmentType,
  WorkspaceSubject,
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
  EVALUATION_REQUEST_CANCELLED = "EVALUATION_REQUEST_CANCELLED",
  INTERIM_EVALUATION_REQUEST = "INTERIM_EVALUATION_REQUEST",
  INTERIM_EVALUATION_REQUEST_CANCELLED = "INTERIM_EVALUATION_REQUEST_CANCELLED",
  INTERIM_EVALUATION = "INTERIM_EVALUATION",
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
  text: string | null;
  type: EvaluationEnum;
  workspaceSubjectIdentifier: string | null;
}

/**
 * EvaluationAssignmentContent
 */
export interface EvaluationAssignmentContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * EvaluationJournalFilters
 */
export interface EvaluationJournalFilters {
  showMandatory: boolean;
  showOthers: boolean;
}

/**
 * EvaluationJournalFeedback
 */
export interface EvaluationJournalFeedback {
  created: Date;
  creator: number;
  creatorName: string;
  feedback: string;
  id: number;
  /**
   * "userEntityId" of student
   */
  student: number;
  /**
   * workspaceEntity id
   */
  workspaceEntityId: number;
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
  /**
   * Whether journal is "mandatory" assignment and material field
   */
  isMaterialField: boolean;
  /**
   * Material field reply status. ANSWERED | "SUBMITTED" are only ones
   * that matters
   */
  workspaceMaterialReplyState: MaterialCompositeRepliesStateType | null;
}

/**
 * EvaluationJournalCommentsByJournal
 */
export interface EvaluationJournalCommentsByJournal {
  [journalEntryId: number]: JournalComment[];
}

/**
 * EvaluationWorkspaceSubject
 */
export interface EvaluationWorkspaceSubject extends WorkspaceSubject {
  datasource: string;
}

/**
 * AssessmentRequest
 */
export interface AssessmentRequest {
  interimEvaluationRequest: boolean;
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
  /**
   * If request is interim evaluation request id is latest interim evaluation request.
   * Otherwise id is related evaluation request.
   */
  id: number;
  subjects: EvaluationWorkspaceSubject[];
}

/**
 * Interface for latest evaluation per subject
 */
export interface EvaluationLatestSubjectEvaluationIndex {
  [subjectIdentifier: string]: number;
}

/**
 * Interface for last evaluation per subject
 */
export interface EvaluationLastSubjectEvaluationIndex
  extends EvaluationLatestSubjectEvaluationIndex {}

/**
 * Interface for grading system
 */
export interface EvaluationGradeSystem {
  dataSource: string;
  id: string;
  name: string;
  grades: EvaluationGrade[];
  active: boolean;
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
export type EvaluationWorkspace = WorkspaceType;

/**
 * EvaluationStatus
 */
export interface EvaluationStatus {
  key: string;
  value: string;
}

/**
 * BasePriceById
 */
export interface EvaluationBasePriceById {
  [id: string]: number;
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

/**
 * UpdateImportanceObject
 */
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
 * AudioAssessment
 */
export interface AudioAssessment {
  id: string;
  name: string;
  contentType: string;
}

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
  workspaceSubjectIdentifier: string;
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
 * AssignmentEvaluationSaveReturn
 */
export interface AssignmentEvaluationSaveReturn {
  assessmentDate: string;
  assessorIdentifier: string;
  gradeIdentifier: string;
  gradingScaleIdentifier: string;
  identifier: string;
  passing: boolean;
  verbalAssessment: string;
}

/**
 * WorkspaceSupplementationSaveRequest
 */
export interface WorkspaceSupplementationSaveRequest {
  id?: string;
  workspaceSubjectIdentifier: string;
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

export enum AssignmentEvaluationType {
  ASSESSMENT = "ASSESSMENT",
  SUPPLEMENTATIONREQUEST = "SUPPLEMENTATIONREQUEST",
}

/**
 * AssignmentEvaluationGradeRequest
 */
export interface AssignmentEvaluationGradeRequest {
  identifier?: string;
  evaluationType: AssignmentEvaluationType;
  assessorIdentifier: string;
  gradingScaleIdentifier: string;
  gradeIdentifier: string;
  verbalAssessment: string;
  assessmentDate: number;
  audioAssessments: AudioAssessment[];
}

/**
 * AssignmentInterminEvaluationRequest
 */
export interface AssignmentInterminEvaluationRequest {
  assessorIdentifier: string;
  verbalAssessment: string;
  assessmentDate: number;
  audioAssessments: AudioAssessment[];
}

/**
 * EvaluationData
 */
export interface EvaluationData {
  materials: MaterialContentNodeListType;
}

/**
 * EvaluationAssigmentData
 */
export interface EvaluationAssigmentData {
  assigments: MaterialAssignmentType[];
}

/**
 * BilledPriceRequest
 */
export interface BilledPriceRequest {
  assessmentIdentifier: string;
  price: string;
}

/**
 * WorkspaceUserEntity
 */
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
