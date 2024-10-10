/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  HopsHistoryEntry,
  StudentStudyActivity,
  WorkspaceSuggestion,
  MatriculationExamEnrolledSubject,
  MatriculationExamFinishedSubject,
  MatriculationExamPlannedSubject,
  MatriculationExamEnrollment,
} from "~/generated/client";

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
export type LoadingState =
  | "WAITING"
  | "LOADING"
  | "LOADING_MORE"
  | "ERROR"
  | "READY";

/**
 * Taskfield saving state type
 */
export type FieldStateStatus = "SAVED" | "SAVING" | "ERROR";

/**
 * Loading state type
 */
export type SaveState = "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED";

/**
 * AttentionPlace
 */
export type AttentionPlace = "Mikkeli" | "Muu";

export type MatriculationFormType = "initial" | "editable" | "readonly";

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
 * Term
 */
export interface Term {
  name: string;
  value: string;
  year: number;
  adessive: string;
}

/**
 * Examination
 */
export interface ExaminationInformation extends MatriculationExamEnrollment {
  initialized: boolean;
  // These values are used specifically for draft
  enrolledAttendances: Array<MatriculationExamEnrolledSubject>;
  finishedAttendances: Array<MatriculationExamFinishedSubject>;
  plannedAttendances: Array<MatriculationExamPlannedSubject>;
}

/**
 * Generic type guard for status
 * @param val status
 * @returns type guard
 */
export function isOfStatus<
  GenericType extends string,
  MatriculationExamAttendance extends { status: GenericType },
  SpecificType extends GenericType
>(val: SpecificType) {
  return (
    obj: MatriculationExamAttendance
  ): obj is Extract<MatriculationExamAttendance, { status: SpecificType }> =>
    obj.status === val;
}

/**
 * Convert string to boolean
 * @param str str
 * @returns boolean
 */
export function stringToBoolean(str: string): boolean {
  const boolMap = new Map<string, boolean>([
    ["true", true],
    ["false", false],
  ]);

  const result = boolMap.get(str.toLowerCase());
  if (result !== undefined) {
    return result;
  } else {
    throw new Error("Invalid boolean string");
  }
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

/**
 * LanguageGrade
 */
export interface LanguageGrade {
  name: string;
  grade?: LanguageGradeEnum;
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
  studyPeriodPlan: HopsStudyPeriodPlan;
}

/**
 * BasicStudies
 */
export interface BasicInformation {
  studentUserEntityId: number;
  name: string;
  dateOfIssue?: Date;
  updates?: HopsHistoryEntry[];
  studyTimeEnd?: string | null;
  educationalLevel?: string | null;
  counselorList?: string[];
  curriculumName: string | null;
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
 * HopsStudyPeriodPlan
 */
export interface HopsStudyPeriodPlan {
  month1: string;
  month2: string;
  month3: string;
  month4: string;
  month5: string;
  month6: string;
}

/**
 * WayToLearn
 */
export interface WayToLearn {
  byReadingMaterials?: number;
  byTakingNotes?: number;
  byDoingExercises?: number;
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
  fromFamilyMember?: boolean;
  fromFriend?: boolean;
  fromSupportPerson?: boolean;
  noSupport?: boolean;
  somethingElse?: boolean;
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
 * SchoolSubjectMatrix
 */
export interface SchoolCurriculumMatrix {
  curriculumName: string;
  subjectsTable: SchoolSubject[];
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
 * Course
 */
export interface SuggestedCourse extends WorkspaceSuggestion {
  suggestedAsNext: boolean;
}

/**
 * SuggestionWithWorkspaceInfo
 */
export interface SuggestionWithWorkspaceInfo extends WorkspaceSuggestion {}

/**
 * StudentActivityByStatus
 */
export interface StudentActivityByStatus {
  /**
   * List of ongoing courses
   */
  onGoingList: StudentStudyActivity[];
  /**
   * List of suggested courses for next
   */
  suggestedNextList: StudentStudyActivity[];
  /**
   * List of transfered courses
   */
  transferedList: StudentStudyActivity[];
  /**
   * List of graded courses
   */
  gradedList: StudentStudyActivity[];
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
 * SkillAndArtByKeys
 */
export interface ActivityBySubject {
  [key: string]: StudentStudyActivity[];
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
