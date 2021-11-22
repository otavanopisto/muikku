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
export enum Education {
  VOCATIONAL_SCHOOL = "VOCATIONAL_SHOOL",
  HOME_SCHOOL = "HOME_SCHOOL",
  COMPULSORY_SCHOOL = "COMPULSORY_SCHOOL",
  SOMETHING_ELSE = "SOMETHING_ELSE",
}

/**
 * FollowUpStudies
 */
export enum FollowUpStudies {
  APPRENTICESHIP_TRAINING = "APPRENTICESHIP_TRAINING",
  VOCATIONAL_SCHOOL = "VOCATIONAL_SCHOOL",
  UPPER_SECONDARY_SCHOOL = "UPPER_SECONDARY_SCHOOL",
  UNIVERSITY_STUDIES = "UNIVERSITY_STUDIES",
}

/**
 * StudySector
 */
export enum StudySector {
  SOCIAL_HEALT_SECTOR = "SOCIAL_HEALT_SECTOR",
  TRADE_SECTOR = "TRADE_SECTOR",
  TRANSPORT_SECTOR = "TRANSPORT_SECTOR",
  EDUCATION_SECTOR = "EDUCATION_SECTOR",
  INDUSTRY_SECTOR = "INDUSTRY_SECTOR",
  ART_SECTOR = "ART_SECTOR",
}

/**
 * FollowUpGoal
 */
export enum FollowUpGoal {
  POSTGRADUATE_STUDIES = "POSTGRADUATE_STUDIES",
  WORKING_LIFE = "WORKING_LIFE",
  NO_FOLLOW_UP_GOALS = "NO_FOLLOW_UP_GOALS",
}

export enum CourseStatus {
  ONGOING = "ONGOING",
  GRADED = "GRADED",
  TRANSFERRED = "TRANSFERRED",
  SUGGESTED_NEXT = "SUGGESTED_NEXT",
  SUGGESTED_OPTIONAL = "SUGGESTED_OPTIONAL",
}

/**
 * LanguageGrade
 */
export interface LanguageGrade {
  name: string;
  grade: number;
  hardCoded: boolean;
}

export interface HopsCompulsory {
  startingLevel: HopsStudentStartingLevel;
  motivationAndStudy: HopsMotivationAndStudy;
  studiesPlanning: HopsPlanningStudies;
}

/**
 * BasicStudies
 */
export interface BasicInformation {
  name: string;
  dateOfIssue?: Date;
  updates?: HopsUpdates[];
  counselorList?: string[];
}

export interface StudentInfo {
  id: number;
  firstName: string;
  lastName: string;
  counselorList?: string[];
}

export interface HopsUpdates {
  date: Date;
  modifier: string;
}

/**
 * HopsStudentStartingLevel
 */
export interface HopsStudentStartingLevel {
  previousEducation: string;
  previousEducationElse?: string;
  previousWorkExperience: string;
  previousYearsUsedInStudies: string;
  finnishAsMainOrSecondaryLng: boolean;
  previousLanguageExperience: LanguageGrade[];
}

/**
 * HopsMotivationAndStudy
 */
export interface HopsMotivationAndStudy
  extends WayToLearn,
    StudentLearningMethod,
    StudentSupportive {
  scaleSize: number;
  scaleName: string;
  hardOrEasyInStudies?: string;
  strengthsOrWeaknesses?: string;
  interests?: string;
  areasToAdvance?: string;
}

export interface HopsStudies {
  usedHoursPerWeek: number;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
}

export interface HopsPlanningStudies {
  usedHoursPerWeek: number;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
}

/**
 * FollowUpGoal
 */
export interface FollowUp {
  graduationGoal: string;
  followUpGoal: string;
  followUpStudies?: string;
  studySector?: string;
}

/**
 * WayToLearn
 */
export interface WayToLearn {
  byReading: number;
  byListening: number;
  byDoing: number;
  someOtherWay?: string;
}

/**
 * StudentLearningMethod
 */
export interface StudentLearningMethod {
  byMemorizing: number;
  byTakingNotes: number;
  byDrawing: number;
  byListeningTeacher: number;
  byWatchingVideos: number;
  byFollowingOthers: number;
  someOtherMethod?: string;
}

/**
 * StudentSupportive
 */
export interface StudentSupportive {
  noSupport: number;
  family: number;
  friend: number;
  supportPerson: number;
  teacher: number;
  somethingElse?: string;
}

export interface SchoolSubject {
  name: string;
  subjectCode: string;
  availableCourses: Course[];
}

export interface Course {
  name: string;
  courseNumber: number;
  length: number;
  mandatory: boolean;
  id: number;
}

export interface StudentActivityCourse {
  subject: string;
  courseId: number; // muikun työtilan id (jos kyseessä on arvioitu tai meneillään oleva kurssi)
  courseNumber: number;
  courseName: string;
  grade: number; // jos on arvioitu tahi hyväksiluettu
  status: CourseStatus;
  date: string;
}

export interface StudiesCourseData {
  completedSubjectListOfIds?: number[];
  approvedSubjectListOfIds?: number[];
  inprogressSubjectListOfIds?: number[];
  selectedOptionalListOfIds?: number[];
  ownHopsChoosed?: number;
  ownHopsCompleted?: number;
}
export interface UploadingValue {
  name: string;
  contentType: string;
  failed?: boolean;
  progress?: number;
  file?: File;
}

export interface Suggestion {
  id: number;
  name: string;
  subject: string;
  courseNumber: number;
}

export interface StudentActivityByStatus {
  onGoingList: StudentActivityCourse[];
  suggestedNextList: StudentActivityCourse[];
  suggestedOptionalList: StudentActivityCourse[];
  transferedList: StudentActivityCourse[];
  gradedList: StudentActivityCourse[];
}
