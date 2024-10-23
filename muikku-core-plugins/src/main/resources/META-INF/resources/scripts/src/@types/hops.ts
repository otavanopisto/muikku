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

export type HopsUsePlace = "guider" | "studies" | "guardian";

/**
 * User of hops. Can only be supervisor or student
 * and depending of that there is different amount
 * functionalities in study tool for example
 */
export type HopsUser = "supervisor" | "student" | "guardian";

/**
 * WayToLearn. Questions related to how the student learns.
 */
export interface WayToLearnCompulsoryStudies {
  /**
   * "By reading learning materials"
   */
  byReadingMaterials?: number;
  /**
   * "By taking notes (e.g., mind maps)"
   */
  byTakingNotes?: number;
  /**
   * "By doing exercises"
   */
  byDoingExercises?: number;
  /**
   * "By memorizing"
   */
  byMemorizing?: number;
  /**
   * "By watching videos"
   */
  byWatchingVideos?: number;
  /**
   * "By listening to lessons"
   */
  byListeningTeaching?: number;
  /**
   * "By explaining the subject to someone else"
   */
  byExplaining?: number;
  /**
   * "By discussing with others"
   */
  byDiscussing?: number;
  /**
   * "By watching or doing examples"
   */
  byWatchingOrDoingExamples?: number;
  /**
   * "Some other way"
   */
  someOtherWay?: string;
}

/**
 * StudySupport. Questions related to support from family, friends, etc.
 */
export interface StudySupportCompulsoryStudies {
  fromFamilyMember?: boolean;
  fromFriend?: boolean;
  fromSupportPerson?: boolean;
  noSupport?: boolean;
  somethingElse?: boolean;
  somethingElseWhat?: string;
}

/**
 * StudentSelfImage.
 */
export interface StudentSelfImageCompulsoryStudies {
  /**
   * "I find studying enjoyable."
   */
  likeStudying?: number;
  /**
   * "I have goals for my studies."
   */
  haveGoals?: number;
  /**
   * "I am ready to achieve my goals."
   */
  readyToAchieveGoals?: number;
  /**
   * "I always finish the tasks I start."
   */
  alwaysFinishJobs?: number;
  /**
   * "I am pedantic."
   */
  bePedantic?: number;
  /**
   * "My mind doesn’t wander when I study."
   */
  studyingConcentration?: number;
  /**
   * "I can work even if there are distractions around me."
   */
  affectedByNoise?: number;
  /**
   * "I can follow instructions and act accordingly."
   */
  canFollowInstructions?: number;
  /**
   * "I can assess what has gone well and where I can still improve."
   */
  canEvaluateOwnWork?: number;
  /**
   * "I am able to receive feedback related to my studies."
   */
  canTakeFeedback?: number;
  /**
   * "I have basic computer skills for studying."
   */
  canUseBasicComputerFunctionalities?: number;
  /**
   * "Something else"
   */
  somethingElse?: number;
  /**
   * "Wishes for teachers and supervisors"
   */
  wishesForTeachersAndSupervisors?: number;
}

/**
 * HopsStartingLevelCompulsoryStudies
 */
export interface HopsStartingLevelCompulsoryStudies {
  previousEducation: string;
  previousEducationElse?: string;
  previousWorkExperience: string;
  previousWorkExperienceField: string;
  previousYearsUsedInStudies: string;
  previousLanguageExperience: LanguageGrade[];
}

/**
 * HopsMotivationAndStudyCompulsoryStudies
 */
export interface HopsMotivationAndStudyCompulsoryStudies {
  wayToLearn: WayToLearnCompulsoryStudies;
  studySupport: StudySupportCompulsoryStudies;
  selfImageAsStudent: StudentSelfImageCompulsoryStudies;
}

/**
 * CompulsoryStudiesHops
 */
export interface CompulsoryStudiesHops {
  type: "compulsory";

  // Previous education and language skills
  startingLevel: HopsStartingLevelCompulsoryStudies;
  // Self assessment
  motivationAndStudy: HopsMotivationAndStudyCompulsoryStudies;
}

/**
 * SelfAssessmentSecondaryStudies
 */
interface SelfAssessmentSecondaryStudies {
  /**
   * "I have a positive attitude toward studying."
   */
  positiveAttitude?: number;
  /**
   * I am willing to set goals for my studies.
   */
  goalSetting?: number;
  /**
   * "I am motivated to work towards achieving my goals."
   */
  goalMotivation?: number;
  /**
   * I strive to complete tasks within the agreed schedule.
   */
  taskCompletion?: number;
  /**
   * "I am able to focus on my studies well enough."
   */
  focusAbility?: number;
  /**
   * "I can follow instructions and act accordingly."
   */
  followInstructions?: number;
  /**
   * I can assess what has gone well and where I can still improve.
   */
  selfAssessment?: number;
  /**
   * "I am able to receive feedback related to my studies."
   */
  receiveFeedback?: number;
  /**
   * "I have good IT skills for studying."
   */
  itSkills?: number;
  /**
   * I have sufficient study skills for independent online learning.
   */
  independentLearningSkills?: number;
}

/**
 * SecondaryStudiesHops
 */
export interface SecondaryStudiesHops {
  type: "secondary";

  // Previous education and language skills
  previousEducations: PreviousStudiesEntry[];
  previousEducationInfo?: string;
  nativeLanguage: string;
  studiedLanguagesAtSchool: string;
  studiedLanguagesOther: string;
  languageLearningSkills: string;

  // Self assessment
  selfAssessment: SelfAssessmentSecondaryStudies;
  moreAboutSelfAssessment?: string;
}

/**
 * PreviousStudiesEntry
 */
export interface PreviousStudiesEntry {
  type: string;
  duration: string;
  moreInfo?: string;
  hardCoded?: boolean;
}

/**
 * Helper function to initialize a SecondaryStudiesHops object
 */
export function initializeSecondaryStudiesHops(): SecondaryStudiesHops {
  return {
    type: "secondary",
    previousEducations: [
      { type: "", duration: "", moreInfo: "", hardCoded: true },
    ],
    nativeLanguage: "",
    studiedLanguagesAtSchool: "",
    studiedLanguagesOther: "",
    languageLearningSkills: "",
    selfAssessment: {},
  };
}

/**
 * Helper function to initialize a CompulsoryStudiesHops object
 */
export function initializeCompulsoryStudiesHops(): CompulsoryStudiesHops {
  return {
    type: "compulsory",
    startingLevel: {
      previousEducation: "",
      previousEducationElse: "",
      previousWorkExperience: "",
      previousWorkExperienceField: "",
      previousYearsUsedInStudies: "",
      previousLanguageExperience: [
        {
          name: "suomi",
          hardCoded: true,
        },
        {
          name: "ruotsi",
          hardCoded: true,
        },
        {
          name: "englanti",
          hardCoded: true,
        },
      ],
    },
    motivationAndStudy: {
      wayToLearn: {},
      studySupport: {},
      selfImageAsStudent: {},
    },
  };
}

/**
 * Checks if the form is a CompulsoryStudiesHops
 * @param form HopsForm
 * @returns boolean
 */
export const isCompulsoryStudiesHops = (
  form: HopsForm
): form is CompulsoryStudiesHops => form.type === "compulsory";

/**
 * Checks if the form is a SecondaryStudiesHops
 * @param form HopsForm
 * @returns boolean
 */
export const isSecondaryStudiesHops = (
  form: HopsForm
): form is SecondaryStudiesHops => form.type === "secondary";

/**
 * HopsForm
 */
export type HopsForm = CompulsoryStudiesHops | SecondaryStudiesHops;
