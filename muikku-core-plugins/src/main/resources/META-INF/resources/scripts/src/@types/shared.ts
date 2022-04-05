/**
 * UsedAs
 */
export type UsedAs = "default" | "evaluationTool";

/**
 * PageLocation type
 */
export type PageLocation = "Home" | "Help" | "Materials";

/**
 * Loading items state type
 */
export type LoadingState = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

/**
 * Taskfield saving state type
 */
export type FieldStateStatus = "SAVED" | "SAVING" | "ERROR";

/**
 * Loading state type
 */
export type SaveState =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "SAVING_DRAFT"
  | "DRAFT_SAVED";

/**
 * AttentionPlace
 */
export type AttentionPlace = "Mikkeli" | "Muu";

/**
 * attendanceStatus
 */
export type attendanceStatus = "ENROLLED" | "FINISHED" | "PLANNED";

/**
 * ExaminationFunding
 */
export enum ExaminationFunding {
  SELF_FUNDED = "SELF_FUNDED",
  COMPULSORYEDUCATION_FREE = "COMPULSORYEDUCATION_FREE",
  COMPULSORYEDUCATION_FREE_RETRY = "COMPULSORYEDUCATION_FREE_RETRY",
}

/**
 * ExamEnrollmentDegreeStructure
 */
export enum ExamEnrollmentDegreeStructure {
  PRE2022 = "PRE2022",
  POST2022 = "POST2022",
}

/**
 * Grades by string code
 */
export interface ExaminationGrade {
  [stringId: string]: string;
}

/**
 * Examination subject by string code
 */
export interface ExaminationSubject {
  [stringId: string]: string;
}

/**
 * Examination
 */
export interface ExaminationInformation
  extends MatriculationStudent,
    MatriculationStudentExamination {
  date: string;
}

/**
 * ExaminationAttendedSubject
 */
export interface ExaminationEnrolledSubject {
  subject: string;
  mandatory: string;
  repeat: string;
  status: attendanceStatus;
  funding?: ExaminationFunding | string;
}

/**
 * export interface ExaminationCompletedSubject {
 */
export interface ExaminationFinishedSubject {
  term: any;
  subject: string;
  mandatory: string;
  grade: string;
  status: attendanceStatus;
  funding?: ExaminationFunding | string;
}

/**
 * ExaminationFutureSubject
 */
export interface ExaminationPlannedSubject {
  term: any;
  subject: string;
  mandatory: string;
  status: attendanceStatus;
  funding?: ExaminationFunding | string;
}

/**
 * Examination information
 */
export interface ExaminationAttentionInformation {
  placeToAttend: string;
  extraInfoForSupervisor: string;
  publishPermission: string;
  publishedName: string;
  date: any;
}

/**
 * Term
 */
export interface Term {
  name: string;
  value: string;
  adessive: string;
}

/**
 * MatriculationStudent
 */
export interface MatriculationStudent {
  address: string;
  email: string;
  enrollmentSent: boolean;
  guidanceCounselor: string;
  locality: string;
  name: string;
  phone: string;
  postalCode: string;
  ssn: string;
  studentIdentifier: string;
}

/**
 * MatriculationStudentExamination
 */
export interface MatriculationStudentExamination {
  canPublishName: string;
  changedContactInfo: string;
  degreeType: string;
  enrollAs: string;
  enrolledAttendances: ExaminationEnrolledSubject[];
  finishedAttendances: ExaminationFinishedSubject[];
  plannedAttendances: ExaminationPlannedSubject[];
  guider: string;
  initialized: boolean;
  location: string;
  message: string;
  numMandatoryCourses: string;
  restartExam: boolean | string;
  degreeStructure: ExamEnrollmentDegreeStructure;
}

/**
 * MatriculationExaminationDraft
 */
export interface MatriculationExaminationDraft {
  changedContactInfo: string;
  guider: string;
  enrollAs: string;
  degreeType: string;
  numMandatoryCourses: string;
  restartExam: string;
  message: string;
  location: string;
  canPublishName: string;
  degreeStructure: ExamEnrollmentDegreeStructure;
  enrolledAttendances: ExaminationEnrolledSubject[];
  plannedAttendances: ExaminationPlannedSubject[];
  finishedAttendances: ExaminationFinishedSubject[];
}

/**
 * MatriculationExaminationApplication
 */
export interface MatriculationExaminationApplication {
  examId: string;
  name: string;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  guider: string;
  enrollAs: string;
  degreeType: string;
  restartExam: string;
  numMandatoryCourses: number;
  location: string;
  message: string;
  degreeStructure: ExamEnrollmentDegreeStructure;
  studentIdentifier: string;
  canPublishName: boolean;
  state: string;
  attendances: object[];
}

/**
 * UploadingValue
 */
export interface UploadingValue {
  name: string;
  contentType: string;
  failed?: boolean;
  progress?: number;
  file?: File;
}

/**
 * OPSsuitability
 */
export interface OPSsuitability {
  MANDATORY: string;
  UNSPECIFIED_OPTIONAL: string;
  NATIONAL_LEVEL_OPTIONAL: string;
  SCHOOL_LEVEL_OPTIONAL: string;
}
