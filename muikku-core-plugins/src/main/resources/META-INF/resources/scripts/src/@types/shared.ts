import { StudentUserAddressType } from "../reducers/user-index";
import { ProfileStatusType } from "../reducers/base/status";
/**
 * PageLocation type
 */
export type PageLocation = "Home" | "Help" | "Materials";

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

export type attendanceStatus = "ENROLLED" | "FINISHED" | "PLANNED" | "UNKNOWN";

/**
 * Examination subject by string code
 */
export interface ExaminationSubject {
  [stringId: string]: string;
}

/**
 * Examination
 */
export interface Examination {
  studentProfile: ExaminationBasicProfile;
  studentInfo: ExaminationStudentInfo;
  attendedSubjectList: ExaminationAttendedSubject[];
  completedSubjectList: ExaminationCompletedSubject[];
  futureSubjectList: ExaminationFutureSubject[];
  attentionInformation: ExaminationAttentionInformation;
}

/**
 * ExaminationBasicProfile
 */
export interface ExaminationBasicProfile {
  name: string;
  email: string;
  address: string;
  zipCode: string;
  postalDisctrict: string;
  phoneNumber: string;
  profileId: string;
  descriptionInfo?: string;
  ssn: number;
}

/**
 * ExaminationStudentInfo
 */
export interface ExaminationStudentInfo {
  superVisor: string;
  registrationType: string;
  degreeType: string;
  refreshingExamination: string;
  courseCount: number | null;
}

/**
 * ExaminationAttendedSubject
 */
export interface ExaminationAttendedSubject {
  subject: string;
  mandatory: string;
  repeat: string;
  status: attendanceStatus;
}

/**
 * export interface ExaminationCompletedSubject {
 */
export interface ExaminationCompletedSubject {
  term: any;
  subject: string;
  mandatory: string;
  grade: string;
  status: attendanceStatus;
}

/**
 * ExaminationFutureSubject
 */
export interface ExaminationFutureSubject {
  term: any;
  subject: string;
  mandatory: string;
  status: attendanceStatus;
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

export interface MatriculationStudent {
  address: string;
  email: string;
  enrollmentSent: boolean;
  guidanceCounselor: string;
  locality: string;
  name: string;
  phone: string;
  postalCode: string;
  ssn: number;
  studentIdentifier: string;
}

export interface MatriculationStudentExamination {
  canPublishName: string;
  changedContactInfo: string;
  degreeType: string;
  enrollAs: string;
  enrolledAttendances: [];
  finishedAttendances: [];
  guider: string;
  initialized: boolean;
  location: string;
  message: string;
  numMandatoryCourses: string;
  plannedAttendances: [];
  restartExam: boolean;
}

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
  enrolledAttendances: ExaminationAttendedSubject[];
  plannedAttendances: ExaminationFutureSubject[];
  finishedAttendances: ExaminationCompletedSubject[];
}

export interface MatriculationExaminationApplication {
  examId: string;
  name: string;
  ssn: number;
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
  studentIdentifier: string;
  canPublishName: boolean;
  state: string;
  attendances: object[];
}
