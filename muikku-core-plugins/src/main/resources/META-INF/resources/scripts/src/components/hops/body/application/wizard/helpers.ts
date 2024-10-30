import { TFunction } from "i18next";

/**
 * CompulsoryStudiesFieldsTranslation. Returns the translation for the compulsory studies fields
 * Specifically used for history entries
 * @param t t
 */
export const compulsoryStudiesFieldsTranslation = (
  t: TFunction
): {
  [key: string]: string;
} => ({
  previousEducation: "previousEducation",
  previousEducationElse: "previousEducationElse",
  previousWorkExperience: "previousWorkExperience",
  previousWorkExperienceField: "previousWorkExperienceField",
  previousYearsUsedInStudies: "previousYearsUsedInStudies",
  previousLanguageExperience: "previousLanguageExperience",
  byReadingMaterials: "byReadingMaterials",
  byTakingNotes: "byTakingNotes",
  byDoingExercises: "byDoingExercises",
  byMemorizing: "byMemorizing",
  byWatchingVideos: "byWatchingVideos",
  byListeningTeaching: "byListeningTeaching",
  byExplaining: "byExplaining",
  byDiscussing: "byDiscussing",
  byWatchingOrDoingExamples: "byWatchingOrDoingExamples",
  someOtherWay: "someOtherWay",
  fromFamilyMember: "fromFamilyMember",
  fromFriend: "fromFriend",
  fromSupportPerson: "fromSupportPerson",
  noSupport: "noSupport",
  studySupportSomethingElse: "studySupportSomethingElse",
  studySupportSomethingElseWhat: "studySupportSomethingElseWhat",
  likeStudying: "likeStudying",
  haveGoals: "haveGoals",
  readyToAchieveGoals: "readyToAchieveGoals",
  alwaysFinishJobs: "alwaysFinishJobs",
  bePedantic: "bePedantic",
  studyingConcentration: "studyingConcentration",
  affectedByNoise: "affectedByNoise",
  canFollowInstructions: "canFollowInstructions",
  canEvaluateOwnWork: "canEvaluateOwnWork",
  canTakeFeedback: "canTakeFeedback",
  canUseBasicComputerFunctionalities: "canUseBasicComputerFunctionalities",
  selfImageSomethingElse: "selfImageSomethingElse",
  wishesForTeachersAndSupervisors: "wishesForTeachersAndSupervisors",
});

/**
 * SecondaryStudiesFieldsTranslation. Returns the translation for the secondary studies fields
 * Specifically used for history entries
 * @param t t
 */
export const secondaryStudiesFieldsTranslation = (
  t: TFunction
): { [key: string]: string } => ({
  previousEducation: "previousEducation",
  previousEducationInfo: "previousEducationInfo",
  nativeLanguage: "nativeLanguage",
  studiedLanguagesAtSchool: "studiedLanguagesAtSchool",
  studiedLanguagesOther: "studiedLanguagesOther",
  languageLearningSkills: "languageLearningSkills",
  positiveAttitude: "positiveAttitude",
  goalSetting: "goalSetting",
  goalMotivation: "goalMotivation",
  taskCompletion: "taskCompletion",
  focusAbility: "focusAbility",
  followInstructions: "followInstructions",
  selfAssessment: "selfAssessment",
  receiveFeedback: "receiveFeedback",
  itSkills: "itSkills",
  independentLearningSkills: "independentLearningSkills",
  moreAboutSelfAssessment: "moreAboutSelfAssessment",
});
