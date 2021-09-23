/**
 * PageLocation type
 */
export type PageLocation = "Home" | "Help" | "Materials";

/**
 * Education
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
  COMPLETED = "COMPLETED",
  APPROVAL = "APPROVAL",
  INPROGRESS = "INPROGRESS",
  NOSTATUS = "NOSTATUS",
  SUGGESTED = "SUGGESTED",
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
  basicInfo: BasicInformation;
  startingLevel: HopsStudentStartingLevel;
  motivationAndStudy: HopsMotivationAndStudy;
  studiesPlanning: HopsPlanningStudies;
  studiesCourseData: StudiesCourseData;
}

/**
 * BasicStudies
 */
export interface BasicInformation {
  name: string;
  guider: string;
  dateOfIssue?: Date;
  updates?: Date[];
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
    StudentSupportive,
    StudentsGoal {
  hardOrEasyInStudies?: string;
  strengthsOrWeaknesses?: string;
  interests?: string;
  areasToAdvance?: string;
}

export interface HopsStudies {
  usedHoursPerWeek: number;
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
  selectedSubjects: SchoolSubject[];
}

export interface HopsPlanningStudies extends StudentsGoal {
  usedHoursPerWeek: number;
  selectedListOfIds: number[];
  supervisorSugestedSubjectListOfIds: number[];
  supervisorSuggestedNextListOfIds: number[];
  selectedSubjects: SchoolSubject[];
  ethics: boolean;
  finnishAsSecondLanguage: boolean;
}

/**
 * HopsGoal
 */
export interface StudentsGoal {
  graduationGoal: string;
  followUpGoal: string;
  followUpStudies?: string;
  studySector?: string;
}

/**
 * WayToLearn
 */
export interface WayToLearn {
  byReading: boolean;
  byListening: boolean;
  byDoing: boolean;
  someOtherWay?: string;
}

/**
 * StudentLearningMethod
 */
export interface StudentLearningMethod {
  byMemorizing: boolean;
  byTakingNotes: boolean;
  byDrawing: boolean;
  byListeningTeacher: boolean;
  byWatchingVideos: boolean;
  byFollowingOthers: boolean;
  someOtherMethod?: string;
}

/**
 * StudentSupportive
 */
export interface StudentSupportive {
  noSupport: boolean;
  family: boolean;
  friend: boolean;
  supportPerson: boolean;
  teacher: boolean;
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
  status: string;
  mandatory: boolean;
  id: number;
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
