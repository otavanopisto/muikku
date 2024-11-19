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

export type HopsFormType = "compulsory" | "secondary";

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
 * CompulsoryStudiesHopsOld
 */
export interface CompulsoryStudiesHopsOld {
  // Previous education and language skills
  startingLevel: HopsStartingLevelCompulsoryStudies;
  // Self assessment
  motivationAndStudy: HopsMotivationAndStudyCompulsoryStudies;
}

/**
 * Current HopsForm for compulsory studies. Note that this is same as CompulsoryStudiesHopsOld
 * but with some changes in structure to make it more similar to SecondaryStudiesHops and easier to handle.
 */
export interface CompulsoryStudiesHops {
  type: HopsFormType;

  // BACKGROUND START
  // Previous education and language skills
  previousEducation: string;
  previousEducationElse?: string;
  previousWorkExperience: string;
  previousWorkExperienceField: string;
  previousYearsUsedInStudies: string;
  previousLanguageExperience: LanguageGrade[];

  // --Way to learn related questions
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

  // --Study support related questions
  fromFamilyMember?: boolean;
  fromFriend?: boolean;
  fromSupportPerson?: boolean;
  noSupport?: boolean;
  studySupportSomethingElse?: boolean;
  studySupportSomethingElseWhat?: string;

  // --Self image related questions
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
  selfImageSomethingElse?: number;
  /**
   * "Wishes for teachers and supervisors"
   */
  wishesForTeachersAndSupervisors?: number;
  // BACKGROUND END

  // POST GRADUATE PLAN START
  /**
   * What are you going to do after Nettiperuskoulu?
   */
  whatNext?: WhatNext;
  /**
   * What next post graduate -> Where are you going to apply?
   */
  postGraduateStudies?: PostGraduateStudies;
  /**
   * If you chose something else, please tell us more
   */
  postGraduateStudiesElse?: string;
  /**
   * Vocational post graduate -> What are you going to study?
   */
  vocationalPostGraduateStudySector?: VocationalStudySector;
  /**
   * If you chose something else, please tell us more
   */
  vocationalPostGraduateStudySectorElse?: string;
  /**
   * You can tell us more about your future plans
   */
  futurePlans?: string;
  // POST GRADUATE PLAN END
}

/**
 * SecondaryStudiesHops
 */
export interface SecondaryStudiesHops {
  type: HopsFormType;

  // BACKGROUND START
  // Previous education and language skills
  previousEducations: PreviousStudiesEntry[];
  nativeLanguage: string;
  studiedLanguagesAtSchool: string;
  studiedLanguagesOther: string;
  languageLearningSkills: string;

  // --Self assessment related questions
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
  /**
   * "More about self assessment"
   */
  moreAboutSelfAssessment?: string;
  // BACKGROUND END

  // POST GRADUATE PLAN START
  /**
   * What are you going to do after Nettilukio
   */
  whatNext: WhatNext[];
  whatNextElse?: string;
  postGraduateStudies: PostGraduateStudies[];
  postGraduateStudiesElse?: string;
  /**
   * Work experience and internships
   */
  workExperienceAndInternships: string;
  hobbies: string;
  otherSkills: string;
  /**
   * Skills learned from hobbies and work experience
   */
  skillsFromHobbiesAndWorklife: string;
  /**
   * I am interested in the following things
   */
  interestedIn: string;
  /**
   * I'm good at these things
   */
  goodAt: string;
  /**
   * Things that are important to me in my future work are
   */
  importantInFutureWork: string;
  /**
   * I have been successful in these subjects during high school
   */
  successfulDuringHighSchool: string;
  /**
   * I have had challenges in these subjects during high school
   */
  challengesDuringHighSchool: string;
  /**
   * I am interested in the following fields of study
   */
  interestedInFieldsOfStudy: string;
  /**
   * Where you can study the fields that interest you
   */
  whereCanStudyFieldsOfInterest: string;
  /**
   * On what basis do you make your postgraduate study plan and career choice?
   */
  basisForPostgraduateStudyAndCareerChoice: string;
  /**
   * What kind of things are you thinking about in your postgraduate studies? Where to get with your study guide?
   */
  thingsMakesYouThink: string;
  /**
   * Comments from the study guide
   */
  postGraduateGuidanceCouncelorComments: string;
  // POST GRADUATE PLAN END
}

export type WhatNext =
  | "WORKING_LIFE"
  | "POSTGRADUATE_STUDIES"
  | "ELSE"
  | "DONT_KNOW";

export const whatNext = {
  workingLife: "WORKING_LIFE",
  postGraduateStudies: "POSTGRADUATE_STUDIES",
  else: "ELSE",
  dontKnow: "DONT_KNOW",
};

export type PostGraduateStudies =
  | "APPRENTICESHIP_TRAINING"
  | "VOCATIONAL_SCHOOL"
  | "UPPER_SECONDARY_SCHOOL"
  | "UNIVERSITY"
  | "UNIVERSITY_OF_APPLIED_SCIENCES"
  | "SECONDARY_SCHOOL"
  | "ELSE";

export const postGraduateStudies = {
  apprenticeshipTraining: "APPRENTICESHIP_TRAINING",
  vocationalSchool: "VOCATIONAL_SCHOOL",
  upperSecondarySchool: "UPPER_SECONDARY_SCHOOL",
  university: "UNIVERSITY",
  universityOfAppliedSciences: "UNIVERSITY_OF_APPLIED_SCIENCES",
  secondarySchool: "SECONDARY_SCHOOL",
  else: "ELSE",
};

/**
 * StudySector
 */
export type VocationalStudySector =
  | "SOCIAL_HEALT_SECTOR"
  | "TRADE_SECTOR"
  | "TRANSPORT_SECTOR"
  | "EDUCATION_SECTOR"
  | "INDUSTRY_SECTOR"
  | "ART_SECTOR"
  | "SOMETHING_ELSE";

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
    whatNext: [],
    postGraduateStudies: [],
    workExperienceAndInternships: "",
    hobbies: "",
    otherSkills: "",
    skillsFromHobbiesAndWorklife: "",
    interestedIn: "",
    goodAt: "",
    importantInFutureWork: "",
    successfulDuringHighSchool: "",
    challengesDuringHighSchool: "",
    interestedInFieldsOfStudy: "",
    whereCanStudyFieldsOfInterest: "",
    basisForPostgraduateStudyAndCareerChoice: "",
    thingsMakesYouThink: "",
    postGraduateGuidanceCouncelorComments: "",
  };
}

/**
 * Helper function to initialize a CompulsoryStudiesHops object
 */
export function initializeCompulsoryStudiesHops(): CompulsoryStudiesHops {
  return {
    type: "compulsory",
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
  };
}

/**
 * Helper function to initialize a CompulsoryStudiesHops object from old structure
 * @param oldForm CompulsoryStudiesHopsOld - the old form structure to convert
 */
export function initializeCompulsoryStudiesHopsFromOld(
  oldForm: CompulsoryStudiesHopsOld
): CompulsoryStudiesHops {
  return {
    type: "compulsory",
    // Starting level data
    previousEducation: oldForm.startingLevel.previousEducation,
    previousEducationElse: oldForm.startingLevel.previousEducationElse,
    previousWorkExperience: oldForm.startingLevel.previousWorkExperience,
    previousWorkExperienceField:
      oldForm.startingLevel.previousWorkExperienceField,
    previousYearsUsedInStudies:
      oldForm.startingLevel.previousYearsUsedInStudies,
    previousLanguageExperience:
      oldForm.startingLevel.previousLanguageExperience,

    // Way to learn data
    byReadingMaterials:
      oldForm.motivationAndStudy.wayToLearn.byReadingMaterials,
    byTakingNotes: oldForm.motivationAndStudy.wayToLearn.byTakingNotes,
    byDoingExercises: oldForm.motivationAndStudy.wayToLearn.byDoingExercises,
    byMemorizing: oldForm.motivationAndStudy.wayToLearn.byMemorizing,
    byWatchingVideos: oldForm.motivationAndStudy.wayToLearn.byWatchingVideos,
    byListeningTeaching:
      oldForm.motivationAndStudy.wayToLearn.byListeningTeaching,
    byExplaining: oldForm.motivationAndStudy.wayToLearn.byExplaining,
    byDiscussing: oldForm.motivationAndStudy.wayToLearn.byDiscussing,
    byWatchingOrDoingExamples:
      oldForm.motivationAndStudy.wayToLearn.byWatchingOrDoingExamples,
    someOtherWay: oldForm.motivationAndStudy.wayToLearn.someOtherWay,

    // Study support data
    fromFamilyMember: oldForm.motivationAndStudy.studySupport.fromFamilyMember,
    fromFriend: oldForm.motivationAndStudy.studySupport.fromFriend,
    fromSupportPerson:
      oldForm.motivationAndStudy.studySupport.fromSupportPerson,
    noSupport: oldForm.motivationAndStudy.studySupport.noSupport,
    studySupportSomethingElse:
      oldForm.motivationAndStudy.studySupport.somethingElse,
    studySupportSomethingElseWhat:
      oldForm.motivationAndStudy.studySupport.somethingElseWhat,

    // Self image data
    likeStudying: oldForm.motivationAndStudy.selfImageAsStudent.likeStudying,
    haveGoals: oldForm.motivationAndStudy.selfImageAsStudent.haveGoals,
    readyToAchieveGoals:
      oldForm.motivationAndStudy.selfImageAsStudent.readyToAchieveGoals,
    alwaysFinishJobs:
      oldForm.motivationAndStudy.selfImageAsStudent.alwaysFinishJobs,
    bePedantic: oldForm.motivationAndStudy.selfImageAsStudent.bePedantic,
    studyingConcentration:
      oldForm.motivationAndStudy.selfImageAsStudent.studyingConcentration,
    affectedByNoise:
      oldForm.motivationAndStudy.selfImageAsStudent.affectedByNoise,
    canFollowInstructions:
      oldForm.motivationAndStudy.selfImageAsStudent.canFollowInstructions,
    canEvaluateOwnWork:
      oldForm.motivationAndStudy.selfImageAsStudent.canEvaluateOwnWork,
    canTakeFeedback:
      oldForm.motivationAndStudy.selfImageAsStudent.canTakeFeedback,
    canUseBasicComputerFunctionalities:
      oldForm.motivationAndStudy.selfImageAsStudent
        .canUseBasicComputerFunctionalities,
    selfImageSomethingElse:
      oldForm.motivationAndStudy.selfImageAsStudent.somethingElse,
    wishesForTeachersAndSupervisors:
      oldForm.motivationAndStudy.selfImageAsStudent
        .wishesForTeachersAndSupervisors,
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
 * Checks if the form uses the old CompulsoryStudiesHops structure
 * @param form any object to check
 * @returns boolean
 */
export const isCompulsoryStudiesHopsOld = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
): form is CompulsoryStudiesHopsOld =>
  form.startingLevel !== undefined || form.motivationAndStudy !== undefined;

/**
 * HopsForm
 */
export type HopsForm = CompulsoryStudiesHops | SecondaryStudiesHops;
