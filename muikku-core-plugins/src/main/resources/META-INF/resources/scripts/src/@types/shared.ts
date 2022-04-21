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
export enum Education {
  VOCATIONAL_SCHOOL = "VOCATIONAL_SHOOL",
  HOME_SCHOOL = "HOME_SCHOOL",
  COMPULSORY_SCHOOL = "COMPULSORY_SCHOOL",
  NO_PREVIOUS_EDUCATION = "NO_PREVIOUS_EDUCATION",
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
  SOMETHING_ELSE = "SOMETHING_ELSE",
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
  SOMETHING_ELSE = "SOMETHING_ELSE",
}

/**
 * FollowUpGoal
 */
export enum FollowUpGoal {
  POSTGRADUATE_STUDIES = "POSTGRADUATE_STUDIES",
  WORKING_LIFE = "WORKING_LIFE",
  NO_FOLLOW_UP_GOALS = "NO_FOLLOW_UP_GOALS",
  DONT_KNOW = "DONT_KNOW",
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
  grade: LanguageGradeEnum;
  hardCoded: boolean;
}

export enum LanguageGradeEnum {
  NATIVE_LANGUAGE = "NATIVE_LANGUAGE",
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  SATISFYING = "SATISFYING",
  NOT_STUDIED = "NOT_STUDIED",
}

/**
 * HopsCompulsory
 */
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
  updates?: HopsUpdate[];
  studyTimeEnd?: string | null;
  educationalLevel?: string | null;
  counselorList?: string[];
}

/**
 * StudentInfo
 */
export interface StudentInfo {
  id: number;
  firstName: string;
  lastName: string;
  studyTimeEnd: string | null;
  educationalLevel: string | null;
  counselorList?: string[];
}

/**
 * HopsUpdates
 */
export interface HopsUpdate {
  date: Date;
  details: string | null;
  id: number;
  modifier: string;
  modifierHasImage: boolean;
  modifierId: number;
}

/**
 * HopsStudentStartingLevel
 */
export interface HopsStudentStartingLevel {
  previousEducation: string;
  previousEducationElse?: string;
  previousWorkExperience: string;
  previousWorkExperienceField: string;
  previousYearsUsedInStudies: string;
  previousLanguageExperience: LanguageGrade[];
}

/**
 * HopsMotivationAndStudy
 */
export interface HopsMotivationAndStudy {
  wayToLearn: WayToLearn;
  studySupport: StudySupport;
  selfImageAsStudent: StudentSelfImage;
}

/**
 * HopsStudies
 */
export interface HopsStudies {
  usedHoursPerWeek: number;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
}

/**
 * HopsPlanningStudies
 */
export interface HopsPlanningStudies {
  usedHoursPerWeek: number;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
}

/**
 * FollowUpGoal
 */
export interface FollowUp {
  graduationGoal: Date | null;
  followUpGoal: string;
  followUpStudies?: string;
  followUpStudiesElse?: string;
  studySector?: string;
  studySectorElse?: string;
  followUpPlanExtraInfo?: string;
}

/**
 * WayToLearn
 */
export interface WayToLearn {
  byReadingMaterials?: number;
  byTakingNotes?: number;
  byDoingExcercises?: number;
  byMemorizing?: number;
  byWatchingVideos?: number;
  byListeningTeaching?: number;
  byExplaining?: number;
  byDiscussing?: number;
  byWatchingOrDoingExamples?: number;
  someOtherWay?: string;
}

/**
 * StudySupport
 */
export interface StudySupport {
  fromFamilyMember: boolean;
  fromFriend: boolean;
  fromSupportPerson: boolean;
  noSupport: boolean;
  somethingElse: boolean;
  somethingElseWhat?: string;
}

/**
 * StudentSelfImage
 */
export interface StudentSelfImage {
  likeStudying?: number;
  haveGoals?: number;
  readyToAchieveGoals?: number;
  alwaysFinishJobs?: number;
  bePedantic?: number;
  studyingConcentration?: number;
  affectedByNoise?: number;
  canFollowInstructions?: number;
  canEvaluateOwnWork?: number;
  canTakeFeedback?: number;
  canUseBasicComputerFunctionalities?: number;
  somethingElse?: string;
  wishesForTeachersAndSupervisors?: string;
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

/**
 * SchoolSubject
 */
export interface SchoolSubject {
  name: string;
  subjectCode: string;
  availableCourses: Course[];
}

/**
 * Course
 */
export interface Course {
  name: string;
  courseNumber: number;
  length: number;
  mandatory: boolean;
}

/**
 * StudentActivityCourse
 */
export interface StudentActivityCourse {
  subjectName: string | null;
  subject: string;
  courseId: number; // muikun työtilan id (jos kyseessä on arvioitu tai meneillään oleva kurssi)
  courseNumber: number;
  courseName: string;
  grade: number; // jos on arvioitu tahi hyväksiluettu
  status: CourseStatus;
  date: string;
}

/**
 * StudiesCourseData
 */
export interface StudiesCourseData {
  completedSubjectListOfIds?: number[];
  approvedSubjectListOfIds?: number[];
  inprogressSubjectListOfIds?: number[];
  selectedOptionalListOfIds?: number[];
  ownHopsChoosed?: number;
  ownHopsCompleted?: number;
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
 * Suggestion
 */
export interface Suggestion {
  id: number;
  name: string;
  subject: string;
  courseNumber: number;
  urlName: string;
  hasCustomImage: boolean;
  nameExtension: string | null;
  courseType: CourseType;
  description?: string | null;
}

/**
 * FOR SOME REASON... backend's course type is defined
 * in finnish in the backend side
 */
type CourseType = "Nonstop" | "Ryhmäkurssi";

/**
 * SuggestionWithWorkspaceInfo
 */
export interface SuggestionWithWorkspaceInfo extends Suggestion {}

/**
 * StudentCourseChoice
 */
export interface StudentCourseChoice {
  subject: string;
  courseNumber: number;
}

/**
 * StudentActivityByStatus
 */
export interface StudentActivityByStatus {
  /**
   * List of ongoing courses
   */
  onGoingList: StudentActivityCourse[];
  /**
   * List of suggested courses for next
   */
  suggestedNextList: StudentActivityCourse[];
  /**
   * List of suggested optional courses
   */
  suggestedOptionalList: StudentActivityCourse[];
  /**
   * List of transfered courses
   */
  transferedList: StudentActivityCourse[];
  /**
   * List of graded courses
   */
  gradedList: StudentActivityCourse[];
  /**
   * skillsAndArt
   */
  skillsAndArt: ActivityBySubject;
  /**
   * otherLanguageSubjects
   */
  otherLanguageSubjects: ActivityBySubject;
  /**
   * otherSubjects
   */
  otherSubjects: ActivityBySubject;
}

/**
 * SkillAndArtByKeys
 */
export interface ActivityBySubject {
  [key: string]: StudentActivityCourse[];
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
