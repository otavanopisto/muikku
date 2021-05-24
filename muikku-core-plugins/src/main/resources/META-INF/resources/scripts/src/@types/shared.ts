import { StudentUserAddressType } from "../reducers/user-index";
import { ProfileStatusType } from "../reducers/base/status";
/**
 * PageLocation type
 */
export type PageLocation = "Home" | "Help" | "Materials";

/**
 * Loading state type
 */
export type SaveState = "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED";

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
}

/**
 * ExaminationStudentInfo
 */
export interface ExaminationStudentInfo {
  superVisor: string;
  registrationType: string;
  degreeType: string;
  refreshingExamination: string;
}

/**
 * ExaminationAttendedSubject
 */
export interface ExaminationAttendedSubject {
  subject: string;
  mandatory: string;
  renewal: string;
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
